import { 
  Utensils, 
  Car, 
  Tv, 
  ShoppingCart, 
  ShoppingBag, 
  Zap, 
  Heart, 
  MoreHorizontal,
  type LucideIcon
} from "lucide-react";

export interface CategoryConfig {
  name: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

export const categories: Record<string, CategoryConfig> = {
  food: {
    name: "Food",
    icon: Utensils,
    color: "text-orange-400",
    bgColor: "bg-orange-400/10",
  },
  transportation: {
    name: "Transportation",
    icon: Car,
    color: "text-sky-400",
    bgColor: "bg-sky-400/10",
  },
  transport: {
    name: "Transport",
    icon: Car,
    color: "text-sky-400",
    bgColor: "bg-sky-400/10",
  },
  entertainment: {
    name: "Entertainment",
    icon: Tv,
    color: "text-purple-400",
    bgColor: "bg-purple-400/10",
  },
  groceries: {
    name: "Groceries",
    icon: ShoppingCart,
    color: "text-emerald-400",
    bgColor: "bg-emerald-400/10",
  },
  shopping: {
    name: "Shopping",
    icon: ShoppingBag,
    color: "text-pink-400",
    bgColor: "bg-pink-400/10",
  },
  utilities: {
    name: "Utilities",
    icon: Zap,
    color: "text-yellow-400",
    bgColor: "bg-yellow-400/10",
  },
  health: {
    name: "Health",
    icon: Heart,
    color: "text-red-400",
    bgColor: "bg-red-400/10",
  },
  other: {
    name: "Other",
    icon: MoreHorizontal,
    color: "text-muted-foreground",
    bgColor: "bg-muted/50",
  },
};

export const getCategoryConfig = (category: string): CategoryConfig => {
  const key = category.toLowerCase();
  return categories[key] || categories.other;
};

export const categoryList = [
  "Food",
  "Transportation",
  "Entertainment",
  "Groceries",
  "Education",
  "Shopping",
  "Utilities",
  "Health",
  "Other",
];
