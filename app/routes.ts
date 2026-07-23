import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  // "/" detects/redirects to a language-prefixed home (/en by default).
  index("routes/root-redirect.tsx"),

  // All content lives under a language prefix: /en/... and /hu/...
  route(":lang", "routes/layout.tsx", [
    index("routes/home.tsx"),
    route("services", "routes/services.tsx"),
    route("portfolio", "routes/portfolio.tsx"),
    route("about", "routes/about.tsx"),
    route("contact", "routes/contact.tsx"),
    route("calculator", "routes/calculator.tsx"),
  ]),

  // Standalone full-screen in-browser AI demo — outside the marketing layout
  // (no header/nav/footer). Hidden: not prerendered, not linked, noindex.
  route(":lang/assistant", "routes/assistant.tsx"),
] satisfies RouteConfig;
