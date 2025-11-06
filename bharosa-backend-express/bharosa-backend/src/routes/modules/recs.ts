import { Router } from 'express';
import { AppDataSource } from '../../db/data-source';
import { Property } from '../../entities/Property';
import { itemSimilarByCooccurrence, fillProperties } from "../../services/recs/cf";
import { recommendForUser, similarByContent } from "../../services/recs";
import { auth } from "../../utils/auth";
const r = Router();

// Simple content-based similarity
r.get('/similar/:propertyId', async (req, res) => {
  const repo = AppDataSource.getRepository(Property);
  const curr = await repo.findOne({ where: { id: req.params.propertyId } });
  if (!curr) return res.status(404).json({ error: 'Not found' });
  const list = await repo.find({ where: { city: curr.city, type: curr.type } });
  function vec(p: Property) { return [Number(p.price||0), Number(p.areaSqft||0), Number(p.beds||0), Number(p.baths||0)]; }
  function norm(v:number[]) { const m = Math.sqrt(v.reduce((s,x)=>s+x*x,0))||1; return v.map(x=>x/m); }
  const v0 = norm(vec(curr));
  const ranked = list.filter(p=>p.id!==curr.id).map(p=>{ const v=norm(vec(p)); const score=v0.reduce((s,x,i)=>s+x*v[i],0); return {p,score}; }).sort((a,b)=>b.score-a.score).slice(0,10).map(x=>x.p);
  res.json(ranked);
});


/** Item-based similar (blend CF + content; CF first, fallback to content) */
r.get("/similar/:id", async (req, res) => {
  const id = String(req.params.id);
  // try CF
  const cf = await itemSimilarByCooccurrence(id, 20);
  if (cf.length >= 5) {
    const props = await fillProperties(cf.map(c=>c.id));
    return res.json(props.slice(0,20));
  }
  // fallback to content tower
  const content = await similarByContent(id, 20);
  return res.json(content);
});

/** Personalized home feed (needs auth) */
r.get("/home", auth, async (req: any, res) => {
  const userId = req.user.sub as string;
  const soft = {
    // optional: accept current filters to tilt vector
    status: req.query.status,
    type: req.query.type,
    city: req.query.city,
    beds: req.query.beds,
  };
  const recs = await recommendForUser(userId, { limit: 30, soft });
  res.json(recs);
});

/** Cold-start popular (quick baseline) */
r.get("/popular", async (_req, res) => {
  // simple popularity = most-saved approved listings, recent-first tie-break
  const rows = await AppDataSource.query(`
    SELECT p.*
    FROM property p
    LEFT JOIN LATERAL (
      SELECT COUNT(*)::int AS saves
      FROM saved_property sp WHERE sp.propertyId = p.id
    ) pop ON TRUE
    WHERE p.isApproved = true
    ORDER BY pop.saves DESC NULLS LAST, p.createdAt DESC
    LIMIT 30
  `);
  res.json(rows as Property[]);
});


export default r;