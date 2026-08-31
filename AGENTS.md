# Lumora — Agent Guidelines

## Architecture Overview

- **Framework**: TanStack Start (fullstack SSR with React 19 and Vite)
- **Backend & Database**: CrescoDB (`schema.cresco` + `config.json` with SQLite / PostgreSQL / MySQL)
- **Database Client**: `src/lib/cresco.ts` (REST API, JWT Auth, SSE Realtime)
- **Routing**: File-based routing via `@tanstack/react-router` located in `src/routes/`
- **State & Data Fetching**: `@tanstack/react-query`
- **Styling**: Tailwind CSS v4 with custom UI components in `src/components/ui/`
- **Icons**: `lucide-react`

## Development Rules

- Use `src/routes/` for file-based route definitions.
- Preserve the root layout `<Outlet />` in `src/routes/__root.tsx`.
- Place reusable business logic in `src/lib/` and reusable UI components in `src/components/`.
- Manage database schema in `schema.cresco` and client calls through `src/lib/cresco.ts`.
