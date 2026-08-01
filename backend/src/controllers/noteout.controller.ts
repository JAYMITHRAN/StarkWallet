import type { FastifyReply, FastifyRequest } from "fastify";
import { noteoutService } from "../services/noteout.service.js";
import { createNoteoutSchema, updateNoteoutSchema } from "../validators/noteout.validator.js";
import type { ApiSuccess, CreateNoteoutRequest, Noteout, UpdateNoteoutRequest } from "../shared/types/index.js";

function serializeNoteout(noteout: any): Noteout {
  return {
    id: noteout.id,
    userId: noteout.userId,
    type: noteout.type as Noteout["type"],
    amount: noteout.amount,
    reason: noteout.reason,
    note: noteout.note,
    occurredAt: noteout.occurredAt.toISOString(),
    isDeleted: noteout.isDeleted,
    deletedAt: noteout.deletedAt ? noteout.deletedAt.toISOString() : null,
    createdAt: noteout.createdAt.toISOString(),
    updatedAt: noteout.updatedAt.toISOString(),
  };
}

export const noteoutController = {
  async list(request: FastifyRequest, reply: FastifyReply) {
    const { userId } = request.user;
    const query = request.query as Record<string, string | undefined>;
    const noteouts = await noteoutService.list(userId, {
      type: query.type as any,
      search: query.search,
      from: query.from,
      to: query.to,
      sort: query.sort as any,
    });
    const body: ApiSuccess<Noteout[]> = { success: true, data: noteouts.map(serializeNoteout) };
    return reply.status(200).send(body);
  },

  async create(request: FastifyRequest, reply: FastifyReply) {
    const input = createNoteoutSchema.parse(request.body);
    const { userId } = request.user;
    const noteout = await noteoutService.create(userId, input as CreateNoteoutRequest);
    const body: ApiSuccess<Noteout> = { success: true, data: serializeNoteout(noteout) };
    return reply.status(201).send(body);
  },

  async update(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const input = updateNoteoutSchema.parse(request.body);
    const { userId } = request.user;
    const noteout = await noteoutService.update(userId, id, input as UpdateNoteoutRequest);
    const body: ApiSuccess<Noteout> = { success: true, data: serializeNoteout(noteout) };
    return reply.status(200).send(body);
  },

  async destroy(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const { userId } = request.user;
    const noteout = await noteoutService.destroy(userId, id);
    const body: ApiSuccess<Noteout> = { success: true, data: serializeNoteout(noteout) };
    return reply.status(200).send(body);
  },

  async restore(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const { userId } = request.user;
    const noteout = await noteoutService.restore(userId, id);
    const body: ApiSuccess<Noteout> = { success: true, data: serializeNoteout(noteout) };
    return reply.status(200).send(body);
  },

  async summary(request: FastifyRequest, reply: FastifyReply) {
    const { userId } = request.user;
    const summary = await noteoutService.getSummary(userId);
    return reply.status(200).send({ success: true, data: summary });
  },
};
