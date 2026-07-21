# StarkMoneyWalletTracker

A personal finance PWA built around one promise: **track every
transaction in under 5 seconds.**

Mobile-first, installable, dark-mode-only, styled in the "Stark Glass"
design language — a JARVIS-inspired fintech aesthetic in blue, black, and
white.

> **This is Phase 1.** It ships the full project architecture, auth, and
> UI shell. Wallet business logic (transactions, analytics, recurring
> expenses) lands in later phases — see [`docs/ROADMAP.md`](docs/ROADMAP.md).

## Quick start

```bash
./scripts/setup.sh
npm run dev
```

Client: `http://localhost:5173` · API: `http://localhost:4000`

See [`docs/DEVELOPMENT_GUIDE.md`](docs/DEVELOPMENT_GUIDE.md) for the manual
setup steps and day-to-day workflow.

## Tech stack

**Frontend** — React 19, Vite, TypeScript, Tailwind CSS, Radix primitives
(shadcn-style), React Router, TanStack Query, React Hook Form, Zod, Lucide
icons, Recharts, `vite-plugin-pwa`.

**Backend** — Node.js, Fastify, Prisma, SQLite, JWT auth, bcrypt, Zod.

**Shared** — a single `shared/types` package so the client and server can
never silently drift on data shape.

Full reasoning for each choice: [`docs/TECH_STACK.md`](docs/TECH_STACK.md).

## What's in Phase 1

- ✅ Monorepo architecture (`client` / `server` / `shared`, npm workspaces)
- ✅ Password-based auth (create password → login → JWT-protected routes)
- ✅ Opening balance onboarding flow
- ✅ Prisma schema for `User`, `Transaction`, `RecurringExpense`,
  `MonthlySummary`, `Settings`
- ✅ Route/controller/service/validator structure for every planned API
  resource (Transactions, Recurring Expenses, Settings, Summary return
  `501` until their phase lands — the seams are real, the logic isn't)
- ✅ Full reusable UI kit (Button, Input, Card, Dialog, ConfirmDialog,
  Toast, Sidebar, Bottom/Top navigation, EmptyState, ChartWrapper, ...)
- ✅ Stark Glass theme (dark-only), Tailwind token system
- ✅ JARVIS-style boot splash
- ✅ PWA manifest + service worker via `vite-plugin-pwa`
- ✅ All 9 pages routed with correct auth/onboarding gating

More detail: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) ·
[`docs/FOLDER_STRUCTURE.md`](docs/FOLDER_STRUCTURE.md).

## Design system — Stark Glass

| Token | Hex |
|---|---|
| Background | `#0B1220` |
| Surface | `#111827` |
| Card | `#1E293B` |
| Primary | `#2563EB` |
| Accent | `#38BDF8` |
| Success | `#22C55E` |
| Warning | `#F59E0B` |
| Danger | `#EF4444` |
| Text | `#F8FAFC` |
| Muted text | `#94A3B8` |

Buttons are restricted to blue, black, and white. Multi-color is reserved
exclusively for charts. No illustrations, stock imagery, or decorative
icons — Lucide icons only, used for representation.

## Project structure

```
stark-money-wallet/
├── client/    React PWA
├── server/    Fastify API
├── shared/    Shared TypeScript types
├── docs/      Architecture, env vars, dev guide, roadmap
└── scripts/   setup.sh
```

## License

Private project — no license granted for reuse.
