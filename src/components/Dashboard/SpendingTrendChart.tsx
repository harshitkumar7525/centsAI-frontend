import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import type { Expense } from "@/lib/api";
import type { Period } from "./PeriodSelector";
import { format, subDays, parseISO, startOfDay, eachDayOfInterval } from "date-fns";

interface SpendingTrendChartProps {
  expenses: Expense[];
  period: Period;
}

function getPeriodDays(period: Period): number {
  switch (period) {
    case "7d": return 7;
    case "15d": return 15;
    case "30d": return 30;
    default: return 30;
  }
}

export function SpendingTrendChart({ expenses, period }: SpendingTrendChartProps) {
  const days = period === "all" ? 30 : getPeriodDays(period);
  const today = startOfDay(new Date());
  const startDate = subDays(today, days - 1);
  
  // Create array of all days in range
  const dateRange = eachDayOfInterval({ start: startDate, end: today });
  
  // Group expenses by date
  const expensesByDate = expenses.reduce((acc, exp) => {
    const dateKey = exp.transactionDate;
    acc[dateKey] = (acc[dateKey] || 0) + exp.amount;
    return acc;
  }, {} as Record<string, number>);
  
  // Create chart data with all days
  const chartData = dateRange.map((date) => {
    const dateKey = format(date, "yyyy-MM-dd");
    return {
      date: format(date, "MMM d"),
      amount: expensesByDate[dateKey] || 0,
      fullDate: dateKey,
    };
  });

  const maxAmount = Math.max(...chartData.map((d) => d.amount), 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Daily Spending</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(217 33% 17%)" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fill: "hsl(215 20% 55%)", fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: "hsl(217 33% 17%)" }}
                interval={period === "7d" ? 0 : period === "15d" ? 1 : 4}
              />
              <YAxis
                tick={{ fill: "hsl(215 20% 55%)", fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `₹${value}`}
                width={50}
                domain={[0, maxAmount * 1.1]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(222 47% 8%)",
                  border: "1px solid hsl(217 33% 17%)",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "hsl(210 40% 98%)" }}
                formatter={(value: number) => [`₹${value.toFixed(2)}`, "Spent"]}
              />
              <Bar
                dataKey="amount"
                fill="hsl(160 84% 39%)"
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
