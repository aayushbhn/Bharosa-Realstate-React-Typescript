import { Router } from "express";
import { AppDataSource } from "../../db/data-source";
import { Visit } from "../../entities/Visit";
import { Lead } from "../../entities/Lead";
import { Property } from "../../entities/Property";
import { createEvents } from "ics";
import { auth, roleGuard } from "../../utils/auth";

const r = Router();

/** POST /api/visits
 * body:
 *  { lead: { id }, property: { id }, dateTime: ISO, meetingLocation?, internalNotes? }
 */
r.post("/", async (req, res) => {
  const visitRepo = AppDataSource.getRepository(Visit);
  const leadRepo = AppDataSource.getRepository(Lead);
  const propRepo = AppDataSource.getRepository(Property);

  const { lead, property, dateTime, meetingLocation, internalNotes } = req.body || {};

  const leadEntity = await leadRepo.findOne({ where: { id: lead?.id } });
  const propEntity = await propRepo.findOne({ where: { id: property?.id } });

  if (!leadEntity || !propEntity || !dateTime) {
    return res.status(400).json({ error: "lead.id, property.id, and dateTime are required" });
  }

  const v = visitRepo.create({
    lead: leadEntity,
    property: propEntity,
    dateTime: new Date(dateTime),
    meetingLocation,
    internalNotes,
  });

  await visitRepo.save(v);
  return res.json({ id: v.id });
});

/** GET /api/visits/:id/ics  -> download .ics */
r.get("/:id/ics", async (req, res) => {
  const visitRepo = AppDataSource.getRepository(Visit);
  const v = await visitRepo.findOne({
    where: { id: req.params.id },
    relations: ["property", "lead", "lead.customer"],
  });
  if (!v) return res.status(404).json({ error: "Not found" });

  const dt = new Date(v.dateTime);
  const { error, value } = createEvents([
    {
      title: `Property Visit — ${v.property?.title ?? "Property"}`,
      description: v.internalNotes || "",
      location: v.meetingLocation || [v.property?.area, v.property?.city].filter(Boolean).join(", "),
      start: [dt.getFullYear(), dt.getMonth() + 1, dt.getDate(), dt.getHours(), dt.getMinutes()],
      duration: { minutes: 45 },
    },
  ]);
  if (error) return res.status(500).json({ error: error.message || "ICS error" });

  res.setHeader("Content-Type", "text/calendar; charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; filename=visit-${v.id}.ics`);
  return res.send(value);
});

/** GET /api/visits/my  (agent) */
r.get(
  "/my",
  auth,
  roleGuard(["agent", "agency_admin", "super_admin"]),
  async (req: any, res) => {
    const uid = req.user.sub as string;
    const repo = AppDataSource.getRepository(Visit);
    const list = await repo
      .createQueryBuilder("v")
      .leftJoinAndSelect("v.property", "p")
      .leftJoinAndSelect("p.agent", "a")
      .leftJoin("a.user", "u")
      .where("u.id = :uid", { uid })
      .orderBy("v.dateTime", "DESC")
      .getMany();
    res.json(list);
  }
);

/** PATCH /api/visits/:id/status -> { status: 'scheduled'|'completed'|'no_show' } */
r.patch(
  "/:id/status",
  auth,
  roleGuard(["agent", "agency_admin", "super_admin"]),
  async (req, res) => {
    const repo = AppDataSource.getRepository(Visit);
    const v = await repo.findOne({ where: { id: req.params.id } });
    if (!v) return res.status(404).json({ error: "Not found" });
    v.status = req.body.status;
    await repo.save(v);
    res.json(v);
  }
);

/** PATCH /api/visits/:id/revisit -> { reason?, newDateTimeISO? } */
r.patch(
  "/:id/revisit",
  auth,
  roleGuard(["agent", "agency_admin", "super_admin"]),
  async (req, res) => {
    const repo = AppDataSource.getRepository(Visit);
    const v = await repo.findOne({ where: { id: req.params.id } });
    if (!v) return res.status(404).json({ error: "Not found" });
    v.isRevisit = true;
    v.revisitReason = req.body.reason || null;
    if (req.body.newDateTimeISO) v.dateTime = new Date(req.body.newDateTimeISO);
    await repo.save(v);
    res.json(v);
  }
);

export default r;
