# Bharosa Frontend (Next.js + Tailwind + React Query)

A minimal, production-ready starter for Bharosa Real Estate.

## Quick Start

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Open http://localhost:3000

- With `NEXT_PUBLIC_USE_MOCK=true`, the app uses local mock data.
- Set `NEXT_PUBLIC_USE_MOCK=false` to call your backend at `NEXT_PUBLIC_API_BASE`.

## Tech
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- @tanstack/react-query
- Axios

## Structure
- `src/app` — App Router pages
- `src/components` — UI components
- `src/lib` — API client, types, mock data