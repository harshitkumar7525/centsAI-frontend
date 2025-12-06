import { TrendingUp, Receipt, Calendar, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { Expense } from "@/lib/api";

interface StatsCardsProps {
  expenses: Expense[];
}

export function StatsCards({ expenses }: StatsCardsProps) {
  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const transactionCount = expenses.length;
  
  const today = new Date().toISOString().split("T")[0];
  const todaySpent = expenses
    .filter((exp) => exp.transactionDate === today)
    .reduce((sum, exp) => sum + exp.amount, 0);

  const categories = [...new Set(expenses.map((exp) => exp.category))];

  const stats = [
    {
      label: "Total Spent",
      value: `&#8377;${totalSpent.toFixed(2)}`,
      icon: TrendingUp,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Transactions",
      value: transactionCount.toString(),
      icon: Receipt,
      color: "text-sky-400",
      bg: "bg-sky-400/10",
    },
    {
      label: "Today",
      value: `&#8377;${todaySpent.toFixed(2)}`,
      icon: Calendar,
      color: "text-orange-400",
      bg: "bg-orange-400/10",
    },
    {
      label: "Categories",
      value: categories.length.toString(),
      icon: Sparkles,
      color: "text-purple-400",
      bg: "bg-purple-400/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="p-4 hover:border-primary/30 transition-all">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
