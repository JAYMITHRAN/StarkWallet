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
   Add the following environment variable under the **Environment Variables** section:
   - **`VITE_API_URL`**: `https://your-backend-app.onrender.com` (Your Render backend URL)
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
   - **Build Command**: `npm install && npx prisma generate && npm run build`
   - **Start Command**: `npm run start`
6. **Configure Environment Variables**:
   Add the following variables under the **Advanced** → **Environment Variables** section:
   - **`NODE_ENV`**: `production`
   - **`PORT`**: `4000`
   - **`HOST`**: `0.0.0.0`
   - **`DATABASE_URL`**: `file:./dev.db` (For SQLite) or your PostgreSQL URL connection string.
   - **`JWT_SECRET`**: `a-long-secure-random-secret-string`
   - **`JWT_EXPIRES_IN`**: `7d`
   - **`BCRYPT_SALT_ROUNDS`**: `12`
   - **`CORS_ORIGIN`**: `https://your-frontend-app.vercel.app` (Your Vercel deployment URL)
7. **Deploy**: Click **Create Web Service**.

> [!NOTE]
> Render will automatically detect the `/health` endpoint and use it to monitor deployment success.

---

## ⏱️ 3. Keep-Alive (High Availability)

The backend includes a self-pinging keep-alive mechanism to prevent Render's **Free Tier** from entering sleep mode (which ordinarily happens after 15 minutes of inactivity).

- Render automatically injects the `RENDER_EXTERNAL_URL` environment variable during deployment.
- When `NODE_ENV=production` is detected, the API will self-ping its own `/health` endpoint every **14 minutes**, keeping the container active and highly responsive all the time.
