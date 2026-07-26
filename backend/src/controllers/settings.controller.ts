import type { FastifyReply, FastifyRequest } from "fastify";
import { settingsService } from "../services/settings.service.js";
import type { ApiSuccess, Settings } from "../shared/types/index.js";

export const settingsController = {
  async get(request: FastifyRequest, reply: FastifyReply) {
    const { userId } = request.user;
    const settings = await settingsService.get(userId);
    const body: ApiSuccess<Settings> = {
      success: true,
      data: {
        id: settings.id,
        userId: settings.userId,
        currency: settings.currency,
        theme: settings.theme as Settings["theme"],
        notificationsEnabled: settings.notificationsEnabled,
        createdAt: settings.createdAt.toISOString(),
        updatedAt: settings.updatedAt.toISOString(),
      },
    };
    return reply.status(200).send(body);
  },
};
