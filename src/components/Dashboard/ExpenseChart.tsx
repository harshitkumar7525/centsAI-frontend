import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import type { Expense } from "@/lib/api";

interface ExpenseChartProps {
  expenses: Expense[];
}

const COLORS = [
  "hsl(160, 84%, 39%)", // primary emerald
  "hsl(199, 89%, 48%)", // sky
  "hsl(280, 87%, 65%)", // purple
  "hsl(24, 95%, 53%)",  // orange
  "hsl(340, 82%, 52%)", // pink
  "hsl(47, 96%, 53%)",  // yellow
  "hsl(0, 84%, 60%)",   // red
  "hsl(215, 20%, 55%)", // gray
];

export function ExpenseChart({ expenses }: ExpenseChartProps) {
  const categoryTotals = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(categoryTotals)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Spending by Category</CardTitle>
        </CardHeader>
        <CardContent className="h-[250px] flex items-center justify-center">
          <p className="text-muted-foreground text-sm">No data to display</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Spending by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(222 47% 8%)",
                  border: "1px solid hsl(217 33% 17%)",
                  borderRadius: "8px",
                  color: "hsl(210 40% 98%)",
                }}
                itemStyle={{
                  color: "hsl(210 40% 98%)",
                }}
                labelStyle={{
                  color: "hsl(210 40% 98%)",
                }}
                formatter={(value: number) => [`₹${value.toFixed(2)}`, "Amount"]}
              />
              <Legend 
                formatter={(value) => <span className="text-foreground text-sm">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
