import type { FastifyInstance } from "fastify";
import { transactionController } from "../controllers/transaction.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

export async function transactionRoutes(app: FastifyInstance) {
  app.get("/dashboard", { preHandler: requireAuth }, transactionController.dashboard);
  app.get("/search", { preHandler: requireAuth }, transactionController.search);
  app.get("/filter", { preHandler: requireAuth }, transactionController.filter);
  app.post("/cash-out", { preHandler: requireAuth }, transactionController.cashOut);
  app.get("/", { preHandler: requireAuth }, transactionController.list);
  app.post("/", { preHandler: requireAuth }, transactionController.create);
  app.put("/:id", { preHandler: requireAuth }, transactionController.update);
  app.delete("/:id", { preHandler: requireAuth }, transactionController.destroy);
  app.post("/:id/restore", { preHandler: requireAuth }, transactionController.restore);
}
