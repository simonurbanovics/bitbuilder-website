// Company-wide constants. Page copy lives in `app/i18n.ts` (per language).

export const site = {
  name: "BitBuilder",
  // Canonical domain — used for canonical URLs, hreflang, sitemap, OG tags.
  // No trailing slash.
  url: "https://bitbuilder.tech",
  // Public profile links (safe to expose — no harvestable contact address).
  social: {
    // Hidden until there's public work worth showing — set the URL to display it again.
    github: "",
    linkedin: "https://www.linkedin.com/in/simon-urbanovics-4bb752a3/",
  },
  // Web3Forms public access key. Get one free at https://web3forms.com
  // (enter your email; submissions are forwarded there). This key is public by
  // design and safe to commit — it only allows *sending* to your inbox.
  web3formsAccessKey: "cb7fa8aa-b311-4d5b-86cf-b0a2bdc670bc",
} as const;
