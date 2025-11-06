import { Router } from 'express';
import { AppDataSource } from '../../db/data-source';
import { Deal } from '../../entities/Deal';
import { Lead } from '../../entities/Lead';
import { auth, roleGuard } from '../../utils/auth';

const r = Router();

/** POST /api/deals
 * { leadId, value, commission, dateISO?, notes, status: 'won'|'lost' }
 */
r.post('/', auth, roleGuard(['agent','agency_admin','super_admin']), async (req, res) => {
  const { leadId, value, commission, dateISO, notes, status } = req.body;
  const leadRepo = AppDataSource.getRepository(Lead);
  const dealRepo = AppDataSource.getRepository(Deal);

  const lead = await leadRepo.findOne({ where: { id: leadId }, relations: ['property'] });
  if (!lead) return res.status(404).json({ error: 'Lead not found' });
  if (!lead.property) return res.status(400).json({ error: 'Lead must have a property' });

  const d = dealRepo.create({
    lead,
    property: lead.property,
    value: Number(value) || 0,
    commissionPct: commission ? Number(commission) : undefined,
    closedAt: dateISO ? new Date(dateISO) : new Date(),
    closeNotes: notes,
    status: status === 'won' ? 'won' : 'lost',
  });
  await dealRepo.save(d);


  lead.stage = status === 'won' ? 'won' : 'lost';
  await leadRepo.save(lead);

  res.json(d);
});

export default r;
