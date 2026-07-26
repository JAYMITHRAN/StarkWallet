import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function EmptyState({ icon: Icon, title, description, action }) {
    return (_jsxs("div", { className: "flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border px-6 py-12 text-center", children: [_jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-xl bg-surface", children: _jsx(Icon, { className: "h-5 w-5 text-text-muted", "aria-hidden": true }) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-text", children: title }), description && _jsx("p", { className: "mt-1 text-sm text-text-muted", children: description })] }), action] }));
}
