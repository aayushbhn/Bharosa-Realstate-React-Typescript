import { Router } from 'express';
import { AppDataSource } from '../../db/data-source';
import { AgentProfile } from '../../entities/AgentProfile';
import { Property } from '../../entities/Property';

const r = Router();

// list agents (keep this above the :id route)
r.get('/', async (req, res) => {
  const { q, specialization, language, city } = req.query as Record<string, string | undefined>;
  const repo = AppDataSource.getRepository(AgentProfile);

  const agents = await repo.find({ relations: ['user', 'agency'] });
  let list = agents;

  if (q) list = list.filter(a => a.user?.name?.toLowerCase().includes(q.toLowerCase()));
  if (specialization) list = list.filter(a => a.specializations?.includes(specialization));
  if (language) list = list.filter(a => a.languages?.includes(language));

  if (city) {
    const propRepo = AppDataSource.getRepository(Property);
    const active = await propRepo.find({ where: { city }, relations: ['agent'] as any });
    const agentIds = new Set(active.map(p => (p as any).agent?.id));
    list = list.filter(a => agentIds.has(a.id));
  }

  res.json(list);
});

// ✅ only match UUIDs here (prevents '/api/agents/visits' from hitting this)
const UUID_RE = '[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}';
r.get(`/:id(${UUID_RE})`, async (req, res) => {
  const repo = AppDataSource.getRepository(AgentProfile);
  const propRepo = AppDataSource.getRepository(Property);

  const id = req.params.id;
  const agent = await repo.findOne({ where: { id }, relations: ['user', 'agency'] });
  if (!agent) return res.status(404).json({ error: 'Not found' });

  const listings = await propRepo.find({ where: { agent: { id: agent.id } as any } });
  res.json({ agent, listings });
});

export default r;
