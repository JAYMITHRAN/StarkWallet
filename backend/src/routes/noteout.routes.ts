import type { FastifyInstance } from "fastify";
import { noteoutController } from "../controllers/noteout.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

export async function noteoutRoutes(app: FastifyInstance) {
  app.get("/summary", { preHandler: requireAuth }, noteoutController.summary);
  app.get("/", { preHandler: requireAuth }, noteoutController.list);
  app.post("/", { preHandler: requireAuth }, noteoutController.create);
  app.put("/:id", { preHandler: requireAuth }, noteoutController.update);
  app.delete("/:id", { preHandler: requireAuth }, noteoutController.destroy);
  app.post("/:id/restore", { preHandler: requireAuth }, noteoutController.restore);
}
