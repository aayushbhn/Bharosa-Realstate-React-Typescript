// Simple learning-to-rank placeholder.
// Today: deterministic weighted score. Tomorrow: load a LightGBM/XGBoost JSON model.

import type { Property } from "../../entities/Property";

export interface RankFeature {
  priceScore: number;
  recencyDays: number;
  photoCount: number;
  matchScore: number; // similarity from encoders/cf
}
export function features(p: Property, matchScore: number): RankFeature {
  const price = typeof p.price === "string" ? Number(p.price) : (p as any).price;
  const recencyDays = Math.max(0, (Date.now() - new Date(p.createdAt).getTime()) / 86400000);
  const photoCount = (p.imageUrls?.length ?? 0);
  // priceScore: prefer mid buckets in general (gaussian-ish)
  let priceScore = 0.0;
  if (price > 0) {
    if (price < 5_000_000) priceScore = 0.6;
    else if (price < 15_000_000) priceScore = 1.0;
    else if (price < 30_000_000) priceScore = 0.9;
    else priceScore = 0.7;
  }
  return { priceScore, recencyDays, photoCount, matchScore };
}

export function rankScore(f: RankFeature) {
  // Heuristic LTR weights (tweakable). Lower recencyDays is better, so use negative weight.
  return (
    1.8 * f.matchScore +
    0.7 * f.priceScore +
    0.2 * Math.min(10, f.photoCount) -
    0.02 * Math.min(60, f.recencyDays)
  );
}

export function rerank<T extends { p: Property; match: number }>(cands: T[]): T[] {
  return [...cands]
    .map(c => ({ ...c, _s: rankScore(features(c.p, c.match)) }))
    .sort((a,b)=> b._s - a._s)
    .map(({_s, ...rest})=> rest as T);
}
