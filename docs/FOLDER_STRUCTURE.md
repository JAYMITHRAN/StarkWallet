# Folder Structure

```
stark-money-wallet/
│
├── client/                          React 19 + Vite + TypeScript PWA
│   ├── public/
│   │   └── icons/                   PWA icons (192, 512)
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/                  Button, Input, Card, Dialog, Toast, ...
│   │   │   ├── layout/              Sidebar, BottomNavigation, TopNavigation
│   │   │   └── charts/              ChartWrapper (Recharts frame)
│   │   ├── contexts/                AuthContext, ThemeContext
│   │   ├── hooks/                   useAuth, useTheme
│   │   ├── layouts/                 ProtectedLayout, AuthLayout
│   │   ├── lib/                     cn(), formatters, queryClient
│   │   ├── pages/
│   │   │   ├── auth/                CreatePasswordPage, LoginPage
│   │   │   ├── onboarding/          OpeningBalancePage
│   │   │   ├── dashboard/           DashboardPage
│   │   │   ├── transactions/        CashInPage, CashOutPage
│   │   │   ├── history/             HistoryPage
│   │   │   ├── summary/             MonthlySummaryPage
│   │   │   ├── settings/            SettingsPage
│   │   │   ├── LoadingScreen.tsx    JARVIS-style boot splash
│   │   │   └── RootRedirect.tsx     First-run routing logic
│   │   ├── routes/                  router.tsx (route tree)
│   │   ├── services/                apiClient.ts + one file per API resource
│   │   ├── styles/                  globals.css (Tailwind layers)
│   │   ├── types/                   Re-exports @stark/shared/types
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── tailwind.config.ts           Stark Glass design tokens
│   ├── vite.config.ts               Includes vite-plugin-pwa manifest
│   └── package.json
│
├── server/                          Node.js + Fastify + Prisma API
│   ├── prisma/
│   │   └── schema.prisma            User, Transaction, RecurringExpense, MonthlySummary, Settings
│   ├── src/
│   │   ├── config/                  env.ts (validated env vars)
│   │   ├── controllers/             Request → service → response
│   │   ├── middleware/              auth.middleware.ts, error.middleware.ts
│   │   ├── routes/                  One file per resource
│   │   ├── services/                Business logic, Prisma calls
│   │   ├── validators/              Zod schemas
│   │   ├── lib/                     prisma.ts (client singleton)
│   │   ├── utils/                   password.ts, httpError.ts
│   │   ├── app.ts                   Fastify app factory
│   │   └── index.ts                 Entrypoint
│   └── package.json
│
├── shared/                          Isomorphic TypeScript contracts
│   └── types/index.ts               Entities, enums, API request/response shapes
│
├── docs/                            This documentation set
├── scripts/
│   └── setup.sh                     One-command install + env + migrate
├── package.json                     npm workspaces root
└── .env.example
```

## Naming conventions

- **Files**: `PascalCase.tsx` for React components, `camelCase.ts` for
  everything else (services, utils, hooks).
- **Routes**: kebab-case URLs (`/opening-balance`, `/cash-in`).
- **Prisma models**: `PascalCase` model names, `snake_case` table names
  via `@@map`, so SQL stays conventional even though Prisma Client stays
  idiomatic TypeScript.
- **Zod schemas**: `<resource>Schema`, exported alongside an inferred
  `<Resource>Input` type.
