// Orchestrates: CF retrieval + Two-tower similarity + LTR ranking

import { AppDataSource } from "../../db/data-source";
import { Property } from "../../entities/Property";
import { itemSimilarByCooccurrence, fillProperties } from "./cf";
import { encodeProperty, encodeUserFromHistory, cosine } from "./encoders";
import { rerank } from "./ranker";

export async function userHistoryVectors(userId: string) {
  // Build vectors from user's saved properties (and/or recent interactions)
  const rows = await AppDataSource.getRepository(Property)
    .createQueryBuilder("p")
    .innerJoin("saved_property", "sp", "sp.propertyId = p.id")
    .where("sp.userId = :uid", { uid: userId })
    .andWhere("p.isApproved = true")
    .orderBy("p.createdAt","DESC")
    .limit(100)
    .getMany();

  return rows.map(p => encodeProperty(p as any));
}

export async function similarByContent(propertyId: string, limit = 40) {
  const repo = AppDataSource.getRepository(Property);
  const item = await repo.findOne({ where: { id: propertyId }});
  if (!item || !item.isApproved) return [];
  const target = encodeProperty(item as any);

  // naive candidate pool: latest 1000 approved props (fast & simple)
  const pool = await repo.createQueryBuilder("p")
    .where("p.isApproved = true").orderBy("p.createdAt","DESC").limit(1000).getMany();

  const scored = pool
    .filter(p => p.id !== propertyId)
    .map(p => ({ p, match: cosine(target, encodeProperty(p as any)) }));

  scored.sort((a,b)=> b.match - a.match);
  return scored.slice(0, limit).map(s => s.p);
}

export async function recommendForUser(userId: string, opts: { limit?: number; soft?: Record<string,any> } = {}) {
  const limit = opts.limit ?? 40;

  // 1) collaborative candidates from history
  // collect seeds = last N saved props → co-occur
  const saved = await AppDataSource.query(
    `SELECT sp.propertyId AS id FROM saved_property sp WHERE sp.userId=$1 ORDER BY sp.createdAt DESC LIMIT 20`,
    [userId]
  );
  const seedIds: string[] = saved.map((r:any)=> r.id);

  let cfIds: string[] = [];
  for (const sid of seedIds) {
    const sims = await itemSimilarByCooccurrence(sid, 20);
    cfIds.push(...sims.map(s=>s.id));
  }
  // dedupe
  cfIds = Array.from(new Set(cfIds)).filter(id => !seedIds.includes(id));
  const cfProps = await fillProperties(cfIds.slice(0, 200));

  // 2) content tower: build user vector from history, score against a pool
  const historyVecs = await userHistoryVectors(userId);
  const userVec = historyVecs.length ? encodeUserFromHistory(historyVecs, opts.soft) : null;

  const repo = AppDataSource.getRepository(Property);
  const pool = await repo.createQueryBuilder("p")
    .where("p.isApproved = true").orderBy("p.createdAt","DESC").limit(1000).getMany();

  const contentCands = userVec
    ? pool.map(p => ({ p, match: cosine(userVec, encodeProperty(p as any)) }))
    : pool.map(p => ({ p, match: 0.1 })); // cold-start: small baseline

  // 3) merge + rerank
  const byId = new Map<string, { p: Property; match: number }>();
  for (const p of cfProps) byId.set(p.id, { p, match: 0.6 }); // CF prior
  for (const c of contentCands) {
    const cur = byId.get(c.p.id);
    if (!cur) byId.set(c.p.id, c);
    else cur.match = Math.max(cur.match, c.match);
  }

  // exclude already-saved
  const savedSet = new Set(seedIds);
  const merged = Array.from(byId.values()).filter(x => !savedSet.has(x.p.id));

  const ranked = rerank(merged).slice(0, limit);
  return ranked.map(r => r.p);
}
