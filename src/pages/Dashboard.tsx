import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Dashboard/Header";
import { AIInput } from "@/components/Dashboard/AIInput";
import { TransactionList } from "@/components/Dashboard/TransactionList";
import { AddTransactionDialog } from "@/components/Dashboard/AddTransactionDialog";
import { ExpenseChart } from "@/components/Dashboard/ExpenseChart";
import { PeriodSelector, type Period } from "@/components/Dashboard/PeriodSelector";
import { SpendingInsights } from "@/components/Dashboard/SpendingInsights";
import { SpendingTrendChart } from "@/components/Dashboard/SpendingTrendChart";
import { CategoryBreakdown } from "@/components/Dashboard/CategoryBreakdown";
import { api, auth, type Expense } from "@/lib/api";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Helmet } from "react-helmet-async";

function filterExpensesByPeriod(expenses: Expense[], period: Period): Expense[] {
  if (period === "all") return expenses;
  
  const days = period === "7d" ? 7 : period === "15d" ? 15 : 30;
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  
  return expenses.filter((exp) => new Date(exp.transactionDate) >= cutoff);
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState<Period>("30d");

  useEffect(() => {
    if (!auth.isAuthenticated()) {
      navigate("/login");
      return;
    }
    fetchTransactions();
  }, [navigate]);

  const fetchTransactions = async () => {
    try {
      const data = await api.getTransactions();
      setExpenses(data.allExpenses || []);
    } catch (error) {
      toast.error("Failed to load transactions");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredExpenses = filterExpensesByPeriod(expenses, period);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Dashboard - CentsAI</title>
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8 space-y-6">
          {/* Header with Period Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground">Track and analyze your expenses</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <PeriodSelector value={period} onChange={setPeriod} />
              <AddTransactionDialog onSuccess={fetchTransactions} />
            </div>
          </div>

          {/* Spending Insights */}
          <SpendingInsights expenses={expenses} period={period} />

          {/* AI Input */}
          <AIInput onSuccess={fetchTransactions} />

          {/* Charts Row */}
          <div className="grid lg:grid-cols-2 gap-6">
            <SpendingTrendChart expenses={expenses} period={period} />
            <CategoryBreakdown expenses={expenses} period={period} />
          </div>

          {/* Transactions and Pie Chart */}
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
              <TransactionList expenses={filteredExpenses} onUpdate={fetchTransactions} />
            </div>
            <div>
              <ExpenseChart expenses={filteredExpenses} />
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Dashboard;
