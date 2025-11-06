import { Router } from 'express';
import { AppDataSource } from '../../db/data-source';
import { User, Role } from '../../entities/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const r = Router();

r.post('/register', async (req, res) => {
  const { email, password, name, role } = req.body as { email:string; password:string; name:string; role?: Role };
  const repo = AppDataSource.getRepository(User);
  const existing = await repo.findOne({ where: { email } });
  if (existing) return res.status(400).json({ error: 'Email exists' });
  const user = repo.create({ email, name, role: role || 'customer', passwordHash: await bcrypt.hash(password, 10) });
  await repo.save(user);
  res.json({ id: user.id, email: user.email, name: user.name, role: user.role });
});

r.post('/login', async (req, res) => {
  const { email, password } = req.body as { email: string; password: string };
  const repo = AppDataSource.getRepository(User);
  const user = await repo.findOne({ where: { email } });
  if (!user) return res.status(401).json({ error: 'Invalid' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Invalid' });
  const token = jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: process.env.JWT_EXPIRES || '7d' });
  res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
});

export default r;