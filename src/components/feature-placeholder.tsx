import type { Feature } from "@/lib/features";

export function FeaturePlaceholder({ feature }: { feature: Feature }) {
  const covers = feature.covers.split(/,\s*/);

  return (
    <div>
      <p className="text-sm text-neutral-400">{feature.id}</p>
      <h1 className="text-2xl font-semibold">{feature.name}</h1>
      <ul className="mt-4 list-disc list-inside text-neutral-500 space-y-1">
        {covers.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <p className="mt-6 text-sm text-neutral-400">
        UI pending — replace this page&apos;s content with the {feature.name}{" "}
        design.
      </p>
    </div>
  );
}
