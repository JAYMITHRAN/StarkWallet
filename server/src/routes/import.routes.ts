// ─────────────────────────────────────────────────────────────────────────────
// StarkMoneyWalletTracker — Import Routes
// ─────────────────────────────────────────────────────────────────────────────
import type { FastifyInstance } from "fastify";
import multipart from "@fastify/multipart";
import { importController } from "../controllers/import.controller.js";

export async function importRoutes(app: FastifyInstance) {
  // Register multipart SCOPED to this plugin only — prevents it from
  // intercepting DELETE / PUT requests on other routes and causing 500 errors.
  await app.register(multipart, {
    limits: { fileSize: 10 * 1024 * 1024 },
  });

  // All import routes require authentication
  app.addHook("onRequest", async (request) => {
    await request.jwtVerify();
  });

  // POST /api/v1/import/file — upload and parse
  app.post("/file", importController.uploadFile);

  // POST /api/v1/import/preview — re-fetch session with updated options
  app.post("/preview", importController.preview);

  // POST /api/v1/import/confirm — batch insert
  app.post("/confirm", importController.confirm);

  // GET /api/v1/import/history — past imports
  app.get("/history", importController.history);
}
