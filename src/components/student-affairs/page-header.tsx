import Link from "next/link";

interface Crumb {
  label: string;
  href?: string;
}

export function PageHeader({
  breadcrumb,
  separator = "/",
  title,
  description,
  actions,
}: {
  breadcrumb?: Crumb[];
  separator?: string;
  title: string;
  description: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div>
        {breadcrumb && breadcrumb.length > 0 && (
          <p className="mb-2 text-sm text-stone-500">
            {breadcrumb.map((crumb, index) => (
              <span key={crumb.label}>
                {index > 0 && (
                  <span className="mx-2 text-stone-300">{separator}</span>
                )}
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-rose-700">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="font-medium text-rose-700">
                    {crumb.label}
                  </span>
                )}
              </span>
            ))}
          </p>
        )}
        <h1 className="text-3xl font-extrabold tracking-tight text-stone-900">
          {title}
        </h1>
        <p className="mt-1.5 text-stone-500">{description}</p>
      </div>
      {actions && (
        <div className="flex shrink-0 flex-wrap items-center gap-3">
          {actions}
        </div>
      )}
    </div>
  );
}
