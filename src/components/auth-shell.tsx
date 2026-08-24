import Link from "next/link";

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 flex flex-col">
      <header className="border-b border-neutral-200 dark:border-neutral-800 px-6 py-4">
        <Link href="/" className="text-sm text-neutral-500 hover:underline">
          Back to home
        </Link>
      </header>
      <main className="flex-1 px-6 py-8">{children}</main>
    </div>
  );
}
