## Codebase Overview

React 18 + Vite + TypeScript + TailwindCSS SPA for "Lib", a personal game-library tracker backed by IGDB. Talks to a separate Fastify+Prisma+Postgres backend (`lib` repo) via `/api`. All server state through TanStack Query v5; auth through React Context.

**Stack**: React Router v6, TanStack Query v5, react-hook-form + zod, Radix UI primitives, embla-carousel, Tailwind (custom dark-theme tokens), tailwind-merge.

**Structure**: `src/pages/` (one file per route, registered in `src/main.tsx`), `src/components/` (flat, plus `gamesComponents/` and `userGamesComponents/` families), `src/hooks/` (TanStack Query hooks + `useApi.ts` axios client), `src/contexts/auth/`, `src/types/` + `src/interfaces/` + `src/schemas/`.

For detailed architecture, module guide, data-flow diagrams, and known gotchas, see [docs/CODEBASE_MAP.md](docs/CODEBASE_MAP.md).
