/**
 * Re-exports the shared contract types for convenient `@/types` imports
 * within client-only code (e.g. component props that reference API shapes).
 * Prefer importing directly from `@stark/shared/types` in services.
 */
export * from "@stark/shared/types/index";
