import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Crown, ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { getCategoryConfig } from "@/lib/categories";
import type { Expense } from "@/lib/api";
import type { Period } from "./PeriodSelector";

interface SpendingInsightsProps {
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

function getPreviousPeriodExpenses(expenses: Expense[], days: number): Expense[] {
  const now = new Date();
  const periodStart = new Date();
  periodStart.setDate(now.getDate() - days);
  const previousStart = new Date();
  previousStart.setDate(now.getDate() - days * 2);
  
  return expenses.filter((exp) => {
    const date = new Date(exp.transactionDate);
    return date >= previousStart && date < periodStart;
  });
}

export function SpendingInsights({ expenses, period }: SpendingInsightsProps) {
  const days = getPeriodDays(period);
  const currentExpenses = filterByDays(expenses, days);
  const currentTotal = currentExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  
  // Calculate most spending category
  const categoryTotals = currentExpenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {} as Record<string, number>);
  
  const topCategory = Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1])[0];
  
  const topCategoryConfig = topCategory ? getCategoryConfig(topCategory[0]) : null;
  const TopCategoryIcon = topCategoryConfig?.icon;
  
  // Calculate comparison with previous period
  let previousTotal = 0;
  let comparisonLabel = "";
  let percentChange = 0;
  
  if (days) {
    const previousExpenses = getPreviousPeriodExpenses(expenses, days);
    previousTotal = previousExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    comparisonLabel = days === 7 ? "vs last week" : days === 15 ? "vs last 15 days" : "vs last month";
    percentChange = previousTotal > 0 ? ((currentTotal - previousTotal) / previousTotal) * 100 : 0;
  }
  
  // Calculate daily average
  const daysInPeriod = days || (currentExpenses.length > 0 
    ? Math.ceil((new Date().getTime() - new Date(currentExpenses[currentExpenses.length - 1]?.transactionDate).getTime()) / (1000 * 60 * 60 * 24)) + 1
    : 1);
  const dailyAverage = currentTotal / Math.max(daysInPeriod, 1);

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Spending */}
      <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            Total Spending
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-primary">₹{currentTotal.toFixed(2)}</p>
          {days && previousTotal > 0 && (
            <div className={`flex items-center gap-1 mt-1 text-sm ${
              percentChange > 0 ? "text-red-400" : percentChange < 0 ? "text-emerald-400" : "text-muted-foreground"
            }`}>
              {percentChange > 0 ? (
                <ArrowUpRight className="w-4 h-4" />
              ) : percentChange < 0 ? (
                <ArrowDownRight className="w-4 h-4" />
              ) : (
                <Minus className="w-4 h-4" />
              )}
              <span>{Math.abs(percentChange).toFixed(1)}% {comparisonLabel}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Top Category */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Crown className="w-4 h-4 text-yellow-400" />
            Top Category
          </CardTitle>
        </CardHeader>
        <CardContent>
          {topCategory ? (
            <>
              <div className="flex items-center gap-2">
                {TopCategoryIcon && (
                  <div className={`w-8 h-8 rounded-lg ${topCategoryConfig?.bgColor} flex items-center justify-center`}>
                    <TopCategoryIcon className={`w-4 h-4 ${topCategoryConfig?.color}`} />
                  </div>
                )}
                <p className="text-xl font-bold">{topCategory[0]}</p>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                ₹{topCategory[1].toFixed(2)} ({((topCategory[1] / currentTotal) * 100).toFixed(0)}% of total)
              </p>
            </>
          ) : (
            <p className="text-muted-foreground">No data</p>
          )}
        </CardContent>
      </Card>

      {/* Daily Average */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-sky-400" />
            Daily Average
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">₹{dailyAverage.toFixed(2)}</p>
          <p className="text-sm text-muted-foreground mt-1">per day</p>
        </CardContent>
      </Card>

      {/* Transactions Count */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-purple-400/20 flex items-center justify-center text-xs text-purple-400">#</span>
            Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{currentExpenses.length}</p>
          <p className="text-sm text-muted-foreground mt-1">
            {Object.keys(categoryTotals).length} categories
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
