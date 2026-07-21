import { prisma } from "../lib/prisma.js";
import { HttpError } from "../utils/httpError.js";

export const settingsService = {
  async get(userId: string) {
    const settings = await prisma.settings.findUnique({ where: { userId } });
    if (!settings) throw HttpError.notFound("Settings not found.");
    return settings;
  },
};
