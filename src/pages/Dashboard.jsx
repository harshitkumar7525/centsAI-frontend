import { useState, useEffect, useContext } from "react";
import { Pie, Line } from "react-chartjs-2";
import { UserContext } from "../context/userContext";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const { chats, api } = useContext(UserContext);

  const [dashboardData, setDashboardData] = useState({
    totalExpenses: 0,
    expensesThisMonth: 0,
    mostSpending: { category: "", amount: 0 },
    monthlyExpenses: [],
    expensesByCategory: {},
  });

  const [expensesData, setExpenseData] = useState([]);
  const [latestExpenses, setLatestExpenses] = useState([]);
  const [deleting, setDeleting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [filterPeriod, setFilterPeriod] = useState("week"); // default 1 week

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/dashboard");
        const fetchedData = response.data.transactions || response.data;
        setExpenseData(fetchedData);
        const sortedData = [...fetchedData].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setLatestExpenses(sortedData.slice(0, 5));
      } catch (error) {
        console.error("Error fetching expense data:", error);
      }
    };
    fetchData();
  }, [chats, api]);

  // Recalculate when data or filter changes
  useEffect(() => {
    const filtered = filterDataByPeriod(expensesData, filterPeriod);
    processExpenseData(filtered, filterPeriod);
  }, [expensesData, filterPeriod]);

  // Filter data by selected period
  const filterDataByPeriod = (data, period) => {
    const now = new Date();
    let startDate;

    switch (period) {
      case "week":
        startDate = new Date();
        startDate.setDate(now.getDate() - 6);
        break;
      case "15days":
        startDate = new Date();
        startDate.setDate(now.getDate() - 14);
        break;
      case "month":
        startDate = new Date();
        startDate.setMonth(now.getMonth() - 1);
        break;
      case "all":
      default:
        return data;
    }

    return data.filter(
      (expense) => new Date(expense.transactionDate) >= startDate
    );
  };

  // Process filtered data
  const processExpenseData = (data, period) => {
    let total = 0;
    let daily = new Map();
    let byCategory = {};
    let mostSpending = { category: "", amount: 0 };
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    let expensesThisMonth = 0;

    // Step 1: Aggregate by date (YYYY-MM-DD)
    data.forEach((expense) => {
      const amount = expense.amount;
      const category = expense.category;
      const transactionDate = new Date(expense.transactionDate);

      const dayKey = transactionDate.toISOString().split("T")[0];

      total += amount;

      if (!daily.has(dayKey)) daily.set(dayKey, 0);
      daily.set(dayKey, daily.get(dayKey) + amount);

      if (!byCategory[category]) byCategory[category] = 0;
      byCategory[category] += amount;

      if (byCategory[category] > mostSpending.amount) {
        mostSpending = { category, amount: byCategory[category] };
      }

      if (
        transactionDate.getMonth() === currentMonth &&
        transactionDate.getFullYear() === currentYear
      ) {
        expensesThisMonth += amount;
      }
    });

    // Step 2: Decide range to fill missing days
    let startDate, endDate;
    if (data.length > 0) {
      endDate = new Date(); // today
      startDate = new Date(endDate);

      if (period === "week") startDate.setDate(endDate.getDate() - 6);
      else if (period === "15days") startDate.setDate(endDate.getDate() - 14);
      else if (period === "month") startDate.setMonth(endDate.getMonth() - 1);
      else {
        // "all" → use min & max from data
        const sortedDates = [...daily.keys()].sort(
          (a, b) => new Date(a) - new Date(b)
        );
        startDate = new Date(sortedDates[0]);
        endDate = new Date(sortedDates[sortedDates.length - 1]);
      }

      // Step 3: Fill missing days with 0
      let cursor = new Date(startDate);
      while (cursor <= endDate) {
        const key = cursor.toISOString().split("T")[0];
        if (!daily.has(key)) daily.set(key, 0);
        cursor.setDate(cursor.getDate() + 1);
      }
    }

    // Step 4: Sort chronologically
    const sortedDaily = Array.from(daily.entries()).sort(
      ([a], [b]) => new Date(a) - new Date(b)
    );

    setDashboardData({
      totalExpenses: total,
      expensesThisMonth,
      mostSpending,
      monthlyExpenses: sortedDaily, // now daily data
      expensesByCategory: byCategory,
    });
  };

  const handleDelete = async (id) => {
    if (deleting) return;
    setDeleting(true);

    try {
      await api.delete(`/transactions/${id}`);
      const updatedExpenses = expensesData.filter((item) => item._id !== id);
      setExpenseData(updatedExpenses);
    } catch (error) {
      console.error("Error deleting entry:", error);
    } finally {
      setDeleting(false);
    }
  };

  const handleEdit = (transaction) => {
    setEditingTransaction({
      ...transaction,
      date: transaction.transactionDate.split("T")[0],
    });
    setIsModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedData = {
        amount: Number(editingTransaction.amount),
        date: editingTransaction.date,
        category: editingTransaction.category,
      };
      await api.put(`/transactions/${editingTransaction._id}`, updatedData);
      setIsModalOpen(false);
      const response = await api.get("/dashboard");
      setExpenseData(response.data.transactions || response.data);
    } catch (error) {
      console.error("Error updating transaction:", error);
    }
  };

  // Chart Data
  const lineChartData = {
    labels: dashboardData.monthlyExpenses.map(([day]) =>
      new Date(day).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
      })
    ),
    datasets: [
      {
        label: "Daily Expenses",
        data: dashboardData.monthlyExpenses.map(([_, amount]) => amount),
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const pieChartData = {
    labels: Object.keys(dashboardData.expensesByCategory),
    datasets: [
      {
        data: Object.values(dashboardData.expensesByCategory),
        backgroundColor: [
          "#81c784",
          "#66bb6a",
          "#4caf50",
          "#43a047",
          "#388e3c",
          "#2e7d32",
          "#1b5e20",
          "#c8e6c9",
        ],
        borderColor: "#1f2937",
        borderWidth: 1,
      },
    ],
  };

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: { color: "#e5e7eb" },
      },
      tooltip: {
        callbacks: {
          label: (context) =>
            `${context.label}: ₹${context.raw.toLocaleString()}`,
        },
      },
    },
  };

  const lineChartOptions = {
    ...commonOptions,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) =>
            `${context.dataset.label}: ₹${context.raw.toLocaleString()}`,
        },
      },
    },
    scales: {
      x: {
        grid: { color: "rgba(255, 255, 255, 0.1)" },
        ticks: { color: "#e5e7eb" },
      },
      y: {
        grid: { color: "rgba(255, 255, 255, 0.1)" },
        ticks: {
          color: "#e5e7eb",
          callback: (value) => `₹${value.toLocaleString()}`,
        },
      },
    },
  };

  const pieChartOptions = {
    ...commonOptions,
    plugins: {
      legend: {
        position: "right",
        labels: { color: "#e5e7eb" },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const total = context.dataset.data.reduce((sum, val) => sum + val, 0);
            const percentage = ((context.raw / total) * 100).toFixed(1);
            return `${context.label}: ₹${context.raw.toLocaleString()} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8">Expenses Analysis</h1>

      {/* Filter buttons */}
      <div className="flex gap-2 mb-6">
        {["week", "15days", "month", "all"].map((period) => (
          <button
            key={period}
            onClick={() => setFilterPeriod(period)}
            className={`px-3 py-1 rounded-md ${
              filterPeriod === period
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-300"
            }`}
          >
            {period === "week"
              ? "1 Week"
              : period === "15days"
              ? "15 Days"
              : period === "month"
              ? "1 Month"
              : "All Time"}
          </button>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700">
          <h2 className="text-sm font-semibold text-gray-400 mb-2">Total Expenses</h2>
          <p className="text-4xl font-bold text-gray-50">
            ₹{dashboardData.totalExpenses.toLocaleString()}
          </p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700">
          <h2 className="text-sm font-semibold text-gray-400 mb-2">Expenses This Month</h2>
          <p className="text-4xl font-bold text-gray-50">
            ₹{dashboardData.expensesThisMonth.toLocaleString()}
          </p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700">
          <h2 className="text-sm font-semibold text-gray-400 mb-2">Most Spending</h2>
          <p className="text-2xl font-bold text-red-500">
            {dashboardData.mostSpending.category || "N/A"}
          </p>
          <p className="text-xl text-gray-400 mt-1">
            ₹{dashboardData.mostSpending.amount.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700">
          <h2 className="text-lg font-semibold text-gray-50 mb-4">Time Wise Expenses</h2>
          <div className="h-96">
            <Line data={lineChartData} options={lineChartOptions} />
          </div>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700">
          <h2 className="text-lg font-semibold text-gray-50 mb-4">Expenses Breakdown</h2>
          <div className="h-96 flex justify-center items-center">
            <Pie data={pieChartData} options={pieChartOptions} />
          </div>
        </div>
      </div>

      {/* Latest Entries */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700 mt-8">
        <h2 className="text-lg font-semibold text-gray-50 mb-4">Latest 5 Entries</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {latestExpenses.length > 0 ? (
                latestExpenses.map((expense) => (
                  <tr key={expense._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{expense.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      ₹{expense.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {new Date(expense.transactionDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(expense)}
                        className="text-indigo-400 hover:text-indigo-600 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(expense._id)}
                        className="text-red-400 hover:text-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                    No recent entries found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-50">Edit Transaction</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-200"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleUpdate}>
              <div className="mb-4">
                <label className="block text-gray-300 text-sm font-medium mb-1">Amount</label>
                <input
                  type="number"
                  value={editingTransaction.amount}
                  onChange={(e) =>
                    setEditingTransaction({ ...editingTransaction, amount: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-gray-700 text-gray-100 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-300 text-sm font-medium mb-1">Date</label>
                <input
                  type="date"
                  value={editingTransaction.date}
                  onChange={(e) =>
                    setEditingTransaction({ ...editingTransaction, date: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-gray-700 text-gray-100 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-300 text-sm font-medium mb-1">Category</label>
                <input
                  type="text"
                  value={editingTransaction.category}
                  onChange={(e) =>
                    setEditingTransaction({ ...editingTransaction, category: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-gray-700 text-gray-100 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="mr-2 px-4 py-2 bg-gray-600 text-gray-100 rounded-md hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
