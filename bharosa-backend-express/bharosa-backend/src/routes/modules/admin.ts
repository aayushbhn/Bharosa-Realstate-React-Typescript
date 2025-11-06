import { Router } from 'express';
import { AppDataSource } from '../../db/data-source';
import { Property } from '../../entities/Property';
import { auth, roleGuard } from '../../utils/auth';

const r = Router();
r.use(auth, roleGuard(['agency_admin','super_admin']));

// GET /api/admin/listings/pending
r.get('/listings/pending', async (_req,res)=>{
  const repo = AppDataSource.getRepository(Property);
  const list = await repo.find({ where: { isApproved: false }, order: { createdAt: 'DESC' } });
  res.json(list);
});

// PATCH /api/admin/listings/:id/approve
r.patch('/listings/:id/approve', async (req,res)=>{
  const repo = AppDataSource.getRepository(Property);
  const p = await repo.findOne({ where: { id: req.params.id } });
  if (!p) return res.status(404).json({ error: 'Not found' });
  p.isApproved = true;
  await repo.save(p);
  res.json({ ok: true });
});

export default r;
