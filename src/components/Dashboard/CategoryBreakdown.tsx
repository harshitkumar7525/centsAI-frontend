import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCategoryConfig } from "@/lib/categories";
import type { Expense } from "@/lib/api";
import type { Period } from "./PeriodSelector";

interface CategoryBreakdownProps {
  expenses: Expense[];
  period: Period;
}

function getPeriodDays(period: Period): number | null {
  switch (period) {
    case "7d": return 7;
    case "15d": return 15;
    case "30d": return 30;
    default: return null;
  }
}

function filterByDays(expenses: Expense[], days: number | null): Expense[] {
  if (days === null) return expenses;
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return expenses.filter((exp) => new Date(exp.transactionDate) >= cutoff);
}

const categoryColors: Record<string, string> = {
  food: "bg-orange-400",
  transport: "bg-sky-400",
  transportation: "bg-sky-400",
  entertainment: "bg-purple-400",
  groceries: "bg-emerald-400",
  shopping: "bg-pink-400",
  utilities: "bg-yellow-400",
  health: "bg-red-400",
  other: "bg-gray-400",
};

function getCategoryBarColor(category: string): string {
  const key = category.toLowerCase();
  return categoryColors[key] || "bg-primary";
}

export function CategoryBreakdown({ expenses, period }: CategoryBreakdownProps) {
  const days = getPeriodDays(period);
  const filteredExpenses = filterByDays(expenses, days);
  const total = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  
  const categoryTotals = filteredExpenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {} as Record<string, number>);
  
  const sortedCategories = Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1]);

  if (sortedCategories.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Category Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[200px]">
          <p className="text-muted-foreground">No expenses in this period</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Category Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {sortedCategories.map(([category, amount]) => {
          const config = getCategoryConfig(category);
          const Icon = config.icon;
          const percentage = total > 0 ? (amount / total) * 100 : 0;
          const barColor = getCategoryBarColor(category);
          
          return (
            <div key={category} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-lg ${config.bgColor} flex items-center justify-center`}>
                    <Icon className={`w-4 h-4 ${config.color}`} />
                  </div>
                  <span className="font-medium">{category}</span>
                </div>
                <div className="text-right">
                  <span className="font-semibold">₹{amount.toFixed(2)}</span>
                  <span className="text-muted-foreground text-sm ml-2">
                    ({percentage.toFixed(0)}%)
                  </span>
                </div>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
