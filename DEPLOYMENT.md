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
   Add the variable `VITE_API_URL` pointing to your Render backend API URL (e.g. `https://stark-wallet-api.onrender.com`).
5. **Deploy**: Click **Deploy**. Vercel will automatically configure routing for single-page application (SPA) paths via the pre-configured `vercel.json`.

---

## ⚡ 2. Backend Deployment (Render)

The backend is built with Fastify, Prisma, PostgreSQL, and tsx/TypeScript.

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
   - **Build Command**: `npm install --production=false && npx prisma generate && npx prisma migrate deploy && npm run build`
   - **Start Command**: `npm run start`
6. **Configure Environment Variables**:
   Input the following exact Key/Value pairs in Render's **Environment** tab:

   | Key | Example / Value | Description |
   | :--- | :--- | :--- |
   | `NODE_ENV` | `production` | Sets the application environment to production. |
   | `PORT` | `4000` | The internal port the server listens on. |
   | `HOST` | `0.0.0.0` | Allows the container to accept external traffic. |
   | `DATABASE_URL` | `postgresql://...` | Your online PostgreSQL connection string (e.g. from Neon.tech). |
   | `JWT_SECRET` | `replace-with-a-long-random-string` | A secure, random key to sign tokens (min 16 chars). Do not expose this. |
   | `JWT_EXPIRES_IN` | `1d` | Token lifetime (tokens expire at end of UTC day). |
   | `BCRYPT_SALT_ROUNDS` | `12` | Controls password hashing security strength. |
   | `CORS_ORIGIN` | `*` | Permits requests from Vercel. (Replace `*` with your actual Vercel URL once deployed, e.g. `https://stark-wallet.vercel.app`). |

7. **Deploy**: Click **Create Web Service**.

> [!NOTE]
> Render will automatically detect the `/health` endpoint and use it to monitor deployment success.

---

## ⏱️ 3. Keep-Alive (High Availability)

The backend includes a self-pinging keep-alive mechanism to prevent Render's **Free Tier** from entering sleep mode (which ordinarily happens after 15 minutes of inactivity).

- Render automatically injects the `RENDER_EXTERNAL_URL` environment variable during deployment.
- When `NODE_ENV=production` is detected, the API will self-ping its own `/health` endpoint every **14 minutes**, keeping the container active and highly responsive all the time.

---

## 🗄️ 4. Persistent PostgreSQL Setup & Data Migration

Because Render's filesystem is ephemeral, using local SQLite means your transaction data would be reset when Render restarts your container. Switching to a free online PostgreSQL database (like **Neon.tech**) guarantees permanent persistence.

### 🌟 Step 1: Create a Free PostgreSQL Database
1. Go to [Neon.tech](https://neon.tech) and sign up for a free account.
2. Create a new project (e.g., `stark-wallet-db`).
3. Under **Connection Details**, copy your **Connection String** (select the `node-postgres` or `Prisma` option). It will look like:
   `postgresql://owner:password@ep-cool-snowflake-123456.us-east-2.aws.neon.tech/neondb?sslmode=require`

### 📤 Step 2: Push your Schema and Migrate Existing Data
We have provided an automated migration script to copy all your existing local SQLite data directly to your new PostgreSQL database.

1. Open your terminal in the root directory.
2. Initialize the tables in your PostgreSQL database:
   ```bash
   npx prisma db push --schema=backend/prisma/schema.prisma
   ```
3. Run the migration script to upload all your local SQLite data (users, settings, transactions) to the cloud PostgreSQL database:
   ```bash
   node scripts/migrate-sqlite-to-pg.js "<your-postgres-connection-string>"
   ```
   *(Replace `<your-postgres-connection-string>` with the string you copied in Step 1, wrapping it in double quotes).*

### 🔧 Step 3: Update Render
1. Go to your **Render Dashboard** → Select your **`stark-money-wallet-api`** web service.
2. Click **Environment**.
3. Edit **`DATABASE_URL`** and paste your new PostgreSQL connection string.
4. Save the changes. Render will automatically redeploy the backend with the persistent database!

