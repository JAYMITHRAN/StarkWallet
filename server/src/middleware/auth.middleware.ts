import type { FastifyReply, FastifyRequest } from "fastify";
import { HttpError } from "../utils/httpError.js";

/**
 * Guards a route behind a valid JWT. Relies on @fastify/jwt being
 * registered on the app (see app.ts), which decorates `request.jwtVerify`.
 * On success, `request.user` is populated with the decoded payload
 * (see the module augmentation below).
 */
export async function requireAuth(request: FastifyRequest, _reply: FastifyReply) {
  try {
    await request.jwtVerify();
  } catch {
    throw HttpError.unauthorized("Invalid or expired session. Please log in again.");
  }
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: { userId: string };
    user: { userId: string };
  }
}
