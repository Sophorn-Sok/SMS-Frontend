import type { ComponentType } from "react";
import type { IconProps } from "@/components/icons";

export function IconStatCard({
  icon: Icon,
  iconBgClassName = "bg-rose-50 text-rose-700",
  label,
  value,
  trend,
  trendTone = "positive",
}: {
  icon: ComponentType<IconProps>;
  iconBgClassName?: string;
  label: string;
  value: string;
  trend?: string;
  trendTone?: "positive" | "warning";
}) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <span
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconBgClassName}`}
        >
          <Icon className="h-5 w-5" />
        </span>
        {trend && (
          <span
            className={`text-sm font-semibold ${
              trendTone === "warning" ? "text-rose-600" : "text-emerald-600"
            }`}
          >
            {trend}
          </span>
        )}
      </div>
      <p className="mt-4 text-sm text-stone-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-stone-900">{value}</p>
    </div>
  );
}
