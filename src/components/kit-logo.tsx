export function KitLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      <defs>
        <clipPath id="kit-logo-clip">
          <circle cx="100" cy="100" r="100" />
        </clipPath>
      </defs>
      <g clipPath="url(#kit-logo-clip)">
        <rect width="200" height="200" fill="#9f1239" />
        <path
          d="M14 96 L148 8"
          stroke="#fff"
          strokeWidth="26"
          strokeLinecap="square"
        />
        <path
          d="M14 104 L148 192"
          stroke="#fff"
          strokeWidth="26"
          strokeLinecap="square"
        />
        <g>
          <rect x="-10" y="128" width="12" height="80" fill="#c2410c" />
          <rect x="7" y="128" width="12" height="80" fill="#f97316" />
          <rect x="24" y="128" width="12" height="80" fill="#c2410c" />
          <rect x="41" y="128" width="12" height="80" fill="#f97316" />
        </g>
      </g>
    </svg>
  );
}
