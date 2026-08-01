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
export var TransactionType;
(function (TransactionType) {
    TransactionType["CASH_IN"] = "CASH_IN";
    TransactionType["CASH_OUT"] = "CASH_OUT";
    TransactionType["OPENING_BALANCE"] = "OPENING_BALANCE";
})(TransactionType || (TransactionType = {}));
export var TransactionCategory;
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
})(TransactionCategory || (TransactionCategory = {}));
export var RecurrenceFrequency;
(function (RecurrenceFrequency) {
    RecurrenceFrequency["DAILY"] = "DAILY";
    RecurrenceFrequency["WEEKLY"] = "WEEKLY";
    RecurrenceFrequency["MONTHLY"] = "MONTHLY";
    RecurrenceFrequency["YEARLY"] = "YEARLY";
})(RecurrenceFrequency || (RecurrenceFrequency = {}));
export var NoteoutType;
(function (NoteoutType) {
    NoteoutType["IN"] = "IN";
    NoteoutType["OUT"] = "OUT";
})(NoteoutType || (NoteoutType = {}));
export var ThemeMode;
(function (ThemeMode) {
    ThemeMode["DARK"] = "DARK";
})(ThemeMode || (ThemeMode = {}));
