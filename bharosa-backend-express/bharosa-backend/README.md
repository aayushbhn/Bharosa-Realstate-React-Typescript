# Bharosa Backend (Node.js + Express + TypeORM + PostgreSQL)

A pragmatic API for Bharosa Real Estate with users/agents, properties, leads, visits (ICS), deals, and a simple recommender.

## Quick Start (Windows / PowerShell)

```powershell
# 0) unzip and enter
cd bharosa-backend

# 1) start infra (Postgres, Redis, Mailhog)
docker compose -f infra\docker-compose.yml up -d

# 2) install deps
pnpm install

# 3) create .env
copy .env.example .env

# 4) run seed data
pnpm seed

# 5) start API
pnpm dev
# -> http://localhost:4000/health
```

## Endpoints (sample)
- `POST /api/auth/register` `{ email, password, name, role? }`
- `POST /api/auth/login` `{ email, password }`
- `GET /api/properties` query: `q,minPrice,maxPrice,beds,baths,status,type,city,lat,lon,radiusKm`
- `GET /api/properties/:id`
- `GET /api/recs/similar/:propertyId`
- `POST /api/leads` (payload includes `customer`, `property`, etc.)
- `PATCH /api/leads/:id/stage` `{ stage, notes }`
- `POST /api/visits` `{ lead, property, dateTime, ... }`
- `GET /api/visits/:id/ics` -> calendar file
- `POST /api/deals` `{ lead, property, closedAt, value, commissionPct?, status?, closeNotes? }`

## Notes
- TypeORM `synchronize=true` in development creates tables automatically.
- The DB image is `postgis/postgis` but we store `lat`/`lon` columns (no PostGIS requirement).
- CORS allows `CLIENT_ORIGIN` (default `http://localhost:3000`).

## Next
- Add RBAC middleware to mutation routes.
- Add Meilisearch integration for instant search.
- Add BullMQ + Redis workers for alerts/notifications.