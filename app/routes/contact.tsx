import { useState } from "react";

import { dict, getLang, localizedMeta, useT } from "~/i18n";
import { site } from "~/site";
import type { Route } from "./+types/contact";

export function meta({ params, location }: Route.MetaArgs) {
  const lang = getLang(params.lang);
  const t = dict[lang];
  return localizedMeta(
    lang,
    location.pathname,
    `${t.contact.title} — ${site.name}`,
    t.contact.metaDesc,
  );
}

type Status = "idle" | "submitting" | "success" | "error";

export default function Contact() {
  const t = useT();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string>("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setError("");

    const formData = new FormData(event.currentTarget);
    // Honeypot: real users leave this empty; bots tend to fill every field.
    if (formData.get("botcheck")) {
      setStatus("success");
      return;
    }

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        setStatus("success");
      } else {
        setStatus("error");
        setError(data.message ?? t.contact.errorGeneric);
      }
    } catch {
      setStatus("error");
      setError(t.contact.networkError);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-20">
      <h1 className="font-mono text-4xl font-bold tracking-tight sm:text-5xl">
        {t.contact.title}
      </h1>
      <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
        {t.contact.intro}
      </p>

      {status === "success" ? (
        <div className="mt-10 rounded-xl border border-green-300 bg-green-50 p-6 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200">
          <h2 className="font-semibold">{t.contact.successTitle}</h2>
          <p className="mt-1 text-sm">{t.contact.successBody}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-10 space-y-6">
          <input
            type="hidden"
            name="access_key"
            value={site.web3formsAccessKey}
          />
          <input type="hidden" name="subject" value={t.contact.subject} />
          {/* Honeypot field — hidden from humans, catches bots. */}
          <input
            type="checkbox"
            name="botcheck"
            className="hidden"
            tabIndex={-1}
            autoComplete="off"
          />

          <Field label={t.contact.name} htmlFor="name">
            <input
              id="name"
              name="name"
              type="text"
              required
              autoComplete="name"
              className={inputClass}
            />
          </Field>

          <Field label={t.contact.email} htmlFor="email">
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className={inputClass}
            />
          </Field>

          <Field label={t.contact.message} htmlFor="message">
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              className={inputClass}
            />
          </Field>

          {status === "error" ? (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          ) : null}

          <button
            type="submit"
            disabled={status === "submitting"}
            className="rounded-md bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === "submitting" ? t.contact.sending : t.contact.send}
          </button>
        </form>
      )}

      <p className="mt-10 text-sm text-slate-500 dark:text-slate-400">
        {t.contact.otherChannelPre}
        <a
          href={site.social.linkedin}
          target="_blank"
          rel="noreferrer"
          className="font-medium text-brand-600 hover:underline dark:text-brand-400"
        >
          LinkedIn
        </a>
        {t.contact.otherChannelPost}
      </p>
    </div>
  );
}

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
