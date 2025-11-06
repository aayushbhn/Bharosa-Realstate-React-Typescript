import { Router } from 'express';
import { AppDataSource } from '../../db/data-source';
import { SavedProperty } from '../../entities/SavedProperty';
import { Property } from '../../entities/Property';
import { User } from '../../entities/User';
import { auth } from '../../utils/auth';

const r = Router();

// all endpoints require auth
r.use(auth);

// GET /api/saved -> list saved with property
r.get('/', async (req: any, res) => {
  const uid = req.user.sub as string;
  const repo = AppDataSource.getRepository(SavedProperty);
  const list = await repo.find({
    where: { user: { id: uid } as any },
    relations: ['property'] as any,
    order: { savedAt: 'DESC' }
  });
  res.json(list);
});

// POST /api/saved/:propertyId -> save (idempotent)
r.post('/:propertyId', async (req: any, res) => {
  const uid = req.user.sub as string;
  const pid = req.params.propertyId;
  const savedRepo = AppDataSource.getRepository(SavedProperty);
  const propRepo = AppDataSource.getRepository(Property);
  const userRepo = AppDataSource.getRepository(User);

  const property = await propRepo.findOne({ where: { id: pid } });
  if (!property) return res.status(404).json({ error: 'Property not found' });
  const user = await userRepo.findOne({ where: { id: uid } });
  if (!user) return res.status(401).json({ error: 'User not found' });

  const existing = await savedRepo.findOne({ where: { user: { id: uid } as any, property: { id: pid } as any } });
  if (existing) return res.json(existing);

  const saved = savedRepo.create({ user, property });
  await savedRepo.save(saved);
  res.json(saved);
});

// DELETE /api/saved/:propertyId -> unsave (idempotent)
r.delete('/:propertyId', async (req: any, res) => {
  const uid = req.user.sub as string;
  const pid = req.params.propertyId;
  const repo = AppDataSource.getRepository(SavedProperty);
  const existing = await repo.findOne({ where: { user: { id: uid } as any, property: { id: pid } as any } });
  if (existing) await repo.remove(existing);
  res.json({ ok: true });
});

// GET /api/saved/check/:propertyId -> {saved:boolean}
r.get('/check/:propertyId', async (req: any, res) => {
  const uid = req.user.sub as string;
  const pid = req.params.propertyId;
  const repo = AppDataSource.getRepository(SavedProperty);
  const existing = await repo.findOne({ where: { user: { id: uid } as any, property: { id: pid } as any } });
  res.json({ saved: !!existing });
});

export default r;
