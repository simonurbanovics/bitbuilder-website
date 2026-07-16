import { Link } from "react-router";

import { dict, getLang, localizedMeta, lp, useLang, useT } from "~/i18n";
import { site } from "~/site";
import type { Route } from "./+types/about";

export function meta({ params, location }: Route.MetaArgs) {
  const lang = getLang(params.lang);
  const t = dict[lang];
  return localizedMeta(
    lang,
    location.pathname,
    `${t.about.title} — ${site.name}`,
    t.about.metaDesc,
  );
}

export default function About() {
  const lang = useLang();
  const t = useT();
  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="font-mono text-4xl font-bold tracking-tight sm:text-5xl">
        {t.about.title}
      </h1>

      <div className="mt-8 space-y-6 text-lg text-slate-600 dark:text-slate-300">
        {t.about.paragraphs.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>

      <div className="mt-12 rounded-xl border border-slate-200 p-8 dark:border-slate-800">
        <h2 className="text-xl font-semibold">{t.about.ctaTitle}</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          {t.about.ctaBody}
        </p>
        <Link
          to={lp(lang, "/contact")}
          className="mt-6 inline-block rounded-md bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-500"
        >
          {t.about.ctaButton}
        </Link>
      </div>
    </div>
  );
}
