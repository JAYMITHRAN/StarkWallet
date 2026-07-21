# Environment Variables

## `server/.env` (copy from `server/.env.example`)

| Variable | Default | Description |
|---|---|---|
| `PORT` | `4000` | Port the Fastify API listens on. |
| `HOST` | `0.0.0.0` | Bind address. |
| `NODE_ENV` | `development` | `development` \| `test` \| `production`. Controls logging verbosity and Prisma log level. |
| `CORS_ORIGIN` | `http://localhost:5173` | Allowed origin for the client. Set to your deployed client URL in production. |
| `DATABASE_URL` | `file:./dev.db` | SQLite connection string consumed by Prisma. |
| `JWT_SECRET` | — **required** | Signing secret for auth tokens. Must be at least 16 characters. Generate one with `openssl rand -base64 32`. |
| `JWT_EXPIRES_IN` | `7d` | Token lifetime, in [`ms`](https://github.com/vercel/ms) format. |
| `BCRYPT_SALT_ROUNDS` | `12` | Cost factor for password hashing. Higher = slower to brute-force, slower to hash. |

All server env vars are validated at boot via `src/config/env.ts` — an
invalid or missing required variable stops the server with a readable
error instead of failing later at request time.

## `client/.env` (copy from `client/.env.example`)

The client talks to the API through Vite's dev proxy (configured in
`vite.config.ts`), so **no environment variable is required in
development**. If you deploy the client and server on separate origins in
production, add:

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the deployed API, if not proxied. |

## Never commit real secrets

`.env` is gitignored at the repo root; only `.env.example` files are
tracked. Rotate `JWT_SECRET` before any production deployment — the
placeholder in `.env.example` is not safe to ship with.
