import type { FastifyInstance } from "fastify";
import { summaryController } from "../controllers/summary.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

export async function summaryRoutes(app: FastifyInstance) {
  app.get("/:year/:month", { preHandler: requireAuth }, summaryController.getForMonth);
}
