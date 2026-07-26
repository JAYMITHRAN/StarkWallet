import { PrismaClient } from "@prisma/client";
import { env } from "../config/env.js";

/**
 * A single PrismaClient instance is reused across the app. In dev, tsx's
 * watch-mode reloads can otherwise spawn multiple clients and exhaust
 * SQLite's connection handling, so we stash the instance on `globalThis`.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
