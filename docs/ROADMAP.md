# Future Roadmap

Phase 1 (this delivery) is the foundation only. Planned phases:

## Phase 2 — Transactions
- Implement `transactionService` (create, list with pagination/filters,
  soft-delete, update).
- Wire `CashInPage` / `CashOutPage` forms to `POST /transactions`.
- `HistoryPage`: paginated list, filter by type/category/date range,
  swipe-to-delete on mobile.
- Update `DashboardPage` cards and recent-activity list with real data via
  TanStack Query.

## Phase 3 — Analytics & Monthly Summary
- Implement `summaryService` aggregation (cash in / cash out / closing
  balance per month).
- `MonthlySummaryPage`: real Recharts pie/bar breakdown by category, month
  picker, trend line across months.
- Scheduled or on-demand `MonthlySummary` row generation.

## Phase 4 — Recurring Expenses
- Implement `recurringService` (create/list/toggle/delete).
- A "Recurring" tab or section surfaced from Settings.
- Background job (or on-app-open check) that materializes due recurring
  expenses into real `Transaction` rows.

## Phase 5 — Settings, Export & Polish
- Settings write endpoints (currency, notifications).
- CSV/PDF export of transaction history.
- Full PWA offline support (cached shell + background sync for queued
  transactions).
- ESLint + Prettier + CI pipeline.
- Automated tests (Vitest for client, Fastify's `inject` for server route
  tests).

## Explicitly out of scope for this project
- Multi-user / multi-profile support (the schema's `User` model exists
  for structural cleanliness, not multi-tenancy).
- Light theme (Stark Glass is dark-mode-only by design).
- Bank/UPI integrations — this is a manual ledger, not an aggregator.
