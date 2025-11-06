# Bharosa Backend (Node.js + Express + TypeORM + PostgreSQL)

A pragmatic API for Bharosa Real Estate with users/agents, properties, leads, visits (ICS), deals, and a simple recommender.

## Quick Start (Windows / PowerShell)

```powershell
# 0) Navigate to backend directory
cd bharosa-backend-express/bharosa-backend

# 1) Start infrastructure (Postgres, Redis, Mailhog)
docker compose -f infra/docker-compose.yml up -d

# 2) Install dependencies
pnpm install

# 3) Create .env file
copy .env.example .env

# 4) Run seed data
pnpm seed

# 5) Start API in development mode
pnpm dev
# -> http://localhost:4000/health
```

## Development

### Start Backend Server

```powershell
cd bharosa-backend-express/bharosa-backend
pnpm dev
```

The server starts on port 4000 (or the `PORT` specified in `.env`). You should see: `API on :4000`.

**Entry point:** `src/index.ts` (imports `buildApp` from `app.ts`).

### Production Build

```powershell
pnpm build
pnpm start
```

## Frontend Setup

To start the frontend application:

```powershell
cd bharosa-frontend-nextjs/bharosa-frontend
npm run dev
```

## API Endpoints

- `POST /api/auth/register` `{ email, password, name, role? }`
- `POST /api/auth/login` `{ email, password }`
- `GET /api/properties` query: `q,minPrice,maxPrice,beds,baths,status,type,city,lat,lon,radiusKm`
- `GET /api/properties/:id`
- `GET /api/recs/similar/:propertyId`
- `POST /api/leads` (payload includes `customer`, `property`, etc.)
- `PATCH /api/leads/:id/stage` `{ stage, notes }`
- `POST /api/visits` `{ lead, property, dateTime, ... }`
- `GET /api/visits/:id/ics` -> calendar file
- `POST /api/deals` `{ leadId, value, commission, dateISO?, notes, status: 'won'|'lost' }`

## Notes

- TypeORM `synchronize=true` in development creates tables automatically.
- The DB image is `postgis/postgis` but we store `lat`/`lon` columns (no PostGIS requirement).
- CORS allows `CLIENT_ORIGIN` (default `http://localhost:3000`).

## Future Enhancements

- Add RBAC middleware to mutation routes.
- Add Meilisearch integration for instant search.
- Add BullMQ + Redis workers for alerts/notifications.
