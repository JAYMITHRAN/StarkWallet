# 💻 Running Stark Money Wallet (Local Development Guide)

This guide provides step-by-step instructions for setting up and running both the **Backend API** and **Frontend UI** on your local machine.

---

## 📋 1. Prerequisites

Make sure you have installed:
- **Node.js**: `v20.x` or higher
- **npm**: `v10.x` or higher

---

## 🗄️ 2. Database & Environment Setup

The application uses **SQLite** for local development stored at `backend/prisma/dev.db`.

1. **Navigate to the root directory**:
   ```bash
   cd stark-money-wallet
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Sync Database Schema & Generate Prisma Client**:
   ```bash
   npm run prisma:generate
   ```

---

## 🚀 3. Running Frontend & Backend

You can run both servers simultaneously from two separate terminal windows.

### Terminal 1: Backend API (Port 4000)
```bash
npm run dev:backend
```
- **API URL**: `http://localhost:4000`
- **Health Check**: `http://localhost:4000/health`

### Terminal 2: Frontend Web App (Port 5173)
```bash
npm run dev:frontend
```
- **App URL**: `http://localhost:5173`

---

## 🔑 4. Authentication & Credentials

- **Main Wallet Login Password**: `tonystark`
- **Noteouts Notebook Password**: `sruthi` *(required every time Noteouts is opened from Settings)*

---

## 📓 5. Key Features & Access

- 🏠 **Dashboard**: Balance summary, expenditure graph, quick actions (`http://localhost:5173/`)
- 💵 **Cash In / Cash Out**: Add main transactions
- 📊 **Summary**: Monthly breakdown and category analytics
- ⚙️ **Settings**: App preferences & access to **Noteouts Ledger**
- 📓 **Noteouts Ledger**: Protected notebook for off-balance money tracking (Access: `Settings` → `Noteouts Ledger`, Password: `sruthi`)

---

## 🛠️ 6. Troubleshooting

| Issue | Solution |
| :--- | :--- |
| **"Request validation failed" on Login** | Passwords must be at least 8 characters long. Main login password is `tonystark`. |
| **Prisma Error / 500 Server Error** | Ensure `backend/prisma/schema.prisma` has `provider = "sqlite"` for local dev. Run `npx prisma generate` in `backend/`. |
| **Notebook Password Failed** | Use `sruthi` to unlock the Noteouts notebook. |
