import Link from "next/link";
import type { Feature } from "@/lib/features";

export function FeatureIndex({
  roleLabel,
  features,
}: {
  roleLabel: string;
  features: Feature[];
}) {
  return (
    <div>
      <h1 className="text-2xl font-semibold">{roleLabel} Dashboard</h1>
      <p className="mt-2 text-neutral-500">Select a feature to continue.</p>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {features.map((feature) => (
          <Link
            key={feature.path}
            href={feature.path}
            className="group rounded-lg border border-neutral-200 dark:border-neutral-800 p-5 transition-colors hover:border-neutral-400 dark:hover:border-neutral-600"
          >
            <p className="text-sm text-neutral-400">{feature.id}</p>
            <h2 className="font-medium group-hover:underline">
              {feature.name}
            </h2>
            <p className="mt-1 text-sm text-neutral-500">{feature.covers}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
