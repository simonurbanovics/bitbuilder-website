# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start the dev server with HMR at `http://localhost:5173`
- `npm run build` — production build to `build/` (`build/client/` static assets, `build/server/` SSR code)
- `npm run start` — serve the production build with `react-router-serve`
- `npm run typecheck` — regenerate route types (`react-router typegen`) then run `tsc`

There is no test runner or linter configured yet.

## Architecture

This is a **statically pre-rendered marketing site** built with **React Router (v8.0.0) in Framework Mode** — the full-stack framework (successor to Remix), not the React Router library used purely for client routing. Do not apply Data-mode or Declarative-mode (`createBrowserRouter`, `<BrowserRouter>`) patterns here. See `.agents/skills/react-router/` for mode-specific references before making routing changes.

**Static generation**: `react-router.config.ts` sets `ssr: false` and an **explicit `prerender` list** (the `:lang` param routes aren't static, so each language path is listed). `npm run build` emits fully static HTML into `build/client/` (e.g. `build/client/hu/services/index.html`). There is **no server runtime** — do not add `loader`/`action` server code; use client-side data/`fetch` inside components instead (see the Web3Forms `fetch` in `app/routes/contact.tsx`). The deployable artifact is `build/client/`.

**Bilingual (i18n)**: the site is English + Hungarian, served under language-prefixed URLs — `/en/...` and `/hu/...`. `/` is a prerendered redirect (`routes/root-redirect.tsx`) to `/en/`.
- `app/routes.ts` nests all pages under a `route(":lang", "routes/layout.tsx", [...])` tree, plus the top-level `/` redirect.
- `app/i18n.ts` is the single source of copy: `dict.en` / `dict.hu` hold **all** page text (nav, headings, body, projects, form labels, meta). It also exports `getLang`, `lp(lang, path)` (build lang-prefixed links), `useLang`/`useT` (component hooks), and `localizedMeta(lang, pathname, title, desc)` which emits the `<title>`, description, canonical, and hreflang alternates. `dict.hu` is a review draft.
- Components derive language from the `:lang` route param (`useLang`) and pull strings from `useT()`; **all internal `<Link to>` must go through `lp(lang, "/path")`** so navigation stays within the language.
- `app/root.tsx` sets `<html lang>` from the URL. When adding a page: register it under the `:lang` tree, add its strings to both `dict` languages, add it to the `prerender` list in `react-router.config.ts`, and add both URLs to `public/sitemap.xml`.

Key files:
- `app/routes/layout.tsx` — shared layout route (header/nav + **EN/HU switcher** + footer) wrapping all pages via `<Outlet />`.
- `app/site.ts` — non-localized constants only: `name`, canonical `url`, `social` links, **Web3Forms access key**. Page copy lives in `app/i18n.ts`.
- `app/components/logo.tsx` — `<Logo>` / `<LogoGlyph>` (cyan block mark). Brand tokens (`brand-*` cyan scale, `--font-mono`) are in `app/app.css`; neutrals use `slate-*`.
- `vite.config.ts` — Vite with `@react-router/dev` + `@tailwindcss/vite`. Tailwind CSS v4 (via the Vite plugin + `app/app.css`, no `tailwind.config`).

**Deployment**: `.github/workflows/deploy.yml` builds and publishes `build/client/` to GitHub Pages on push to `main` (copies `__spa-fallback.html` → `404.html` for the SPA fallback on unknown deep links). Custom domain is `bitbuilder.tech` (`public/CNAME`); served at the domain root, so no Vite `base`/`basename`. `public/{robots.txt,sitemap.xml}` are static SEO assets.

Route module conventions:
- Route modules live under `app/routes/` and export functions like `loader`/`clientLoader` (data loading), `action`/`clientAction` (mutations), `meta`, `links`, `ErrorBoundary`, and a default component.
- Per-route types are generated: import `import type { Route } from "./+types/<name>"` and type exports as `Route.MetaArgs`, `Route.LoaderArgs`, `Route.ComponentProps`, etc. Run `npm run typecheck` (or `dev`) to regenerate `.react-router/types/` after adding or changing routes.
- The `~/*` import alias maps to `app/*` (see `tsconfig.json`).
