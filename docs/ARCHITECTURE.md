# Architecture Overview

## Why a monorepo with three workspaces

`client`, `server`, and `shared` are separate npm workspaces instead of one
undivided app for one reason: **the type contract between frontend and
backend should be impossible to drift apart**. `shared/types` is imported
by both sides — a `Transaction` field renamed on the server fails the
client's typecheck immediately, instead of surfacing as a runtime bug
weeks later.

```
stark-money-wallet/
├── client/     React 19 + Vite PWA — all UI, routing, and API calls
├── server/     Fastify + Prisma API — all business logic and persistence
├── shared/     Isomorphic TypeScript types — the contract between them
├── docs/       This documentation
└── scripts/    Setup / dev automation
```

## Layered backend

Each server feature follows the same four-layer shape:

```
routes/       → HTTP method + path + which middleware guards it
controllers/  → parses the request, calls a service, shapes the response
services/     → business logic, talks to Prisma directly
validators/   → Zod schemas, the single source of truth for input shape
```

A controller never touches Prisma directly, and a service never touches
`FastifyRequest`/`FastifyReply`. This means the service layer is testable
in isolation and reusable if a second transport (e.g. a CLI import tool)
is added later.

## Frontend composition

```
pages/        → route-level screens, one per URL
layouts/       → ProtectedLayout (auth-gated shell) / AuthLayout (centered card)
components/ui/ → design-system primitives (Button, Card, Dialog, ...)
components/layout/ → navigation chrome (Sidebar, BottomNavigation, TopNavigation)
contexts/      → AuthContext, ThemeContext — cross-cutting state
services/      → one file per API resource, all HTTP calls funnel through apiClient.ts
hooks/         → thin wrappers around contexts (useAuth, useTheme)
```

Business logic never lives inside a page component beyond form
orchestration — pages call a `services/*` function and hand the result to
`ui/*` components.

## Auth model

The app is single-profile and password-only:

1. `GET /api/v1/auth/status` tells the client whether a `User` row exists
   yet.
2. If not, `POST /api/v1/auth/create-password` creates the one `User`,
   hashes the password with bcrypt, and returns a JWT.
3. Every protected route requires `Authorization: Bearer <jwt>`, verified
   by `@fastify/jwt` in `middleware/auth.middleware.ts`.
4. `ProtectedLayout` on the client re-checks `user.hasCompletedOnboarding`
   on every render and redirects to `/onboarding` until an opening
   balance has been set.

## What's real vs. scaffolded in Phase 1

| Feature | Status |
|---|---|
| Auth (create password / login / me) | Fully implemented |
| Opening balance | Fully implemented |
| Transactions (list/create) | Routes + validators exist, return `501` — Phase 2 |
| Recurring expenses | Routes exist, return `501` — later phase |
| Monthly summary | Routes exist, return `501` — later phase |
| Settings (read) | Fully implemented; write endpoints arrive with the Settings feature |

This split is intentional: the prompt for Phase 1 explicitly asks for
architecture, not full business logic.
