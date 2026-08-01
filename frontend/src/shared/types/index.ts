/**
 * @stark/shared
 * -----------------------------------------------------------------------------
 * Single source of truth for types shared between `client` and `server`.
 * Never import UI or Node-only code here — this package must stay isomorphic.
 * -----------------------------------------------------------------------------
 */

// ─────────────────────────────────────────────────────────────────────────
// Enums
// ─────────────────────────────────────────────────────────────────────────

export enum TransactionType {
  CASH_IN = "CASH_IN",
  CASH_OUT = "CASH_OUT",
  OPENING_BALANCE = "OPENING_BALANCE",
}

export enum TransactionCategory {
  SALARY = "SALARY",
  BUSINESS = "BUSINESS",
  GIFT = "GIFT",
  INVESTMENT_RETURN = "INVESTMENT_RETURN",
  FOOD = "FOOD",
  TRANSPORT = "TRANSPORT",
  RENT = "RENT",
  UTILITIES = "UTILITIES",
  SHOPPING = "SHOPPING",
  HEALTH = "HEALTH",
  ENTERTAINMENT = "ENTERTAINMENT",
  EDUCATION = "EDUCATION",
  SUBSCRIPTION = "SUBSCRIPTION",
  BILLS = "BILLS",
  TRAVEL = "TRAVEL",
  INVESTMENT = "INVESTMENT",
  OTHER = "OTHER",
}

export enum RecurrenceFrequency {
  DAILY = "DAILY",
  WEEKLY = "WEEKLY",
  MONTHLY = "MONTHLY",
  YEARLY = "YEARLY",
}

export enum NoteoutType {
  IN = "IN",
  OUT = "OUT",
}

export enum ThemeMode {
  DARK = "DARK", // Phase 1: dark is the only supported mode
}

// ─────────────────────────────────────────────────────────────────────────
// Core Entities
// (Mirror Prisma models. Dates are ISO strings on the wire, Date objects
//  once deserialized on the client via the API service layer.)
// ─────────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  hasCompletedOnboarding: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  category: TransactionCategory;
  amount: number;
  reason: string | null;
  note: string | null;
  occurredAt: string;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RecurringExpense {
  id: string;
  userId: string;
  label: string;
  amount: number;
  category: TransactionCategory;
  frequency: RecurrenceFrequency;
  nextRunAt: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MonthlySummary {
  id: string;
  userId: string;
  month: number; // 1-12
  year: number;
  totalCashIn: number;
  totalCashOut: number;
  closingBalance: number;
  createdAt: string;
  updatedAt: string;
}

export interface Settings {
  id: string;
  userId: string;
  currency: string; // ISO 4217, e.g. "INR"
  theme: ThemeMode;
  notificationsEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Noteout {
  id: string;
  userId: string;
  type: NoteoutType;
  amount: number;
  reason: string;
  note: string | null;
  occurredAt: string;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// ─────────────────────────────────────────────────────────────────────────
// API Contracts — Auth
// ─────────────────────────────────────────────────────────────────────────

export interface CreatePasswordRequest {
  password: string;
  confirmPassword: string;
}

export interface LoginRequest {
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// ─────────────────────────────────────────────────────────────────────────
// API Contracts — Onboarding
// ─────────────────────────────────────────────────────────────────────────

export interface OpeningBalanceRequest {
  amount: number;
}

// ─────────────────────────────────────────────────────────────────────────
// API Contracts — Transactions
// ─────────────────────────────────────────────────────────────────────────

export interface CreateTransactionRequest {
  type: TransactionType;
  category: TransactionCategory;
  amount: number;
  reason?: string;
  note?: string;
  occurredAt?: string;
}

export interface UpdateTransactionRequest {
  type?: TransactionType;
  category?: TransactionCategory;
  amount?: number;
  reason?: string;
  note?: string;
  occurredAt?: string;
}

export interface TransactionListQuery {
  page?: number;
  pageSize?: number;
  type?: TransactionType;
  category?: TransactionCategory;
  search?: string;
  from?: string;
  to?: string;
  sort?: "newest" | "oldest" | "highest" | "lowest" | "category";
  includeDeleted?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────
// Generic API envelope
// ─────────────────────────────────────────────────────────────────────────

export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export interface PaginatedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

// ─────────────────────────────────────────────────────────────────────────
// API Contracts — Noteouts
// ─────────────────────────────────────────────────────────────────────────

export interface CreateNoteoutRequest {
  type: NoteoutType;
  amount: number;
  reason: string;
  note?: string;
  occurredAt?: string;
}

export interface UpdateNoteoutRequest {
  type?: NoteoutType;
  amount?: number;
  reason?: string;
  note?: string;
  occurredAt?: string;
}

export interface NoteoutListQuery {
  type?: NoteoutType;
  search?: string;
  from?: string;
  to?: string;
  sort?: "newest" | "oldest" | "highest" | "lowest";
}
