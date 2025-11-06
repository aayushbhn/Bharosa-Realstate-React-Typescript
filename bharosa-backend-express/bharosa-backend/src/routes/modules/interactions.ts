import { Router } from 'express';
import { AppDataSource } from '../../db/data-source';
import { Interaction } from '../../entities/Interaction';
import { Property } from '../../entities/Property';
import { auth } from '../../utils/auth';

const r = Router();

/** POST /api/interactions/contact
 * body: { propertyId: string, channel: 'whatsapp'|'call'|'email' }
 * optional auth; if logged in we attach user id
 */
r.post('/contact', async (req: any, res) => {
  const { propertyId, channel } = req.body || {};
  if (!propertyId || !channel) return res.status(400).json({ error: 'propertyId and channel required' });

  const prop = await AppDataSource.getRepository(Property).findOne({ where: { id: propertyId } });
  if (!prop) return res.status(404).json({ error: 'Property not found' });

  const tokenUser = req.user?.sub ?? null; // will be set if auth() ran before
  const repo = AppDataSource.getRepository(Interaction);
  const i = repo.create({
    type: 'contact',
    channel,
    property: prop,
    userId: tokenUser || null,
    meta: {},
  });
  await repo.save(i);
  res.json({ ok: true });
});

// optional: protect a GET for admin analytics later
export default r;
