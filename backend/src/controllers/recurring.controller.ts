import type { FastifyReply, FastifyRequest } from "fastify";
import { HttpError } from "../utils/httpError.js";

export const recurringController = {
  async list(_request: FastifyRequest, _reply: FastifyReply) {
    throw new HttpError(501, "NOT_IMPLEMENTED", "Recurring expenses arrive in a later phase.");
  },
};
