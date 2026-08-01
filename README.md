# StarkMoneyWalletTracker

A personal finance PWA built around one promise: **track every transaction in under 5 seconds.**

Mobile-first, installable, dark-mode-only, styled in the "Stark Glass" design language — a JARVIS-inspired fintech aesthetic in blue, black, and white.

---

## 🚀 Quick Start

```bash
# Run both servers locally:
npm run dev:backend   # API on http://localhost:4000
npm run dev:frontend  # Web App on http://localhost:5173
```

- **Client App**: `http://localhost:5173`
- **Backend API**: `http://localhost:4000`
- **Main Wallet Password**: `tonystark`
- **Notebook Password**: `sruthi`

See [`RUNNING.md`](RUNNING.md) for full local environment setup instructions.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, TypeScript, Tailwind CSS, TanStack Query, React Router, Zod, Lucide Icons, Recharts, PWA.
- **Backend**: Node.js, Fastify, Prisma, SQLite (dev) / PostgreSQL (prod), JWT auth, bcrypt, Zod.
- **Shared**: Shared `@stark/shared` contract definitions keeping client & server strictly in sync.

---

## 📓 Noteouts Ledger (Off-Book Notebook)

The **Noteouts** feature is a standalone, private notebook designed to record money movements (loans, informal IOUs, off-book expenses, cash advances) **without impacting your main wallet balance or monthly financial summaries**.

### 🌟 Key Highlights & Security
- **Protected Access**: Requires entering the notebook verification password (`sruthi`) every time Noteouts is opened.
- **Settings Access**: Accessible directly via the **Settings Page** (`Settings` → `Noteouts Ledger`) on both Desktop Web and Mobile PWA views.
- **Off-Balance Isolation**: Noteouts entries do **NOT** modify your main available balance, `totalCashIn`, or `totalCashOut`.
- **Directional Tracking**: Supports **Noted In** (money coming in off-book) and **Noted Out** (money given out off-book).
- **Rich Timeline Controls**:
  - Full-text search by reason or note details
  - Filter by entry type (*Noted In*, *Noted Out*, or *All*)
  - Sort by *Newest*, *Oldest*, *Highest Amount*, or *Lowest Amount*
  - Instant inline quick-add form
  - One-click editing via dialog modal
  - Soft-delete with an instant **Undo** restore action
  - Manual "Lock Notebook" button in header

### 🔌 Noteouts API Endpoints
All noteout endpoints are guarded by JWT authentication under `/api/v1/noteouts`:
- `GET /api/v1/noteouts` — List noteout entries (supports `search`, `type`, `sort`)
- `GET /api/v1/noteouts/summary` — Returns summary totals (`totalNotedIn`, `totalNotedOut`, `count`)
- `POST /api/v1/noteouts` — Create a noteout entry
- `PUT /api/v1/noteouts/:id` — Update an entry
- `DELETE /api/v1/noteouts/:id` — Soft-delete an entry
- `POST /api/v1/noteouts/:id/restore` — Restore a soft-deleted entry

---

## 🎨 Design System — Stark Glass

| Token | Hex | Description |
|---|---|---|
| Background | `#0B1220` | Deep cosmic dark background |
| Surface | `#111827` | Glass panel surface |
| Card | `#1E293B` | Interactive card background |
| Primary | `#2563EB` | Stark Blue accent |
| Accent | `#38BDF8` | Vibrant sky highlight |
| Success | `#22C55E` | Cash In / Noted In green |
| Danger | `#EF4444` | Cash Out / Noted Out red |
| Muted | `#94A3B8` | Subtle text & borders |

---

## 📂 Project Structure

```
stark-money-wallet/
├── frontend/   React 19 PWA & UI Components
├── backend/    Fastify API & Prisma Database Service
├── shared/     Shared TypeScript type contracts
└── scripts/    Database migration & setup scripts
```

---

## 📄 License

Private project — no license granted for reuse.
