import type { FastifyInstance } from "fastify";
import { authController } from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

export async function authRoutes(app: FastifyInstance) {
  app.get("/status", authController.status);
  app.post("/create-password", authController.createPassword);
  app.post("/login", authController.login);
  app.get("/me", { preHandler: requireAuth }, authController.me);
}
