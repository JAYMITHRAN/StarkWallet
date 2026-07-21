# Development Guide

## Prerequisites

- Node.js 20+
- npm 10+

## First-time setup

```bash
./scripts/setup.sh
```

This installs all workspace dependencies, creates `server/.env` and
`client/.env` from their examples, generates the Prisma client, and runs
the first migration.

**Manual equivalent**, if you'd rather run each step yourself:

```bash
npm install
cp server/.env.example server/.env   # then edit JWT_SECRET
cp client/.env.example client/.env
npm run prisma:generate --workspace=server
npm run prisma:migrate --workspace=server
```

## Running the app

```bash
npm run dev
```

Starts both the API (`http://localhost:4000`) and the client
(`http://localhost:5173`) concurrently. The client's Vite dev server
proxies `/api/*` to the API, so there's no CORS friction in development.

Run them individually with `npm run dev:server` / `npm run dev:client`.

## Working with the database

```bash
npm run prisma:studio --workspace=server   # visual DB browser
npm run prisma:migrate --workspace=server  # create + apply a new migration
```

After editing `server/prisma/schema.prisma`, always run
`prisma:migrate` (not just `prisma:generate`) so the SQLite file and the
generated client stay in sync.

## Adding a new API resource (the established pattern)

1. Add the model to `server/prisma/schema.prisma`, migrate.
2. Add its shape to `shared/types/index.ts` (entity + request/response
   types).
3. `server/src/validators/<resource>.validator.ts` — Zod schema(s).
4. `server/src/services/<resource>.service.ts` — Prisma calls, business
   rules, throws `HttpError` on failure.
5. `server/src/controllers/<resource>.controller.ts` — parses
   `request.body`/`params`/`query` with the validator, calls the service,
   maps the Prisma result to the shared type, replies with the
   `ApiSuccess<T>` envelope.
6. `server/src/routes/<resource>.routes.ts` — wires HTTP verbs to
   controller methods, applies `requireAuth` where needed.
7. Register the router in `server/src/app.ts`.
8. `client/src/services/<resource>Service.ts` — thin wrapper calling
   `apiRequest<T>()`.
9. Consume it from a page via TanStack Query (`useQuery`/`useMutation`).

## Code style

- TypeScript strict mode is on in both workspaces — no `any` without a
  named exception.
- Controllers never import `@prisma/client` directly; services never
  import `fastify`.
- Every button color must be blue (`primary`), black (`black`), or white
  (`white`) per the Stark Glass design system — see
  `client/src/components/ui/Button.tsx`.
- Icons come from `lucide-react` only, used for representation, never
  decoration.

## Linting & type checking

```bash
npm run typecheck
```

(ESLint/Prettier config is intentionally left for Phase 2 so the initial
architecture PR stays focused — see the roadmap.)
