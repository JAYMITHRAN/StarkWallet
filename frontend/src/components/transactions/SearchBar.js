import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/Input";
export function SearchBar({ value, onChange }) {
    return (_jsxs("div", { className: "relative", children: [_jsx(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted", "aria-hidden": true }), _jsx(Input, { value: value, onChange: (event) => onChange(event.target.value), className: "pl-10", "aria-label": "Search transactions", placeholder: "Search reason, category, notes or amount" })] }));
}
