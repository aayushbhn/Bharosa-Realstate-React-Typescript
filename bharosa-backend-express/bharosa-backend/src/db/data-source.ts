import 'reflect-metadata';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { User } from '../entities/User';
import { Agency } from '../entities/Agency';
import { AgentProfile } from '../entities/AgentProfile';
import { Property } from '../entities/Property';
import { Amenity } from '../entities/Amenity';
import { PropertyAmenity } from '../entities/PropertyAmenity';
import { Lead } from '../entities/Lead';
import { Visit } from '../entities/Visit';
import { Deal } from '../entities/Deal';
import { Interaction } from '../entities/Interaction';
import { SavedProperty } from '../entities/SavedProperty';
import { SavedSearch } from '../entities/SavedSearch';
import { Notification } from '../entities/Notification';

dotenv.config();

const ssl = process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false;

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  ssl: ssl as any,
  synchronize: process.env.NODE_ENV !== 'production',
  logging: false,
  entities: [
    User, Agency, AgentProfile, Property, Amenity, PropertyAmenity, Lead, Visit, Deal,
    Interaction, SavedProperty, SavedSearch, Notification
  ],
  migrations: [],
});

export async function ensureExtensions() {
  // Enable PostGIS if available; ignore errors on plain postgres images.
  try {
    await AppDataSource.query('CREATE EXTENSION IF NOT EXISTS postgis');
  } catch {}
}