// ─────────────────────────────────────────────────────────────────────────────
// StarkMoneyWalletTracker — Import Controller
// ─────────────────────────────────────────────────────────────────────────────
import type { FastifyReply, FastifyRequest } from "fastify";
import { randomUUID } from "crypto";
import {
  parseFileBuffer,
  validateAndEnrichRows,
  detectDuplicates,
  storeSession,
  getSession,
  clearSession,
  batchInsert,
  buildSummary,
  logImportHistory,
  getImportHistory,
} from "../services/import.service.js";
import { confirmImportSchema } from "../validators/import.validator.js";
import { HttpError } from "../utils/httpError.js";

export const importController = {
  /**
   * POST /api/v1/import/file
   * Accepts a multipart form with a single file field named "file".
   * Parses the file, validates rows, detects duplicates, stores session,
   * and returns the preview data.
   */
  async uploadFile(request: FastifyRequest, reply: FastifyReply) {
    const { userId } = request.user;

    // Collect multipart file
    const data = await request.file();
    if (!data) throw HttpError.badRequest("No file uploaded. Send a multipart/form-data request with field 'file'.");

    const allowedMimes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
      "application/vnd.ms-excel",                                           // .xls
      "text/csv",                                                            // .csv
      "application/csv",
      "text/plain",
    ];

    const allowedExts = [".xlsx", ".xls", ".csv"];
    const filename = data.filename ?? "";
    const ext = filename.substring(filename.lastIndexOf(".")).toLowerCase();

    if (!allowedMimes.includes(data.mimetype) && !allowedExts.includes(ext)) {
      throw HttpError.badRequest("Unsupported file type. Please upload .xlsx, .xls, or .csv");
    }

    // Buffer the file
    const chunks: Buffer[] = [];
    for await (const chunk of data.file) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    if (buffer.length === 0) throw HttpError.badRequest("Uploaded file is empty.");
    if (buffer.length > 10 * 1024 * 1024) throw HttpError.badRequest("File exceeds 10 MB limit.");

    // Parse → Validate → Detect duplicates
    const rawRows = parseFileBuffer(buffer, data.mimetype || ext);
    const enrichedRows = validateAndEnrichRows(rawRows);
    const withDuplicates = await detectDuplicates(userId, enrichedRows);

    // Store in session
    const sessionId = randomUUID();
    storeSession(userId, sessionId, withDuplicates);

    const summary = buildSummary(withDuplicates, false);

    return reply.status(200).send({
      success: true,
      data: {
        sessionId,
        filename,
        rows: withDuplicates,
        summary,
      },
    });
  },

  /**
   * POST /api/v1/import/preview
   * Re-fetch the current session preview (idempotent).
   */
  async preview(request: FastifyRequest, reply: FastifyReply) {
    const { userId } = request.user;
    const body = request.body as { sessionId: string; overrideDuplicates?: boolean };

    if (!body.sessionId) throw HttpError.badRequest("sessionId is required.");

    const rows = getSession(userId, body.sessionId);
    if (!rows) throw HttpError.notFound("Session not found or expired. Please re-upload the file.");

    const overrideDuplicates = body.overrideDuplicates ?? false;
    const summary = buildSummary(rows, overrideDuplicates);

    return reply.status(200).send({
      success: true,
      data: { sessionId: body.sessionId, rows, summary },
    });
  },

  /**
   * POST /api/v1/import/confirm
   * Performs the actual batch insert.
   */
  async confirm(request: FastifyRequest, reply: FastifyReply) {
    const { userId } = request.user;
    const input = confirmImportSchema.parse(request.body);

    const rows = getSession(userId, input.sessionId);
    if (!rows) throw HttpError.notFound("Session not found or expired. Please re-upload the file.");

    const { importedCount, skippedCount } = await batchInsert(userId, rows, input.overrideDuplicates);

    // Log to history
    logImportHistory({
      sessionId: input.sessionId,
      userId,
      importedAt: new Date().toISOString(),
      importedRows: importedCount,
      skippedRows: skippedCount,
      totalRows: rows.length,
    });

    // Clean up session after successful import
    clearSession(userId, input.sessionId);

    const summary = buildSummary(rows, input.overrideDuplicates);

    return reply.status(200).send({
      success: true,
      data: {
        importedRows: importedCount,
        skippedRows: skippedCount,
        totalRows: rows.length,
        cashInTotal: summary.cashInTotal,
        cashOutTotal: summary.cashOutTotal,
        netBalance: summary.netBalance,
      },
    });
  },

  /**
   * GET /api/v1/import/history
   * Returns the list of past imports (in-memory, resets on server restart).
   */
  async history(request: FastifyRequest, reply: FastifyReply) {
    const { userId } = request.user;
    const history = getImportHistory(userId);
    return reply.status(200).send({ success: true, data: history });
  },
};
