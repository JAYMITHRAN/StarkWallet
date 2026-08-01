# 🔑 StarkMoneyWalletTracker — Online Credentials & Deployment Links

This document contains all project authentication passwords, live deployment URLs, environment configuration variables, and database connection details.

---

## 🔑 1. Application Passwords

| Access Area | Password | Location / Description |
| :--- | :--- | :--- |
| **Main Wallet App Login** | `tonystark` | Web app login screen (`/login`) |
| **Noteouts Notebook** | `sruthi` | Off-book notebook verification (`Settings` → `Noteouts Ledger`) |

---

## 🌐 2. Deployment URLs & Platforms

| Platform / Service | URL / Link | Description |
| :--- | :--- | :--- |
| **GitHub Repository** | [github.com/JAYMITHRAN/StarkWallet](https://github.com/JAYMITHRAN/StarkWallet.git) | Source code repository |
| **Vercel Dashboard** | [vercel.com Project Dashboard](https://vercel.com/tonystarks-projects-74f03191/stark-wallet/FB9ZPojW4Rvs2BUoKxgzB3ENXoc5) | Frontend hosting & deployment control |
| **Render Backend Service** | [`https://starkwallet-0.onrender.com`](https://starkwallet-0.onrender.com) | Live Node.js Fastify backend API |
| **Render API Health Check** | [`https://starkwallet-0.onrender.com/health`](https://starkwallet-0.onrender.com/health) | Backend health status endpoint |

---

## 🗄️ 3. Render PostgreSQL Database Credentials

| Parameter | Value |
| :--- | :--- |
| **Database Name** | `starkwallet` |
| **Database Hostname** | `dpg-d9j64k9ba33s7384coo0-a.oregon-postgres.render.com` |
| **Database Port** | `5432` |
| **Username** | `starkwallet_user` |
| **Password** | `yFpXmKjwfz3Y5npE77vtFLW8IRbCNb1H` |
| **External Connection URI** | `postgresql://starkwallet_user:yFpXmKjwfz3Y5npE77vtFLW8IRbCNb1H@dpg-d9j64k9ba33s7384coo0-a.oregon-postgres.render.com/starkwallet?sslmode=require` |
| **Internal Connection URI** | `postgresql://starkwallet_user:yFpXmKjwfz3Y5npE77vtFLW8IRbCNb1H@dpg-d9j64k9ba33s7384coo0-a/starkwallet` |

---

## ⚙️ 4. Production Environment Variables Reference

### Render Backend Service (`starkwallet-0`)
- `NODE_ENV`: `production`
- `PORT`: `4000`
- `HOST`: `0.0.0.0`
- `DATABASE_URL`: `postgresql://starkwallet_user:yFpXmKjwfz3Y5npE77vtFLW8IRbCNb1H@dpg-d9j64k9ba33s7384coo0-a.oregon-postgres.render.com/starkwallet?sslmode=require`
- `JWT_SECRET`: `replace-with-a-long-random-string`
- `JWT_EXPIRES_IN`: `1d`
- `BCRYPT_SALT_ROUNDS`: `12`
- `CORS_ORIGIN`: `*`

### Vercel Frontend Service (`stark-wallet`)
- `VITE_API_URL`: `https://starkwallet-0.onrender.com`

---

> 🔒 **Security Notice**: Keep this file safe and avoid sharing private database keys publicly.
