import { Link } from "react-router";

import { dict, getLang, localizedMeta, lp, useLang, useT } from "~/i18n";
import { site } from "~/site";
import type { Route } from "./+types/home";

export function meta({ params, location }: Route.MetaArgs) {
  const lang = getLang(params.lang);
  const t = dict[lang];
  return localizedMeta(
    lang,
    location.pathname,
    `${site.name} — ${t.home.tagline}`,
    t.home.metaDesc,
  );
}

export default function Home() {
  const lang = useLang();
  const t = useT();
  return (
    <div className="mx-auto max-w-5xl px-6">
      {/* Hero */}
      <section className="py-24 sm:py-32">
        <p className="font-mono text-sm font-medium uppercase tracking-widest text-brand-700 dark:text-brand-300">
          {site.name}
        </p>
        <h1 className="mt-4 max-w-3xl font-mono text-4xl font-bold tracking-tight sm:text-6xl">
          {t.home.tagline}
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
          {t.home.description}
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            to={lp(lang, "/contact")}
            className="rounded-md bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-500"
          >
            {t.home.ctaStart}
          </Link>
          <Link
            to={lp(lang, "/portfolio")}
            className="rounded-md px-5 py-3 text-sm font-semibold text-slate-900 ring-1 ring-inset ring-slate-300 transition-colors hover:bg-slate-50 dark:text-white dark:ring-slate-700 dark:hover:bg-slate-900"
          >
            {t.home.ctaWork}
          </Link>
        </div>
      </section>

      {/* Highlights */}
      <section className="grid gap-8 border-t border-slate-200 py-16 sm:grid-cols-3 dark:border-slate-800">
        {t.home.highlights.map((item) => (
          <div key={item.title}>
            <h2 className="text-base font-semibold">{item.title}</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              {item.body}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}
