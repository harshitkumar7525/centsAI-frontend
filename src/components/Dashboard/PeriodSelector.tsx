import { cn } from "@/lib/utils";

export type Period = "7d" | "15d" | "30d" | "all";

interface PeriodSelectorProps {
  value: Period;
  onChange: (period: Period) => void;
}

const periods: { value: Period; label: string }[] = [
  { value: "7d", label: "7 Days" },
  { value: "15d", label: "15 Days" },
  { value: "30d", label: "1 Month" },
  { value: "all", label: "All Time" },
];

export function PeriodSelector({ value, onChange }: PeriodSelectorProps) {
  return (
    <div className="flex gap-1 p-1 bg-secondary/50 rounded-lg">
      {periods.map((period) => (
        <button
          key={period.value}
          onClick={() => onChange(period.value)}
          className={cn(
            "px-4 py-2 text-sm font-medium rounded-md transition-all duration-200",
            value === period.value
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-secondary"
          )}
        >
          {period.label}
        </button>
      ))}
    </div>
  );
}
