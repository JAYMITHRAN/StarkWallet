import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
/** Merge Tailwind classes safely, resolving conflicting utility classes. */
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}
/** Formats a number as currency using the account's configured currency. */
export function formatCurrency(amount, currency = "INR") {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency,
        maximumFractionDigits: 2,
    }).format(amount);
}
export function formatDate(iso) {
    return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(iso));
}
