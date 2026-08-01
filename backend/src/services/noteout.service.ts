import { prisma } from "../lib/prisma.js";
import { HttpError } from "../utils/httpError.js";
import type { CreateNoteoutRequest, UpdateNoteoutRequest, NoteoutListQuery } from "../shared/types/index.js";

interface NoteoutSummary {
  totalNotedIn: number;
  totalNotedOut: number;
  count: number;
}

export const noteoutService = {
  async list(userId: string, options: NoteoutListQuery = {}) {
    const { type, search, from, to, sort = "newest" } = options;
    const where: Record<string, unknown> = { userId, isDeleted: false };

    if (type) where.type = type;
    if (from || to) {
      where.occurredAt = {} as Record<string, unknown>;
      if (from) (where.occurredAt as Record<string, Date>).gte = new Date(from);
      if (to) (where.occurredAt as Record<string, Date>).lte = new Date(to);
    }
    if (search) {
      where.OR = [
        { reason: { contains: search } },
        { note: { contains: search } },
      ];
    }

    const orderBy =
      sort === "oldest"
        ? { occurredAt: "asc" as const }
        : sort === "highest"
          ? { amount: "desc" as const }
          : sort === "lowest"
            ? { amount: "asc" as const }
            : { occurredAt: "desc" as const };

    return prisma.noteout.findMany({ where, orderBy });
  },

  async create(userId: string, input: CreateNoteoutRequest) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw HttpError.notFound("User not found.");

    return prisma.noteout.create({
      data: {
        userId,
        type: input.type,
        amount: input.amount,
        reason: input.reason,
        note: input.note ?? null,
        occurredAt: input.occurredAt ? new Date(input.occurredAt) : new Date(),
      },
    });
  },

  async update(userId: string, noteoutId: string, input: UpdateNoteoutRequest) {
    const existing = await prisma.noteout.findFirst({ where: { id: noteoutId, userId } });
    if (!existing) throw HttpError.notFound("Noteout not found.");

    return prisma.noteout.update({
      where: { id: noteoutId },
      data: {
        ...(input.type ? { type: input.type } : {}),
        ...(typeof input.amount === "number" ? { amount: input.amount } : {}),
        ...(input.reason !== undefined ? { reason: input.reason } : {}),
        ...(input.note !== undefined ? { note: input.note || null } : {}),
        ...(input.occurredAt ? { occurredAt: new Date(input.occurredAt) } : {}),
      },
    });
  },

  async destroy(userId: string, noteoutId: string) {
    const existing = await prisma.noteout.findFirst({ where: { id: noteoutId, userId } });
    if (!existing) throw HttpError.notFound("Noteout not found.");

    return prisma.noteout.update({
      where: { id: noteoutId },
      data: { isDeleted: true, deletedAt: new Date() },
    });
  },

  async restore(userId: string, noteoutId: string) {
    const existing = await prisma.noteout.findFirst({ where: { id: noteoutId, userId } });
    if (!existing) throw HttpError.notFound("Noteout not found.");

    return prisma.noteout.update({
      where: { id: noteoutId },
      data: { isDeleted: false, deletedAt: null },
    });
  },

  async getSummary(userId: string): Promise<NoteoutSummary> {
    const noteouts = await prisma.noteout.findMany({
      where: { userId, isDeleted: false },
    });

    const totalNotedIn = noteouts
      .filter((n) => n.type === "IN")
      .reduce((sum, n) => sum + n.amount, 0);
    const totalNotedOut = noteouts
      .filter((n) => n.type === "OUT")
      .reduce((sum, n) => sum + n.amount, 0);

    return { totalNotedIn, totalNotedOut, count: noteouts.length };
  },
};
