import Link from "next/link";
import type { Feature } from "@/lib/features";

export function RoleShell({
  roleLabel,
  features,
  children,
}: {
  roleLabel: string;
  features: Feature[];
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 flex flex-col">
      <header className="border-b border-neutral-200 dark:border-neutral-800 px-6 py-4 flex items-center justify-between">
        <span className="font-medium">{roleLabel} Portal</span>
        <Link href="/" className="text-sm text-neutral-500 hover:underline">
          Switch portal
        </Link>
      </header>
      <div className="flex-1 flex">
        <nav className="w-64 shrink-0 border-r border-neutral-200 dark:border-neutral-800 px-4 py-6 hidden sm:block">
          <ul className="space-y-1">
            {features.map((feature) => (
              <li key={feature.path}>
                <Link
                  href={feature.path}
                  className="block rounded px-3 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-900"
                >
                  <span className="text-neutral-400 mr-2">{feature.id}</span>
                  {feature.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <main className="flex-1 px-6 py-8">{children}</main>
      </div>
    </div>
  );
}
