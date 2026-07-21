import type { FastifyInstance } from "fastify";
import { recurringController } from "../controllers/recurring.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

export async function recurringRoutes(app: FastifyInstance) {
  app.get("/", { preHandler: requireAuth }, recurringController.list);
}
