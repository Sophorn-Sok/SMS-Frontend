export function MetricStatCard({
  label,
  value,
  trend,
  trendClassName = "text-emerald-600",
  progress,
  progressClassName = "bg-rose-700",
}: {
  label: string;
  value: string;
  trend: string;
  trendClassName?: string;
  progress: number;
  progressClassName?: string;
}) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5">
      <p className="text-sm text-stone-500">{label}</p>
      <div className="mt-2 flex items-baseline gap-3">
        <p className="text-3xl font-bold text-stone-900">{value}</p>
        <span className={`text-sm font-semibold ${trendClassName}`}>
          {trend}
        </span>
      </div>
      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-stone-100">
        <div
          className={`h-full rounded-full ${progressClassName}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
