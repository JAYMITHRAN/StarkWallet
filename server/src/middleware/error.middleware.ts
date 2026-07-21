import type { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { ZodError } from "zod";
import { HttpError } from "../utils/httpError.js";
import type { ApiError } from "../../../shared/types/index.js";

/**
 * Every error in the app funnels through here and comes out as the same
 * `ApiError` envelope, so the client never has to guess the shape of a
 * failure response.
 */
export function errorHandler(error: FastifyError | Error, request: FastifyRequest, reply: FastifyReply) {
  if (error instanceof HttpError) {
    const body: ApiError = {
      success: false,
      error: { code: error.code, message: error.message, details: error.details },
    };
    return reply.status(error.statusCode).send(body);
  }

  if (error instanceof ZodError) {
    const body: ApiError = {
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Request validation failed",
        details: error.flatten(),
      },
    };
    return reply.status(400).send(body);
  }

  request.log.error(error);
  const body: ApiError = {
    success: false,
    error: { code: "INTERNAL_ERROR", message: "Something went wrong. Please try again." },
  };
  return reply.status(500).send(body);
}
