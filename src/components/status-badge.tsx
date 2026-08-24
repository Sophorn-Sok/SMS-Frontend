const toneClassNames = {
  green: "bg-emerald-50 text-emerald-700",
  amber: "bg-amber-50 text-amber-700",
  rose: "bg-rose-50 text-rose-700",
  slate: "bg-stone-100 text-stone-600",
  sky: "bg-sky-50 text-sky-700",
} as const;

export type StatusTone = keyof typeof toneClassNames;

export function StatusBadge({
  label,
  tone,
}: {
  label: string;
  tone: StatusTone;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${toneClassNames[tone]}`}
    >
      {label}
    </span>
  );
}
