import type { FastifyInstance } from "fastify";
import { settingsController } from "../controllers/settings.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

export async function settingsRoutes(app: FastifyInstance) {
  app.get("/", { preHandler: requireAuth }, settingsController.get);
}
