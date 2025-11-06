import { Router } from "express";
import { AppDataSource } from "../../db/data-source";
import { Property } from "../../entities/Property";
import { AgentProfile } from "../../entities/AgentProfile";
import { auth, roleGuard } from "../../utils/auth";
import multer from "multer";
import path from "path";

const r = Router();
const upload = multer({ dest: path.resolve(process.cwd(), "uploads") });

// put this near the top of properties.ts, e.g. right after `const upload = ...`
function parseCoord(v: any): number | null {
  if (v == null || v === "") return null;
  if (typeof v === "number") return v;
  const s = String(v).trim();
  // supports: "27.6747", "-27.6", "27.6747° N", "85.2804 E"
  const m = s.match(/^(-?\d+(?:\.\d+)?)\s*(?:°)?\s*([NSEW])?$/i);
  if (!m) return Number(s);
  let n = parseFloat(m[1]);
  const hemi = (m[2] || "").toUpperCase();
  if (hemi === "S" || hemi === "W") n = -Math.abs(n);
  if (hemi === "N" || hemi === "E") n = Math.abs(n);
  return n;
}



const UUID_RE =
  "[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}";

/** LIST (filters + sort) */
r.get("/", async (req, res) => {
  const { q, minPrice, maxPrice, beds, baths, status, type, sort } = req.query as any;

  const repo = AppDataSource.getRepository(Property);
  const qb = repo.createQueryBuilder("p").where("p.isApproved = :appr", { appr: true });

  if (q)
    qb.andWhere(
      "(LOWER(p.title) LIKE :q OR LOWER(p.city) LIKE :q OR LOWER(p.area) LIKE :q)",
      { q: `%${String(q).toLowerCase()}%` }
    );
  if (minPrice) qb.andWhere("p.price >= :minPrice", { minPrice: Number(minPrice) });
  if (maxPrice) qb.andWhere("p.price <= :maxPrice", { maxPrice: Number(maxPrice) });
  if (beds) qb.andWhere("p.beds >= :beds", { beds: Number(beds) });
  if (baths) qb.andWhere("p.baths >= :baths", { baths: Number(baths) });
  if (status) qb.andWhere("p.status = :status", { status });
  if (type) qb.andWhere("p.type = :type", { type });

  switch (sort) {
    case "price_asc": qb.orderBy("p.price", "ASC"); break;
    case "price_desc": qb.orderBy("p.price", "DESC"); break;
    case "newest":
    default: qb.orderBy("p.createdAt", "DESC");
  }

  res.json(await qb.getMany());
});

/** AGENT: my listings */
r.get("/mine",
  auth, roleGuard(["agent","agency_admin","super_admin"]),
  async (req:any,res)=>{
    const uid = req.user.sub as string;
    const repo = AppDataSource.getRepository(Property);
    const list = await repo.createQueryBuilder("p")
      .leftJoin("p.agent","a")
      .leftJoin("a.user","u")
      .where("u.id = :uid", { uid })
      .orderBy("p.createdAt","DESC")
      .getMany();
    res.json(list);
});

/** AGENT: create listing */
r.post(
  "/",
  auth,
  roleGuard(["agent", "agency_admin", "super_admin"]),
  async (req: any, res) => {
    const uid = req.user.sub as string;
    const agentRepo = AppDataSource.getRepository(AgentProfile);
    const propRepo = AppDataSource.getRepository(Property);

    const agent = await agentRepo
      .createQueryBuilder("a")
      .leftJoin("a.user", "u")
      .where("u.id = :uid", { uid })
      .getOne();

    if (!agent) return res.status(400).json({ error: "No agent profile for user" });

    const {
      title,
      description,                    // <-- required
      price,
      city,
      area,
      beds,
      baths,
      areaSqft,
      status,
      type,
      amenities,
      furnishing,
      possessionDate,
      lat,
      lng,
    } = req.body || {};

    // ✅ basic required validation
    if (!title || !description || price == null) {
      return res
        .status(400)
        .json({ error: "title, description and price are required" });
    }

    const p = propRepo.create({
      title,
      description,                    // <-- make sure we save it
      price: Number(price) || 0,
      city,
      area,
      beds: Number(beds) || 0,
      baths: Number(baths) || 0,
      areaSqft: areaSqft != null ? Number(areaSqft) : null,
      status,                         // 'sale' | 'rent'
      type,                           // 'apartment' | 'house' | ...
      amenities:
        typeof amenities === "string"
          ? amenities
              .split(",")
              .map((s: string) => s.trim())
              .filter(Boolean)
          : amenities,
      furnishing,
      possessionDate: possessionDate ? new Date(possessionDate) : null,
      lat: parseCoord(lat),           // <-- supports "27.6747° N"
      lng: parseCoord(lng),           // <-- supports "85.2804° E"
      agent,
      isApproved: false,              // requires admin approval
      imageUrls: [],
    });

    await propRepo.save(p);
    res.json(p);
  }
);

/** AGENT: update (only own listing) */
r.patch(`/:id(${UUID_RE})`,
  auth, roleGuard(["agent","agency_admin","super_admin"]),
  async (req:any,res)=>{
    const uid = req.user.sub as string;
    const repo = AppDataSource.getRepository(Property);

    const p = await repo.createQueryBuilder("p")
      .leftJoin("p.agent","a").leftJoin("a.user","u")
      .where("p.id = :id", { id: req.params.id })
      .andWhere("u.id = :uid", { uid })
      .getOne();

    if (!p) return res.status(404).json({ error: "Not found or not yours" });

    const patch = req.body || {};
    if (patch.amenities && typeof patch.amenities === "string")
      patch.amenities = patch.amenities.split(",").map((s:string)=>s.trim()).filter(Boolean);

    Object.assign(p, {
      ...patch,
      description: patch.description != null ? patch.description : p.description,  // <--
      price: patch.price != null ? Number(patch.price) : p.price,
      beds: patch.beds != null ? Number(patch.beds) : p.beds,
      baths: patch.baths != null ? Number(patch.baths) : p.baths,
      areaSqft: patch.areaSqft != null ? Number(patch.areaSqft) : p.areaSqft,
      lat: patch.lat != null ? parseCoord(patch.lat) : p.lat,     // <--
      lng: patch.lng != null ? parseCoord(patch.lng) : p.lng,     // <--
      possessionDate: patch.possessionDate
        ? new Date(patch.possessionDate)
        : p.possessionDate,
    });
    

    // any edit sets back to pending approval
    p.isApproved = false;

    await repo.save(p);
    res.json(p);
});

/** AGENT: upload images */
r.post(`/:id(${UUID_RE})/images`,
  auth, roleGuard(["agent","agency_admin","super_admin"]),
  upload.array("images", 10),
  async (req:any,res)=>{
    const uid = req.user.sub as string;
    const repo = AppDataSource.getRepository(Property);

    const p = await repo.createQueryBuilder("p")
      .leftJoin("p.agent","a").leftJoin("a.user","u")
      .where("p.id = :id", { id: req.params.id })
      .andWhere("u.id = :uid", { uid })
      .getOne();
    if (!p) return res.status(404).json({ error: "Not found or not yours" });

    const files = (req.files || []) as Express.Multer.File[];
    const urls = files.map(f => `/uploads/${path.basename(f.path)}`);
    p.imageUrls = [...(p.imageUrls || []), ...urls];

    // editing photos also resets approval
    p.isApproved = false;

    await repo.save(p);
    res.json({ imageUrls: p.imageUrls });
});

/** DETAIL (UUID only) */
r.get(`/:id(${UUID_RE})`, async (req, res) => {
  const repo = AppDataSource.getRepository(Property);
  const p = await repo.findOne({ where: { id: req.params.id } });
  if (!p) return res.status(404).json({ error: "Not found" });
  res.json(p);
});

export default r;
