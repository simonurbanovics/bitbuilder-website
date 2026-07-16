import { Link } from "react-router";

import { dict, getLang, localizedMeta, lp, useLang, useT } from "~/i18n";
import { site } from "~/site";
import type { Route } from "./+types/services";

export function meta({ params, location }: Route.MetaArgs) {
  const lang = getLang(params.lang);
  const t = dict[lang];
  return localizedMeta(
    lang,
    location.pathname,
    `${t.services.title} — ${site.name}`,
    t.services.metaDesc,
  );
}

export default function Services() {
  const lang = useLang();
  const t = useT();
  return (
    <div className="mx-auto max-w-5xl px-6 py-20">
      <header className="max-w-2xl">
        <h1 className="font-mono text-4xl font-bold tracking-tight sm:text-5xl">
          {t.services.title}
        </h1>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
          {t.services.intro}
        </p>
      </header>

      <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {t.services.items.map((service) => (
          <div
            key={service.title}
            className="rounded-xl border border-slate-200 p-6 dark:border-slate-800"
          >
            <h2 className="text-lg font-semibold">{service.title}</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              {service.body}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-16 rounded-xl bg-slate-50 p-8 dark:bg-slate-900">
        <h2 className="text-xl font-semibold">{t.services.ctaTitle}</h2>
        <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
          {t.services.ctaBody}
        </p>
        <Link
          to={lp(lang, "/contact")}
          className="mt-6 inline-block rounded-md bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-500"
        >
          {t.services.ctaButton}
        </Link>
      </div>
    </div>
  );
}
