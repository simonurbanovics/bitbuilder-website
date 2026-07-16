import type { Config } from "@react-router/dev/config";

const PAGES = ["", "/services", "/portfolio", "/about", "/contact"];

export default {
  // Fully static site: no server runtime.
  ssr: false,
  // Pre-render the root redirect plus every page in both languages to HTML at
  // build time (the `:lang` param routes aren't static, so list them explicitly).
  prerender: [
    "/",
    ...PAGES.map((p) => `/en${p}`),
    ...PAGES.map((p) => `/hu${p}`),
  ],
} satisfies Config;
