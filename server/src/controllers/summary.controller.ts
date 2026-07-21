import type { FastifyReply, FastifyRequest } from "fastify";
import { summaryService } from "../services/summary.service.js";

export const summaryController = {
  async getForMonth(request: FastifyRequest, reply: FastifyReply) {
    const { userId } = request.user;
    const { year, month } = request.params as { year: string; month: string };
    const summary = await summaryService.getForMonth(userId, Number(year), Number(month));
    return reply.status(200).send({ success: true, data: summary });
  },
};
