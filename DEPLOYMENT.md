# 🚀 StarkMoneyWalletTracker — Deployment Guide

This guide details how to deploy the frontend folder (`frontend/`) to **Vercel** and the backend folder (`backend/`) to **Render**. Both folders are fully self-contained and ready for independent production deployments.

---

## 🎨 1. Frontend Deployment (Vercel)

The frontend is built with React, Vite, and TypeScript. It compiles down to static HTML/JS/CSS assets.

### 📝 Step-by-Step Vercel Setup

1. **Log in to Vercel**: Go to [vercel.com](https://vercel.com) and log in.
2. **Import Project**: Click **Add New** → **Project**, and select your Git repository.
3. **Configure Project Settings**:
   - **Framework Preset**: Select `Vite` (Vercel usually autodetects this).
   - **Root Directory**: Click *Edit* and select **`frontend`**.
   - **Build & Development Settings**: Keep defaults (Build Command: `npm run build`, Output Directory: `dist`).
4. **Configure Environment Variables**:
   Add the variables listed in **`frontend/.env.production`** (specifically `VITE_API_URL` pointing to your Render backend API URL).
5. **Deploy**: Click **Deploy**. Vercel will automatically configure routing for single-page application (SPA) paths via the pre-configured `vercel.json`.

---

## ⚡ 2. Backend Deployment (Render)

The backend is built with Fastify, Prisma, SQLite/PostgreSQL, and tsx/TypeScript.

### 📝 Step-by-Step Render Setup

1. **Log in to Render**: Go to [dashboard.render.com](https://dashboard.render.com).
2. **Create Web Service**: Click **New +** → **Web Service**.
3. **Connect Repository**: Select your Git repository.
4. **Configure Service Details**:
   - **Name**: `stark-money-wallet-api`
   - **Region**: Select your preferred region (e.g., `Oregon (US West)`).
   - **Branch**: `main` (or your active branch).
   - **Root Directory**: Enter **`backend`**.
   - **Runtime**: Select **`Node`**.
5. **Build & Start Commands**:
   - **Build Command**: `npm install --production=false && npx prisma generate && npm run build`
   - **Start Command**: `npm run start`
6. **Configure Environment Variables**:
   You can copy the variables directly from **`backend/.env.production`** (you can use Render's **Add Environment Variable** → **Secret File / Bulk Editor** to copy-paste the whole block at once) or input the following exact Key/Value pairs:

   | Key | Exact Value to Enter | Description / Action |
   | :--- | :--- | :--- |
   | `NODE_ENV` | `production` | Sets the application environment to production. |
   | `PORT` | `4000` | The internal port the server listens on. |
   | `HOST` | `0.0.0.0` | Allows the container to accept external traffic. |
   | `DATABASE_URL` | `file:./dev.db` | The path to the SQLite file. If you use PostgreSQL later, replace this with your connection string. |
   | `JWT_SECRET` | `stark_secure_jwt_wallet_key_2026` | A secure key to sign authentication tokens. You can keep this exact key or change it to any secret string. |
   | `JWT_EXPIRES_IN` | `7d` | Tokens expire and user must re-authenticate after 7 days. |
   | `BCRYPT_SALT_ROUNDS` | `12` | Controls password hashing security strength. |
   | `CORS_ORIGIN` | `*` | Permits requests from Vercel. (For max security, replace `*` with your actual Vercel URL once deployed, e.g. `https://stark-wallet.vercel.app`). |

7. **Deploy**: Click **Create Web Service**.

> [!NOTE]
> Render will automatically detect the `/health` endpoint and use it to monitor deployment success.

---

## ⏱️ 3. Keep-Alive (High Availability)

The backend includes a self-pinging keep-alive mechanism to prevent Render's **Free Tier** from entering sleep mode (which ordinarily happens after 15 minutes of inactivity).

- Render automatically injects the `RENDER_EXTERNAL_URL` environment variable during deployment.
- When `NODE_ENV=production` is detected, the API will self-ping its own `/health` endpoint every **14 minutes**, keeping the container active and highly responsive all the time.
