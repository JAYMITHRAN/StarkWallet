import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";

import { env } from "./config/env.js";
import { errorHandler } from "./middleware/error.middleware.js";

import { authRoutes } from "./routes/auth.routes.js";
import { openingBalanceRoutes } from "./routes/openingBalance.routes.js";
import { transactionRoutes } from "./routes/transaction.routes.js";
import { recurringRoutes } from "./routes/recurring.routes.js";
import { settingsRoutes } from "./routes/settings.routes.js";
import { summaryRoutes } from "./routes/summary.routes.js";
import { importRoutes } from "./routes/import.routes.js";

export async function buildApp() {
  const app = Fastify({
    logger: {
      level: env.NODE_ENV === "development" ? "info" : "warn",
      transport: undefined,
    },
  });

  let corsOrigin: string | boolean = env.CORS_ORIGIN;
  if (corsOrigin && corsOrigin !== "*") {
    try {
      // In case the user input a URL with a path (e.g. https://domain.com/login)
      const parsedUrl = new URL(corsOrigin);
      corsOrigin = parsedUrl.origin;
    } catch {
      // Fallback to the original value if it doesn't parse as a full URL
    }
  }

  await app.register(cors, {
    origin: corsOrigin,
    credentials: true,
  });

  await app.register(jwt, {
    secret: env.JWT_SECRET,
    sign: { expiresIn: env.JWT_EXPIRES_IN },
  });



  app.setErrorHandler(errorHandler);

  app.get("/health", async () => ({ success: true, data: { status: "ok" } }));

  // ── Feature routes, namespaced under /api/v1 ─────────────────────────
  app.register(authRoutes, { prefix: "/api/v1/auth" });
  app.register(openingBalanceRoutes, { prefix: "/api/v1/opening-balance" });
  app.register(transactionRoutes, { prefix: "/api/v1/transactions" });
  app.register(recurringRoutes, { prefix: "/api/v1/recurring-expenses" });
  app.register(settingsRoutes, { prefix: "/api/v1/settings" });
  app.register(summaryRoutes, { prefix: "/api/v1/summary" });
  app.register(importRoutes, { prefix: "/api/v1/import" });

  return app;
}
