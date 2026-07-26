import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ResponsiveContainer } from "recharts";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
/**
 * Wraps any Recharts chart in a consistent glass card + ResponsiveContainer.
 * Feature phases (Analytics) drop a <BarChart>/<LineChart>/<PieChart> in as
 * children — this component only owns the frame, never chart-specific logic.
 */
export function ChartWrapper({ title, height = 260, children }) {
    return (_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: title }) }), _jsx(ResponsiveContainer, { width: "100%", height: height, children: children })] }));
}
