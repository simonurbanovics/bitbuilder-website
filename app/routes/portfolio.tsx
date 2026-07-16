import { dict, getLang, localizedMeta, useT } from "~/i18n";
import { site } from "~/site";
import type { Route } from "./+types/portfolio";

export function meta({ params, location }: Route.MetaArgs) {
  const lang = getLang(params.lang);
  const t = dict[lang];
  return localizedMeta(
    lang,
    location.pathname,
    `${t.portfolio.title} — ${site.name}`,
    t.portfolio.metaDesc,
  );
}

export default function Portfolio() {
  const t = useT();
  return (
    <div className="mx-auto max-w-5xl px-6 py-20">
      <header className="max-w-2xl">
        <h1 className="font-mono text-4xl font-bold tracking-tight sm:text-5xl">
          {t.portfolio.title}
        </h1>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
          {t.portfolio.intro}
        </p>
      </header>

      <div className="mt-16 grid gap-8 sm:grid-cols-2">
        {t.portfolio.projects.map((project) => (
          <article
            key={project.title}
            className="flex flex-col rounded-xl border border-slate-200 p-6 dark:border-slate-800"
          >
            <p className="font-mono text-xs font-medium uppercase tracking-widest text-brand-600 dark:text-brand-400">
              {project.tag}
            </p>
            <h2 className="mt-2 text-lg font-semibold">{project.title}</h2>
            <p className="mt-2 flex-1 text-sm text-slate-600 dark:text-slate-300">
              {project.body}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
