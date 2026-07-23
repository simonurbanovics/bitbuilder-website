import { useState } from "react";
import { useSearchParams } from "react-router";

import { dict, formatMoney, getLang, useLang, useT } from "~/i18n";
import { site } from "~/site";
import type { Route } from "./+types/calculator";

export function meta({ params }: Route.MetaArgs) {
  const t = dict[getLang(params.lang)];
  // Deliberately minimal: this page is hidden. No canonical/hreflang (those
  // would advertise it to crawlers) — just a title, description, and noindex.
  return [
    { title: `${t.calculator.title} — ${site.name}` },
    { name: "description", content: t.calculator.metaDesc },
    { name: "robots", content: "noindex" },
  ];
}

// --- Pricing model ---------------------------------------------------------
// Commitment tiers as (reserved workdays, multiplier on base), interpolated
// linearly between anchors and clamped flat outside the ends. `base` is the
// deepest-discount (annual) rate. The underlying (unrounded) total is monotonic
// in days; rounding the rate to a whole hourly unit (below) can introduce a
// sub-2% total dip at a few non-preset day counts on small bases — negligible,
// and absent on large bases like HUF.
const ANCHORS: readonly [days: number, mult: number][] = [
  [1, 1.75],
  [22, 1.45],
  [65, 1.25],
  [110, 1.12],
  [220, 1.0],
];

function multiplier(days: number): number {
  const first = ANCHORS[0];
  const last = ANCHORS[ANCHORS.length - 1];
  if (days <= first[0]) return first[1];
  if (days >= last[0]) return last[1];
  for (let i = 1; i < ANCHORS.length; i++) {
    const [d1, m1] = ANCHORS[i];
    if (days <= d1) {
      const [d0, m0] = ANCHORS[i - 1];
      const t = (days - d0) / (d1 - d0);
      return m0 + t * (m1 - m0);
    }
  }
  return last[1];
}

function priceFor(days: number, base: number) {
  // Round the daily rate to a multiple of 8 so the implied hourly rate
  // (rate ÷ 8) is always a whole number.
  const rate = Math.round((base * multiplier(days)) / 8) * 8;
  return { rate, total: rate * days };
}

type TierKey = keyof ReturnType<typeof useT>["calculator"]["tiers"];

function tierKey(days: number): TierKey {
  if (days >= 220) return "annual";
  if (days >= 110) return "halfYear";
  if (days >= 65) return "quarter";
  if (days >= 22) return "month";
  return "daily";
}

export default function Calculator() {
  const lang = useLang();
  const t = useT();
  const c = t.calculator;
  const [searchParams] = useSearchParams();

  // All config comes from the query string, so one link encodes a full quote.
  const base = Math.max(1, Number(searchParams.get("base")) || 400);
  const currency = (searchParams.get("currency") || "EUR").toUpperCase();

  const [daysInput, setDaysInput] = useState(searchParams.get("days") ?? "220");
  const hasDays = Number(daysInput) >= 1;
  const days = Math.max(1, Math.floor(Number(daysInput) || 1));

  const { rate, total } = priceFor(days, base);
  const money = (n: number) => formatMoney(lang, currency, n);

  return (
    <div className="mx-auto max-w-2xl px-6 py-20">
      <h1 className="font-mono text-4xl font-bold tracking-tight sm:text-5xl">
        {c.title}
      </h1>
      <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">{c.intro}</p>

      <div className="mt-10">
        <Field label={c.daysLabel} htmlFor="days">
          <input
            id="days"
            name="days"
            type="number"
            min={1}
            step={1}
            inputMode="numeric"
            value={daysInput}
            onChange={(e) => setDaysInput(e.target.value)}
            className={inputClass}
          />
        </Field>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          {c.daysHint}
        </p>

        <div className="mt-4">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {c.presetLabel}
          </span>
          <div className="mt-2 flex flex-wrap gap-2">
            {c.presets.map((p) => {
              const active = Number(daysInput) === p.days;
              return (
                <button
                  key={p.days}
                  type="button"
                  onClick={() => setDaysInput(String(p.days))}
                  className={
                    "rounded-full border px-3 py-1 text-sm transition-colors " +
                    (active
                      ? "border-brand-600 bg-brand-600 text-white"
                      : "border-slate-300 text-slate-700 hover:border-brand-500 dark:border-slate-700 dark:text-slate-300")
                  }
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Result */}
      <div className="mt-10 rounded-2xl border border-slate-200 p-8 dark:border-slate-800">
        <div className="flex items-baseline justify-between gap-4">
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {c.rateLabel}
          </span>
          <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
            {c.commitmentLabel}: {c.tiers[tierKey(days)]}
          </span>
        </div>
        <div className="mt-1 font-mono text-5xl font-bold tracking-tight text-brand-600 dark:text-brand-400">
          {hasDays ? (
            <>
              {money(rate)}
              <span className="ml-2 text-lg font-medium text-slate-400">
                {c.perDay}
              </span>
            </>
          ) : (
            <span className="text-slate-300 dark:text-slate-600">—</span>
          )}
        </div>

        <div className="mt-6 flex items-baseline justify-between border-t border-slate-200 pt-6 dark:border-slate-800">
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {c.totalLabel}
          </span>
          <span className="font-mono text-2xl font-semibold text-slate-900 dark:text-slate-100">
            {hasDays ? money(total) : "—"}
          </span>
        </div>
      </div>
    </div>
  );
}

// Mirrors the input styling used on the contact form.
const inputClass =
  "mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-slate-700 dark:bg-slate-900";

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="block text-sm font-medium text-slate-700 dark:text-slate-300"
      >
        {label}
      </label>
      {children}
    </div>
  );
}
