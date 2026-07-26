import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
function getStrength(password) {
    let score = 0;
    if (password.length >= 8)
        score += 1;
    if (/[A-Z]/.test(password))
        score += 1;
    if (/[0-9]/.test(password))
        score += 1;
    if (/[^A-Za-z0-9]/.test(password))
        score += 1;
    if (password.length >= 12)
        score += 1;
    if (score <= 2)
        return { label: "Weak", tone: "danger", width: "33%" };
    if (score <= 4)
        return { label: "Fair", tone: "warning", width: "66%" };
    return { label: "Strong", tone: "success", width: "100%" };
}
export function PasswordStrength({ password }) {
    if (!password)
        return null;
    const strength = getStrength(password);
    const toneClass = {
        danger: "bg-danger",
        warning: "bg-warning",
        success: "bg-success",
    }[strength.tone];
    return (_jsxs("div", { className: "space-y-2", "aria-live": "polite", children: [_jsxs("div", { className: "flex items-center justify-between text-xs text-text-muted", children: [_jsx("span", { children: "Password strength" }), _jsx("span", { className: "font-medium text-text", children: strength.label })] }), _jsx("div", { className: "h-2 overflow-hidden rounded-full bg-surface", children: _jsx("div", { className: `h-full rounded-full transition-all ${toneClass}`, style: { width: strength.width } }) })] }));
}
