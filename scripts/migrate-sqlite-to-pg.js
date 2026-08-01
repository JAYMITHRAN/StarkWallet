/**
 * StarkMoneyWalletTracker — SQLite to PostgreSQL Migration Script
 *
 * This script reads all existing data from your local SQLite database (backend/prisma/dev.db)
 * and copies it directly into your live online PostgreSQL database (e.g. Neon, Supabase).
 *
 * Run it locally using:
 *   node scripts/migrate-sqlite-to-pg.js "<your-postgres-connection-string>"
 */

import sqlite3 from "sqlite3";
import pg from "pg";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sqliteDbPath = path.resolve(__dirname, "../backend/prisma/dev.db");

const pgConnectionString = process.argv[2];

if (!pgConnectionString) {
  console.error("❌ Error: Please provide your PostgreSQL connection string as an argument.");
  console.error('Usage: node scripts/migrate-sqlite-to-pg.js "postgres://user:password@host/dbname?sslmode=require"');
  process.exit(1);
}

console.log("🔋 Starting migration from SQLite to PostgreSQL...");
console.log(`📂 SQLite database path: ${sqliteDbPath}`);

// Initialize SQLite
const sqliteDb = new sqlite3.Database(sqliteDbPath, sqlite3.OPEN_READONLY, (err) => {
  if (err) {
    console.error("❌ Failed to connect to SQLite database:", err.message);
    process.exit(1);
  }
  console.log("✅ Connected to SQLite database.");
});

// Initialize Postgres
const pgClient = new pg.Client({
  connectionString: pgConnectionString,
  ssl: pgConnectionString.includes("sslmode=") ? undefined : { rejectUnauthorized: false }
});

async function runMigration() {
  try {
    await pgClient.connect();
    console.log("✅ Connected to PostgreSQL database.");

    // Helper to query sqlite
    const sqliteQuery = (sql) => {
      return new Promise((resolve, reject) => {
        sqliteDb.all(sql, [], (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        });
      });
    };

    // 1. Migrate Users
    console.log("👤 Migrating users...");
    const users = await sqliteQuery("SELECT * FROM users");
    console.log(`Found ${users.length} users in SQLite.`);
    for (const u of users) {
      await pgClient.query(
        `INSERT INTO users (id, "passwordHash", "hasCompletedOnboarding", "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (id) DO UPDATE SET "passwordHash" = $2, "hasCompletedOnboarding" = $3`,
        [u.id, u.passwordHash, u.hasCompletedOnboarding === 1, new Date(u.createdAt), new Date(u.updatedAt)]
      );
    }
    console.log("✅ Users migrated.");

    // 2. Migrate Settings
    console.log("⚙️ Migrating settings...");
    const settings = await sqliteQuery("SELECT * FROM settings");
    console.log(`Found ${settings.length} settings rows.`);
    for (const s of settings) {
      await pgClient.query(
        `INSERT INTO settings (id, "userId", currency, theme, "notificationsEnabled", "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (id) DO UPDATE SET currency = $3, theme = $4, "notificationsEnabled" = $5`,
        [s.id, s.userId, s.currency, s.theme, s.notificationsEnabled === 1, new Date(s.createdAt), new Date(s.updatedAt)]
      );
    }
    console.log("✅ Settings migrated.");

    // 3. Migrate Transactions
    console.log("💸 Migrating transactions...");
    const transactions = await sqliteQuery("SELECT * FROM transactions");
    console.log(`Found ${transactions.length} transactions.`);
    for (const t of transactions) {
      await pgClient.query(
        `INSERT INTO transactions (id, "userId", type, category, amount, reason, note, "occurredAt", "isDeleted", "deletedAt", "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
         ON CONFLICT (id) DO NOTHING`,
        [
          t.id,
          t.userId,
          t.type,
          t.category,
          t.amount,
          t.reason,
          t.note,
          new Date(t.occurredAt),
          t.isDeleted === 1,
          t.deletedAt ? new Date(t.deletedAt) : null,
          new Date(t.createdAt),
          new Date(t.updatedAt)
        ]
      );
    }
    console.log("✅ Transactions migrated.");

    // 4. Migrate Recurring Expenses
    console.log("⏱️ Migrating recurring expenses...");
    const recurring = await sqliteQuery("SELECT * FROM recurring_expenses");
    console.log(`Found ${recurring.length} recurring expenses.`);
    for (const r of recurring) {
      await pgClient.query(
        `INSERT INTO recurring_expenses (id, "userId", label, amount, category, frequency, "nextRunAt", "isActive", "isDeleted", "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         ON CONFLICT (id) DO NOTHING`,
        [
          r.id,
          r.userId,
          r.label,
          r.amount,
          r.category,
          r.frequency,
          new Date(r.nextRunAt),
          r.isActive === 1,
          r.isDeleted === 1,
          new Date(r.createdAt),
          new Date(r.updatedAt)
        ]
      );
    }
    console.log("✅ Recurring expenses migrated.");

    // 5. Migrate Monthly Summaries
    console.log("📊 Migrating monthly summaries...");
    const summaries = await sqliteQuery("SELECT * FROM monthly_summaries");
    console.log(`Found ${summaries.length} monthly summaries.`);
    for (const m of summaries) {
      await pgClient.query(
        `INSERT INTO monthly_summaries (id, "userId", month, year, "totalCashIn", "totalCashOut", "closingBalance", "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         ON CONFLICT (id) DO NOTHING`,
        [
          m.id,
          m.userId,
          m.month,
          m.year,
          m.totalCashIn,
          m.totalCashOut,
          m.closingBalance,
          new Date(m.createdAt),
          new Date(m.updatedAt)
        ]
      );
    }
    console.log("✅ Monthly summaries migrated.");

    // 6. Migrate Noteouts
    console.log("📓 Migrating noteouts...");
    const noteouts = await sqliteQuery("SELECT * FROM noteouts");
    console.log(`Found ${noteouts.length} noteouts.`);
    for (const n of noteouts) {
      await pgClient.query(
        `INSERT INTO noteouts (id, "userId", type, amount, reason, note, "occurredAt", "isDeleted", "deletedAt", "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         ON CONFLICT (id) DO NOTHING`,
        [
          n.id,
          n.userId,
          n.type,
          n.amount,
          n.reason,
          n.note,
          new Date(n.occurredAt),
          n.isDeleted === 1,
          n.deletedAt ? new Date(n.deletedAt) : null,
          new Date(n.createdAt),
          new Date(n.updatedAt)
        ]
      );
    }
    console.log("✅ Noteouts migrated.");

    console.log("\n🎉 SUCCESS! SQLite database migration to PostgreSQL is 100% complete!");

  } catch (err) {
    console.error("❌ Migration failed with error:", err);
  } finally {
    sqliteDb.close();
    await pgClient.end();
  }
}

runMigration();
