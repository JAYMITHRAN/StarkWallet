# Tech Stack — and Why

## Frontend

| Choice | Reasoning |
|---|---|
| **React 19 + Vite** | Fast HMR, minimal config, first-class PWA plugin support via `vite-plugin-pwa`. |
| **TypeScript (strict)** | Catches contract drift against `shared/types` at compile time, not in production. |
| **Tailwind CSS** | The design brief specifies exact hex tokens (background, surface, card, etc.) — Tailwind's `theme.extend` maps 1:1 to a token system without hand-rolled CSS variables. |
| **shadcn/ui patterns + Radix primitives** | Radix (`@radix-ui/react-dialog`, `react-toast`) gives accessible, unstyled behavior (focus trap, ESC to close, ARIA) that we skin with Stark Glass classes — faster and more accessible than building dialogs from scratch. |
| **React Router** | Declarative route tree with nested layouts (`ProtectedLayout`, `AuthLayout`) matches the app's auth-gated structure directly. |
| **TanStack Query** | Once Phase 2 wires up live transaction data, Query owns caching/refetching/optimistic updates — installed now so the pattern is consistent from day one. |
| **React Hook Form + Zod** | Form state stays uncontrolled (performant on mobile), and the same Zod schema shape mirrors the server's validators, so the two can be kept in sync deliberately. |
| **Lucide React** | The brief bans decorative graphics and illustrations; Lucide is a single consistent icon set for representation only (Home, Wallet, Settings, ...). |
| **Recharts** | The one place the brief allows multi-color — Recharts' composability fits a `ChartWrapper` frame + swappable chart type per analytics view. |
| **vite-plugin-pwa** | Generates the manifest and service worker from config instead of hand-maintained boilerplate; supports `autoUpdate` so users always get the latest build. |

## Backend

| Choice | Reasoning |
|---|---|
| **Node.js LTS** | Stability guarantee matching the "production-ready" requirement. |
| **Fastify** | Schema-based, low-overhead HTTP framework; its plugin model (`@fastify/jwt`, `@fastify/cors`) matches the layered controller/service architecture cleanly. |
| **Prisma ORM + SQLite** | SQLite is file-based — zero infra for a personal single-user wallet — and Prisma's generated types re-enforce the same “model = contract” discipline as `shared/types`. Migrating to Postgres later is a one-line `datasource` change plus a migration. |
| **JWT (`@fastify/jwt`)** | Stateless auth suits a local-first single-user app; no session store needed. |
| **bcrypt** | Industry-standard adaptive password hashing; salt rounds are configurable via `BCRYPT_SALT_ROUNDS`. |
| **Zod (shared with client)** | One validation library, two runtimes — request validators and form validators can be written the same way. |
| **dotenv + validated env** | `config/env.ts` parses `process.env` through a Zod schema at boot, so a missing `JWT_SECRET` fails immediately with a readable message instead of a cryptic 500 later. |

## Shared

`shared/types` has no dependencies and no build step of its own — it's
consumed as raw TypeScript by both `client` (via Vite's TS support) and
`server` (via `ts-node`/`tsx`). This keeps the "shared interfaces"
requirement genuinely shared, not duplicated.
