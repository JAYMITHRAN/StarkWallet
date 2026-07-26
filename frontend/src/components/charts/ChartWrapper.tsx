import type { ReactElement } from "react";
import { ResponsiveContainer } from "recharts";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";

interface ChartWrapperProps {
  title: string;
  height?: number;
  children: ReactElement;
}

/**
 * Wraps any Recharts chart in a consistent glass card + ResponsiveContainer.
 * Feature phases (Analytics) drop a <BarChart>/<LineChart>/<PieChart> in as
 * children — this component only owns the frame, never chart-specific logic.
 */
export function ChartWrapper({ title, height = 260, children }: ChartWrapperProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <ResponsiveContainer width="100%" height={height}>
        {children}
      </ResponsiveContainer>
    </Card>
  );
}
