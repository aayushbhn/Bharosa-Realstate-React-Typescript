// Fast, DB-only collaborative filtering: co-save / co-view counts -> cosine.

import { AppDataSource } from "../../db/data-source";
import { Property } from "../../entities/Property";

export interface SimilarItem { id: string; score: number; }

export async function itemSimilarByCooccurrence(propertyId: string, limit = 20): Promise<SimilarItem[]> {
  // Uses saved_properties and interactions tables if you have both; using saved as primary.
  const q = `
  WITH u AS (
    SELECT sp."userId"
    FROM saved_property sp
    WHERE sp."propertyId" = $1
  ),
  co AS (
    SELECT sp."propertyId" AS other_id, COUNT(*) AS cnt
    FROM saved_property sp
    JOIN u ON u."userId" = sp."userId"
    WHERE sp."propertyId" <> $1
    GROUP BY sp."propertyId"
  ),
  norms AS (
    SELECT sp."propertyId", COUNT(*) AS n
    FROM saved_property sp
    GROUP BY sp."propertyId"
  )
  SELECT co.other_id AS id,
         (co.cnt::float / GREATEST(1,SQRT(n1.n) * SQRT(n2.n))) AS score
  FROM co
  JOIN norms n1 ON n1."propertyId" = $1
  JOIN norms n2 ON n2."propertyId" = co.other_id
  ORDER BY score DESC
  LIMIT $2;
`;

  const rows = await AppDataSource.query(q, [propertyId, limit]);
  return rows.map((r:any)=>({ id: r.id, score: Number(r.score)}));
}

export async function fillProperties(ids: string[]): Promise<Property[]> {
  if (ids.length === 0) return [];
  const repo = AppDataSource.getRepository(Property);
  const list = await repo
    .createQueryBuilder("p")
    .where("p.id IN (:...ids)", { ids })
    .andWhere("p.isApproved = true")
    .getMany();
  // keep original order
  const byId = new Map(list.map(p=>[p.id,p]));
  return ids.map(id => byId.get(id)).filter(Boolean) as Property[];
}
