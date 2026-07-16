import { site } from "~/site";

/**
 * The BitBuilder mark: four rounded "blocks" (bits) in a 2x2 grid, with two at
 * reduced opacity to suggest a block being placed — "building" from bits.
 * Uses `currentColor`, so color it with a text-brand-* class on the parent.
 */
export function LogoGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="1.5" y="1.5" width="9.5" height="9.5" rx="2.5" />
      <rect x="13" y="1.5" width="9.5" height="9.5" rx="2.5" opacity="0.45" />
      <rect x="1.5" y="13" width="9.5" height="9.5" rx="2.5" opacity="0.45" />
      <rect x="13" y="13" width="9.5" height="9.5" rx="2.5" />
    </svg>
  );
}

/** Full logo: block glyph + wordmark set in the mono display face. */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className ?? ""}`}>
      <LogoGlyph className="h-6 w-6 text-brand-500" />
      <span className="font-mono text-lg font-bold tracking-tight text-slate-900 dark:text-white">
        {site.name}
      </span>
    </span>
  );
}
