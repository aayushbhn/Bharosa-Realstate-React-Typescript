// Lightweight “two-tower” encoders using categorical hashing + bins.
// No external ML deps; produces numeric vectors you can cosine-compare.

import crypto from "crypto";
import type { Property } from "../../entities/Property";

export type Vec = number[];

function hashBucket(s: string, buckets = 512) {
  const h = crypto.createHash("sha1").update(s).digest();
  // take first 4 bytes
  const x = h.readUInt32BE(0);
  return x % buckets;
}
export function zeros(n: number): Vec { return Array(n).fill(0); }
export function addInPlace(a: Vec, b: Vec) { for (let i=0;i<a.length;i++) a[i]+=b[i]; }
export function scaleInPlace(a: Vec, s: number) { for (let i=0;i<a.length;i++) a[i]*=s; }

export function cosine(a: Vec, b: Vec) {
  let dot=0, na=0, nb=0;
  for (let i=0;i<a.length;i++){ dot+=a[i]*b[i]; na+=a[i]*a[i]; nb+=b[i]*b[i]; }
  return dot / (Math.sqrt(na)+1e-9) / (Math.sqrt(nb)+1e-9);
}

const DIM = 512; // small & fast

function bump(vec: Vec, key: string, w = 1) {
  const i = hashBucket(key, DIM);
  vec[i] += w;
}

function priceBucket(p: number|undefined|null) {
  if (p == null) return "p:unknown";
  // tune these to your market
  if (p < 5_000_000) return "p:low";
  if (p < 15_000_000) return "p:mid";
  if (p < 30_000_000) return "p:upper";
  return "p:luxury";
}
function areaBucket(a: number|undefined|null) {
  if (a == null) return "a:unknown";
  if (a < 800) return "a:S";
  if (a < 1200) return "a:M";
  if (a < 1800) return "a:L";
  return "a:XL";
}

/** Item encoder: consistent, deterministic */
export function encodeProperty(p: Property): Vec {
  const v = zeros(DIM);
  if (p.status)     bump(v, `status:${p.status}`, 1.0);
  if (p.type)       bump(v, `type:${p.type}`, 1.2);
  if (p.city)       bump(v, `city:${p.city.toLowerCase()}`, 1.0);
  if (p.area)       bump(v, `area:${p.area.toLowerCase()}`, 0.6);
  if (p.beds!=null) bump(v, `beds:${p.beds}`, 0.8);
  if (p.baths!=null) bump(v, `baths:${p.baths}`, 0.6);
  bump(v, priceBucket(typeof p.price==="string"? Number(p.price): (p as any).price), 1.2);
  bump(v, areaBucket(p.areaSqft), 0.8);
  (p.amenities||[]).forEach(a=> bump(v, `amen:${String(a).toLowerCase()}`, 0.5));
  return v;
}

/** User encoder: average of their interacted item vectors (+ soft prefs) */
export function encodeUserFromHistory(itemVecs: Vec[], softPrefs: Record<string,any> = {}): Vec {
  const v = zeros(DIM);
  itemVecs.forEach(iv => addInPlace(v, iv));
  // Optional nudges from soft filters (e.g., current search filters)
  Object.entries(softPrefs).forEach(([k,val])=>{
    if (val==null || val==="") return;
    bump(v, `pref:${k}:${String(val).toLowerCase()}`, 0.7);
  });
  if (itemVecs.length > 0) scaleInPlace(v, 1 / itemVecs.length);
  return v;
}
