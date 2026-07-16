import { Link } from "react-router";

import { site } from "~/site";

export function meta() {
  return [
    { title: site.name },
    // Don't index the bare redirect page; the localized pages are canonical.
    { name: "robots", content: "noindex" },
    // Instant redirect to the default language, no JS required.
    // Trailing slash matches the prerendered directory URL (no extra 301 hop).
    { httpEquiv: "refresh", content: "0; url=/en/" },
  ];
}

// Shown only for the brief moment before the redirect (and to no-JS clients).
export default function RootRedirect() {
  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="text-slate-500 dark:text-slate-400">
        Redirecting to {site.name}…
      </p>
      <p className="text-sm">
        <Link to="/en/" className="font-medium text-brand-700 dark:text-brand-300">
          English
        </Link>
        <span className="mx-2 text-slate-400">·</span>
        <Link to="/hu/" className="font-medium text-brand-700 dark:text-brand-300">
          Magyar
        </Link>
      </p>
    </div>
  );
}
