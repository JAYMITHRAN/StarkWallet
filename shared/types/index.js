"use strict";
/**
 * @stark/shared
 * -----------------------------------------------------------------------------
 * Single source of truth for types shared between `client` and `server`.
 * Never import UI or Node-only code here — this package must stay isomorphic.
 * -----------------------------------------------------------------------------
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThemeMode = exports.RecurrenceFrequency = exports.TransactionCategory = exports.TransactionType = void 0;
// ─────────────────────────────────────────────────────────────────────────
// Enums
// ─────────────────────────────────────────────────────────────────────────
var TransactionType;
(function (TransactionType) {
    TransactionType["CASH_IN"] = "CASH_IN";
    TransactionType["CASH_OUT"] = "CASH_OUT";
    TransactionType["OPENING_BALANCE"] = "OPENING_BALANCE";
})(TransactionType || (exports.TransactionType = TransactionType = {}));
var TransactionCategory;
(function (TransactionCategory) {
    TransactionCategory["SALARY"] = "SALARY";
    TransactionCategory["BUSINESS"] = "BUSINESS";
    TransactionCategory["GIFT"] = "GIFT";
    TransactionCategory["INVESTMENT_RETURN"] = "INVESTMENT_RETURN";
    TransactionCategory["FOOD"] = "FOOD";
    TransactionCategory["TRANSPORT"] = "TRANSPORT";
    TransactionCategory["RENT"] = "RENT";
    TransactionCategory["UTILITIES"] = "UTILITIES";
    TransactionCategory["SHOPPING"] = "SHOPPING";
    TransactionCategory["HEALTH"] = "HEALTH";
    TransactionCategory["ENTERTAINMENT"] = "ENTERTAINMENT";
    TransactionCategory["EDUCATION"] = "EDUCATION";
    TransactionCategory["SUBSCRIPTION"] = "SUBSCRIPTION";
    TransactionCategory["BILLS"] = "BILLS";
    TransactionCategory["TRAVEL"] = "TRAVEL";
    TransactionCategory["INVESTMENT"] = "INVESTMENT";
    TransactionCategory["OTHER"] = "OTHER";
})(TransactionCategory || (exports.TransactionCategory = TransactionCategory = {}));
var RecurrenceFrequency;
(function (RecurrenceFrequency) {
    RecurrenceFrequency["DAILY"] = "DAILY";
    RecurrenceFrequency["WEEKLY"] = "WEEKLY";
    RecurrenceFrequency["MONTHLY"] = "MONTHLY";
    RecurrenceFrequency["YEARLY"] = "YEARLY";
})(RecurrenceFrequency || (exports.RecurrenceFrequency = RecurrenceFrequency = {}));
var ThemeMode;
(function (ThemeMode) {
    ThemeMode["DARK"] = "DARK";
})(ThemeMode || (exports.ThemeMode = ThemeMode = {}));
