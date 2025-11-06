import { Router } from 'express';
import { AppDataSource } from '../../db/data-source';
import { Lead } from '../../entities/Lead';
import { User } from '../../entities/User';
import { Property } from '../../entities/Property';
import { auth, roleGuard } from '../../utils/auth';
import bcrypt from 'bcryptjs';

const r = Router();

/**
 * Create a lead
 * Accepts either:
 *  - { customerId, propertyId, notes? }
 *  - { name, email, phone?, propertyId, notes? }  // creates or reuses a 'customer' user
 */
r.post('/', async (req, res) => {
  const { customerId, name, email, phone, propertyId, notes } = req.body as any;

  const userRepo = AppDataSource.getRepository(User);
  const propRepo = AppDataSource.getRepository(Property);
  const leadRepo = AppDataSource.getRepository(Lead);

  let customer: User | null = null;

  if (customerId) {
    customer = await userRepo.findOne({ where: { id: customerId } });
  } else if (email) {
    customer = await userRepo.findOne({ where: { email } });
    if (!customer) {
      customer = userRepo.create({
        email,
        name: name || email.split('@')[0],
        phone,
        role: 'customer',
        passwordHash: await bcrypt.hash(Math.random().toString(36).slice(2), 10),
      });
      await userRepo.save(customer);
    }
  }

  if (!customer) return res.status(400).json({ error: 'Missing customerId or email' });
  if (!propertyId) return res.status(400).json({ error: 'Missing propertyId' });

  const property = await propRepo.findOne({ where: { id: propertyId } });
  if (!property) return res.status(404).json({ error: 'Property not found' });

  const lead = leadRepo.create({ customer, property, notes, stage: 'new' });
  await leadRepo.save(lead);
  // after await leadRepo.save(lead);
  req.app.get('io')?.to(`agent:${property.agent?.user?.id}`).emit('lead:new', { id: lead.id });

  res.json(lead);
});

r.patch('/:id/stage', async (req, res) => {
  const repo = AppDataSource.getRepository(Lead);
  const lead = await repo.findOne({ where: { id: req.params.id } });
  if (!lead) return res.status(404).json({ error: 'Not found' });
  lead.stage = req.body.stage;
  lead.notes = req.body.notes;
  await repo.save(lead);
  res.json(lead);
});

/* existing POST / and PATCH /:id/stage ... keep them */

/** Secure stage changes to agents/admins only */
r.patch('/:id/stage', auth, roleGuard(['agent','agency_admin','super_admin']), async (req, res) => {
  const repo = AppDataSource.getRepository(Lead);
  const lead = await repo.findOne({ where: { id: req.params.id } });
  if (!lead) return res.status(404).json({ error: 'Not found' });
  lead.stage = req.body.stage;
  lead.notes = req.body.notes;
  await repo.save(lead);
  res.json(lead);
});

/** GET /api/leads/my?stage=qualified -> leads for the current agent */
r.get('/my', auth, roleGuard(['agent','agency_admin','super_admin']), async (req: any, res) => {
  const uid = req.user.sub as string;
  const { stage } = req.query as { stage?: string };
  const repo = AppDataSource.getRepository(Lead);
  const qb = repo.createQueryBuilder('l')
    .leftJoinAndSelect('l.property', 'p')
    .leftJoinAndSelect('l.customer', 'c')
    .leftJoin('p.agent', 'a')
    .leftJoin('a.user', 'u')
    .where('u.id = :uid', { uid })
    .orderBy('l.createdAt', 'DESC');
  if (stage) qb.andWhere('l.stage = :stage', { stage });
  const list = await qb.getMany();
  res.json(list);
});

export default r;
