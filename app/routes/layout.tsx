import { Link, NavLink, Outlet, useLocation } from "react-router";

import { Logo } from "~/components/logo";
import { type Lang, lp, useLang, useT } from "~/i18n";
import { site } from "~/site";

export default function SiteLayout() {
  const lang = useLang();
  const t = useT();
  const navItems = [
    { to: lp(lang, "/services"), label: t.nav.services },
    { to: lp(lang, "/portfolio"), label: t.nav.portfolio },
    { to: lp(lang, "/about"), label: t.nav.about },
    { to: lp(lang, "/contact"), label: t.nav.contact },
  ];

  return (
    <div className="flex min-h-dvh flex-col bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur-sm dark:border-slate-800/80 dark:bg-slate-950/80">
        <nav className="mx-auto flex max-w-5xl items-center justify-between gap-6 px-6 py-4">
          <Link to={lp(lang)} aria-label={t.a11y.home}>
            <Logo />
          </Link>
          <div className="flex items-center gap-4">
            <ul className="hidden items-center gap-1 text-sm sm:flex">
              {navItems.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      [
                        "rounded-md px-3 py-2 transition-colors",
                        isActive
                          ? "font-medium text-slate-900 dark:text-white"
                          : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white",
                      ].join(" ")
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
            <LanguageSwitcher current={lang} />
          </div>
        </nav>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

function LanguageSwitcher({ current }: { current: Lang }) {
  const { pathname } = useLocation();
  const suffix = pathname.replace(/^\/(en|hu)/, "");
  const t = useT();

  return (
    <div
      className="flex items-center gap-1 font-mono text-xs"
      role="group"
      aria-label={t.a11y.language}
    >
      {(["en", "hu"] as const).map((l, i) => (
        <span key={l} className="flex items-center">
          {i > 0 && <span className="mr-1 text-slate-300 dark:text-slate-700">/</span>}
          <Link
            to={`/${l}${suffix}`}
            aria-current={l === current ? "true" : undefined}
            className={
              l === current
                ? "font-bold text-slate-900 dark:text-white"
                : "text-slate-400 hover:text-slate-900 dark:text-slate-500 dark:hover:text-white"
            }
          >
            {l.toUpperCase()}
          </Link>
        </span>
      ))}
    </div>
  );
}

function Footer() {
  const t = useT();
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between dark:text-slate-400">
        <p>
          &copy; {site.name}. {t.footer.rights}
        </p>
        <div className="flex gap-4">
          {site.social.github ? (
            <a
              href={site.social.github}
              className="hover:text-slate-900 dark:hover:text-white"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
          ) : null}
          <a
            href={site.social.linkedin}
            className="hover:text-slate-900 dark:hover:text-white"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}
