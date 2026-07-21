import type { FastifyInstance } from "fastify";
import { openingBalanceController } from "../controllers/openingBalance.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

export async function openingBalanceRoutes(app: FastifyInstance) {
  app.post("/", { preHandler: requireAuth }, openingBalanceController.set);
}
