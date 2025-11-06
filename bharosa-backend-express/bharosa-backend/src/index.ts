import 'reflect-metadata';
import dotenv from 'dotenv';
import { AppDataSource, ensureExtensions } from './db/data-source';
import { buildApp } from './app';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from "path";
import express from "express";



dotenv.config();

async function main() {
  await AppDataSource.initialize();
  await ensureExtensions();
  const app = buildApp();
  const httpServer = createServer(app);
  const io = new Server(httpServer, { cors: { origin: '*'}});
  app.use("/uploads", express.static(path.resolve(process.cwd(), "uploads")));

  io.on('connection', (socket) => {
    socket.on('join', (room: string) => socket.join(room));
  });
  const port = Number(process.env.PORT || 4000);
  httpServer.listen(port, () => console.log(`API on :${port}`));
}

main().catch((e) => { console.error(e); process.exit(1); });