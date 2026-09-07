export function LoadingRow({ colSpan, label = "Loading…" }: { colSpan: number; label?: string }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-6 py-10 text-center text-sm text-stone-400">
        {label}
      </td>
    </tr>
  );
}

export function ErrorRow({
  colSpan,
  message,
  onRetry,
}: {
  colSpan: number;
  message: string;
  onRetry?: () => void;
}) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-6 py-10 text-center text-sm text-rose-600">
        {message}
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="ml-3 rounded-md border border-rose-200 px-2.5 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-50"
          >
            Retry
          </button>
        )}
      </td>
    </tr>
  );
}

export function EmptyRow({ colSpan, label }: { colSpan: number; label: string }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-6 py-10 text-center text-sm text-stone-400">
        {label}
      </td>
    </tr>
  );
}

/** Full-screen centered state, for layout-level guards. */
export function ScreenMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm text-stone-500">
      {children}
    </div>
  );
}
