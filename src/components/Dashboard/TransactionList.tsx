import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { getCategoryConfig, categoryList } from "@/lib/categories";
import type { Expense } from "@/lib/api";
import { api } from "@/lib/api";
import { format, parseISO, isToday, isYesterday, isSameDay } from "date-fns";
import { MoreVertical, Edit2, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface TransactionListProps {
  expenses: Expense[];
  onUpdate: () => void;
}

export function TransactionList({ expenses, onUpdate }: TransactionListProps) {
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [deletingExpenseId, setDeletingExpenseId] = useState<number | null>(null);
  const [editAmount, setEditAmount] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editDate, setEditDate] = useState("");
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const sortedExpenses = [...expenses].sort(
    (a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime()
  );

  // Group expenses by date
  const groupedExpenses = sortedExpenses.reduce((acc, expense) => {
    const date = expense.transactionDate.split("T")[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(expense);
    return acc;
  }, {} as Record<string, Expense[]>);

  const handleEditClick = (expense: Expense) => {
    setEditingExpense(expense);
    setEditAmount(expense.amount.toString());
    setEditCategory(expense.category);
    setEditDate(expense.transactionDate.split("T")[0]);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExpense?.id || !editAmount || !editCategory || !editDate) {
      toast.error("Please fill all fields");
      return;
    }

    setIsEditLoading(true);
    try {
      await api.updateTransaction(editingExpense.id, parseFloat(editAmount), editCategory, editDate);
      toast.success("Transaction updated!");
      setEditingExpense(null);
      onUpdate();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update transaction");
    } finally {
      setIsEditLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingExpenseId) return;

    setIsDeleteLoading(true);
    try {
      await api.deleteTransaction(deletingExpenseId);
      toast.success("Transaction deleted!");
      setDeletingExpenseId(null);
      onUpdate();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete transaction");
    } finally {
      setIsDeleteLoading(false);
    }
  };

  const getDateLabel = (dateStr: string) => {
    const date = parseISO(dateStr);
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return format(date, "EEEE, MMM d, yyyy");
  };

  if (expenses.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">No transactions yet. Add your first expense above!</p>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {Object.entries(groupedExpenses).map(([date, dayExpenses]) => {
          const dayTotal = dayExpenses.reduce((sum, exp) => sum + exp.amount, 0);
          
          return (
            <Card key={date} className="overflow-hidden">
              <div className="bg-secondary/50 px-4 py-3 flex items-center justify-between border-b border-border">
                <h3 className="font-semibold text-sm">{getDateLabel(date)}</h3>
                <span className="text-sm font-medium text-muted-foreground">
                  ₹{dayTotal.toFixed(2)}
                </span>
              </div>
              <div className="divide-y divide-border">
                {dayExpenses.map((expense, index) => {
                  const category = getCategoryConfig(expense.category);
                  const Icon = category.icon;
                  
                  return (
                    <div
                      key={`${expense.id || index}`}
                      className="flex items-center justify-between p-4 hover:bg-secondary/30 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg ${category.bgColor} flex items-center justify-center`}>
                          <Icon className={`w-5 h-5 ${category.color}`} />
                        </div>
                        <div>
                          <p className="font-medium">{expense.category}</p>
                          <p className="text-sm text-muted-foreground">
                            {format(parseISO(expense.transactionDate), "h:mm a")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="text-lg font-semibold">
                          -₹{expense.amount.toFixed(2)}
                        </p>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem 
                              onClick={() => {
                                if (!expense.id) {
                                  toast.error("Transaction ID not found");
                                  return;
                                }
                                handleEditClick(expense);
                              }}
                            >
                              <Edit2 className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                if (!expense.id) {
                                  toast.error("Transaction ID not found");
                                  return;
                                }
                                setDeletingExpenseId(expense.id);
                              }}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingExpense} onOpenChange={(open) => !open && setEditingExpense(null)}>
        <DialogContent className="glass border-border/50">
          <DialogHeader>
            <DialogTitle>Edit Transaction</DialogTitle>
            <DialogDescription>Update your expense details</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-amount">Amount (₹)</Label>
              <Input
                id="edit-amount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={editAmount}
                onChange={(e) => setEditAmount(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-category">Category</Label>
              <Select value={editCategory} onValueChange={setEditCategory} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categoryList.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-date">Date</Label>
              <Input
                id="edit-date"
                type="date"
                value={editDate}
                onChange={(e) => setEditDate(e.target.value)}
                required
              />
            </div>
            <div className="flex gap-3 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditingExpense(null)}
                disabled={isEditLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isEditLoading}>
                {isEditLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Save Changes
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingExpenseId} onOpenChange={(open) => !open && setDeletingExpenseId(null)}>
        <AlertDialogContent className="glass border-border/50">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Transaction</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this transaction? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleteLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleteLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleteLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
