import type { FastifyReply, FastifyRequest } from "fastify";
import { authService } from "../services/auth.service.js";
import { createPasswordSchema, loginSchema } from "../validators/auth.validator.js";
import type { ApiSuccess, AuthResponse, User } from "../shared/types/index.js";

function toPublicUser(user: { id: string; hasCompletedOnboarding: boolean; createdAt: Date; updatedAt: Date }): User {
  return {
    id: user.id,
    hasCompletedOnboarding: user.hasCompletedOnboarding,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}

/**
 * Returns the number of seconds remaining until the end of the current UTC day
 * (i.e. until 23:59:59 UTC tonight). Minimum 60 seconds to avoid edge-case
 * tokens with ~0 TTL issued right at midnight.
 */
function secondsUntilEndOfDay(): number {
  const now = new Date();
  const endOfDay = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59)
  );
  const diff = Math.floor((endOfDay.getTime() - now.getTime()) / 1000);
  return Math.max(diff, 60);
}

export const authController = {
  async status(_request: FastifyRequest, reply: FastifyReply) {
    const hasAccount = await authService.hasAccount();
    const body: ApiSuccess<{ hasAccount: boolean }> = { success: true, data: { hasAccount } };
    return reply.status(200).send(body);
  },

  async createPassword(request: FastifyRequest, reply: FastifyReply) {
    const input = createPasswordSchema.parse(request.body);
    const user = await authService.createPassword(input);
    // Token expires at end of today (UTC) — forces re-login the next calendar day
    const token = await reply.jwtSign({ userId: user.id }, { expiresIn: secondsUntilEndOfDay() });

    const body: ApiSuccess<AuthResponse> = { success: true, data: { token, user: toPublicUser(user) } };
    return reply.status(201).send(body);
  },

  async login(request: FastifyRequest, reply: FastifyReply) {
    const input = loginSchema.parse(request.body);
    const user = await authService.login(input);
    // Token expires at end of today (UTC) — forces re-login the next calendar day
    const token = await reply.jwtSign({ userId: user.id }, { expiresIn: secondsUntilEndOfDay() });

    const body: ApiSuccess<AuthResponse> = { success: true, data: { token, user: toPublicUser(user) } };
    return reply.status(200).send(body);
  },

  async me(request: FastifyRequest, reply: FastifyReply) {
    const { userId } = request.user;
    const user = await authService.getById(userId);
    const body: ApiSuccess<User> = { success: true, data: toPublicUser(user) };
    return reply.status(200).send(body);
  },
};
