export function PromoBanner({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-stone-800 to-rose-950 p-6 text-white">
      {eyebrow && (
        <p className="text-[10px] font-bold uppercase tracking-wide text-rose-300">
          {eyebrow}
        </p>
      )}
      <p className="mt-1 text-lg font-bold">{title}</p>
      <p className="mt-1 text-sm text-stone-200">{description}</p>
    </div>
  );
}
