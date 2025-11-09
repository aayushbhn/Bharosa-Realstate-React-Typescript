# Bharosa Backend (Node.js + Express + TypeORM + PostgreSQL)

A pragmatic API for Bharosa Real Estate with users/agents, properties, leads, visits (ICS), deals, and a simple recommender.


## To Install (Windows / PowerShell)


## Prerequisites

Before setting up the project, ensure you have the following software installed on your system:

### Required Software

| Software | Version | Download Link | Purpose |
|----------|---------|---------------|---------|
| **Node.js** | 18.x or higher | [nodejs.org](https://nodejs.org/) | JavaScript runtime for backend and frontend |
| **pnpm** | Latest | `npm install -g pnpm` | Package manager (alternative to npm) |
| **Docker Desktop** | Latest | [docker.com](https://www.docker.com/products/docker-desktop) | Containerization for PostgreSQL, Redis, and Mailhog |
| **Git** | Latest | [git-scm.com](https://git-scm.com/) | Version control |

### Installation Instructions (Windows)
- You can install all the softwares in your own way that you feel easy, not required to follow each steps.

#### 1. Install Node.js
- Download the LTS version from [nodejs.org](https://nodejs.org/)
- Run the installer and follow the setup wizard
- Verify installation:
  
  node --version
  npm --version
  #### 2. Install pnpm
- Open PowerShell and run:
  
  npm install -g pnpm
  - Verify installation:l
  pnpm --version
  
#### 3. Install Docker Desktop
- Download Docker Desktop for Windows from [docker.com](https://www.docker.com/products/docker-desktop)
- Install and restart your computer if prompted
- Start Docker Desktop and ensure it's running
- Verify installation:ershell
  docker --version
  docker compose version

  #### 4. Install Git
- Download Git for Windows from [git-scm.com](https://git-scm.com/)
- Run the installer (default settings are fine)
- Verify installation:ell
  git --version

  ### Optional Software (Recommended)
- Postman

| Software | Purpose |
|----------|---------|
| **VS Code** | Code editor with TypeScript support |
| **PostgreSQL Client** (pgAdmin/DBeaver) | Database management GUI |
| **Postman/Thunder Client** | API testing |

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



# Bharosa Real Estate Platform  
### Full-Stack Real Estate CRM & Marketplace with AI-Powered Recommendations

## Overview

Bharosa is a full-stack real estate system that connects property buyers, sellers, and agents through an intelligent digital platform.

The system consists of:

- Backend: Node.js, Express, TypeORM, PostgreSQL  
- Frontend: Next.js, React, TypeScript, Tailwind CSS  
- AI Recommendation Engine: Hybrid system combining collaborative filtering, content-based retrieval, and learning-to-rank algorithms  

Bharosa enables property management, lead tracking, visit scheduling, and personalized recommendations based on user behavior and listing similarity.

## System Architecture

### Backend
| Component | Technology |
|------------|-------------|
| Framework | Express.js (TypeScript) |
| ORM | TypeORM |
| Database | PostgreSQL (with optional PostGIS) |
| Auth | JWT-based authentication |
| Real-time | Socket.io |
| File Upload | Multer |
| AI Engine | Custom recommender service |

### Frontend
| Component | Technology |
|------------|-------------|
| Framework | Next.js (App Router) |
| Language | TypeScript |
| State & Data | React Query + Context API |
| Styling | Tailwind CSS |
| Deployment | Vercel-ready structure |

## User Roles and Permissions

| Role | Permissions |
|------|--------------|
| Customer | Browse, save, and view properties; schedule visits; get AI recommendations. |
| Agent | Create, update, and manage listings; track leads and visits. |
| Agency Admin / Super Admin | Approve listings, manage users, and moderate platform data. |

## Backend Structure

```
src/
├── app.ts                 # Express app setup
├── index.ts               # Server entry point + Socket.io
├── db/
│   └── data-source.ts     # PostgreSQL + TypeORM setup
├── entities/              # Database models
├── routes/
│   ├── modules/           # Individual route modules
│   └── index.ts           # Combines all routes
├── services/
│   ├── whatsapp.ts        # WhatsApp message integration
│   └── recs/              # AI recommendation algorithms
└── utils/
    └── auth.ts            # JWT authentication & role guards
```

## Key Entities

| Entity | Purpose |
|--------|----------|
| User | Base model for all users (role-based). |
| AgentProfile | Agent’s detailed information linked to User. |
| Agency | Represents a real estate agency with multiple agents. |
| Property | Property listing with attributes like price, location, and amenities. |
| Lead | Customer interest or inquiry about a property. |
| Visit | Scheduled property visit. |
| Deal | Closed property sale or rent deal. |
| SavedProperty | Properties saved by customers (used in AI recommendations). |

## API Endpoints Summary

| Category | Endpoint | Description |
|-----------|-----------|-------------|
| Auth | POST /api/auth/login | Login and receive JWT token. |
|  | POST /api/auth/register | Register new user. |
| Properties | GET /api/properties | List approved properties with filters and sorting. |
|  | GET /api/properties/mine | Get listings for logged-in agent. |
|  | POST /api/properties | Create a new property listing. |
|  | PATCH /api/properties/:id | Update a property listing. |
|  | POST /api/properties/:id/images | Upload property images. |
| Admin | GET /api/admin/listings/pending | View unapproved listings. |
|  | PATCH /api/admin/listings/:id/approve | Approve pending listing. |
| Leads | POST /api/leads | Create customer lead. |
| Visits | POST /api/visits | Schedule property visit. |
| Saved | GET/POST/DELETE /api/saved | Manage saved properties. |
| AI Recs | GET /api/recs/similar/:id | Get similar properties. |
|  | GET /api/recs/home | Personalized recommendations. |
|  | GET /api/recs/popular | Popular listings. |

## AI Recommendation System

### 1. Collaborative Filtering (CF)
- Learns user behavior from saved and viewed properties.
- Generates “users who saved this also saved that” patterns.
- Implemented using SQL co-occurrence analysis.

### 2. Two-Tower Content-Based Retrieval
- Encodes user preferences and property features into vector embeddings.
- Uses cosine similarity between vectors.
- Features: city, type, price range, area, amenities, and bedrooms.

### 3. Learning-to-Rank (LTR)
- Combines outputs from CF and content-based retrieval.
- Uses ranking signals such as recency, photo count, and similarity score.
- Future-ready for training models like LightGBM or XGBoost.

## Recommendation Flow

```
Customer saves/view properties
           ↓
Generate co-occurrence (CF)
           ↓
Build user preference vector
           ↓
Combine CF + Content-Based results
           ↓
Rank results via Learning-to-Rank
           ↓
Return top N recommendations
```

| Algorithm | Endpoint | Auth Required | Description |
|------------|-----------|---------------|-------------|
| Collaborative Filtering | /api/recs/similar/:id | No | Suggests similar properties. |
| Content-Based Retrieval | /api/recs/similar/:id | No | Fallback when CF is sparse. |
| Learning-to-Rank | /api/recs/home | Yes | Personalized property feed. |
| Popularity Baseline | /api/recs/popular | No | Shows most viewed/saved listings. |

## Frontend Features

### Home Page
- Search bar with filtering by location, price, and property type.
- Displays listings dynamically.
- Role-based content rendering (Agent/Admin/Customer).

### Authentication
- Login and registration via JWT.
- Token stored securely in localStorage.
- Auth context managed by AuthProvider.

### Agent Dashboard
- Create, edit, and delete listings.
- Upload images for properties.
- Track leads and schedule visits.

### Admin Dashboard
- View pending properties.
- Approve or reject listings.
- Monitor platform activity.

### Customer Experience
- Browse listings.
- Save favorites.
- Get AI-powered personalized recommendations.

## Authentication and Role Management

Middleware (Backend):
```ts
auth(req,res,next);          // Verifies JWT
roleGuard(['agent','admin']); // Restricts route access
```

Frontend:
- useAuth() React hook stores user info and JWT.
- Global auth state via AuthProvider.

## Example Use Case

Scenario:  
A user saved three apartments in Kathmandu priced between 10–15 million.

Process:
1. Collaborative Filtering identifies co-saved listings by similar users.  
2. Content-based retrieval matches features (city, price, amenities).  
3. Learning-to-Rank refines final ranking using popularity and similarity weights.  

Result:  
Recommended property: “3BHK Apartment in Lazimpat — Rs. 12.5M — Added 3 days ago.”

## File Uploads

- Managed via Multer.
- Files stored in /uploads.
- Served statically:
  ```ts
  app.use("/uploads", express.static(path.resolve(process.cwd(), "uploads")));
  ```

## Example API Usage

### Login (Agent)
```bash
POST /api/auth/login
{
  "email": "agent@example.com",
  "password": "password"
}
```

Response:
```json
{
  "token": "JWT_TOKEN",
  "user": { "role": "agent" }
}
```

### Create Property
```bash
POST /api/properties
Authorization: Bearer JWT_TOKEN
{
  "title": "2BHK Apartment Lazimpat",
  "description": "Bright corner flat near embassies",
  "price": 12000000,
  "status": "sale",
  "type": "apartment",
  "beds": 2,
  "baths": 2
}
```

### AI Recommendations
```bash
GET /api/recs/home
Authorization: Bearer JWT_TOKEN
```

## Future Enhancements

| Feature | Description |
|----------|--------------|
| Precomputed Embeddings | Cache property vectors for faster retrieval. |
| GraphQL Layer | Optional upgrade for complex client queries. |
| Analytics Dashboard | Admin insights on sales and agent activity. |
| Email/SMS Notifications | Integration with Twilio or Mailgun. |
| Advanced ML Models | Train a true LTR model (LightGBM, RankNet, etc). |

## Deployment Notes

| Component | Recommended Platform |
|------------|----------------------|
| Backend API | Render / Railway / AWS ECS |
| Database | PostgreSQL (Neon, Supabase, or AWS RDS) |
| Frontend | Vercel |
| Storage | AWS S3 or Cloudflare R2 |
| AI Service | Separate microservice for heavy models |

## Summary

Bharosa Real Estate is a full-stack platform for real estate management and discovery.  
It provides secure authentication, agent dashboards, admin moderation, lead tracking, and an advanced AI recommendation system combining multiple algorithms for personalized user experiences.
