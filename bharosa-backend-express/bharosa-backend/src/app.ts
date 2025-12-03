import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';             // 👈 add this
import { router as apiRouter } from './routes';

dotenv.config();

export function buildApp() {
  const app = express();

  // 👇 Relax CORP so frontend on :3000 can load images from :4000
  app.use(
    helmet({
      crossOriginResourcePolicy: false,   // 🔑 allow other origins to use our images
    })
  );

  app.use(
    cors({
      origin: process.env.CLIENT_ORIGIN?.split(',') || '*',
      credentials: true,
    })
  );
  app.use(express.json({ limit: '5mb' }));

  // 👇 Serve the uploads folder as static files
  const uploadsDir = path.resolve(process.cwd(), 'uploads');
  console.log('Serving uploads from:', uploadsDir);
  app.use('/uploads', express.static(uploadsDir));

  app.get('/health', (_req, res) => res.json({ ok: true }));
  app.use('/api', apiRouter);

  // not found
  app.use((_req, res) => res.status(404).json({ error: 'Not found' }));
  return app;
}
