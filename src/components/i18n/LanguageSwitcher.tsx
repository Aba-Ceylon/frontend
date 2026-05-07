"use client";

import { LANGUAGE_OPTIONS, useI18n, type Locale } from "./I18nProvider";

export default function LanguageSwitcher({
  mobile = false,
}: {
  mobile?: boolean;
}) {
  const { locale, setLocale, t } = useI18n();

  return (
    <div
      className={`flex items-center gap-2 ${
        mobile ? "justify-start" : "justify-center"
      }`}
    >
      <span className="font-cinzel text-xs uppercase tracking-[0.18em] text-white/70">
        {t("language.label")}
      </span>
      <select
        aria-label={t("language.label")}
        value={locale}
        onChange={(event) => setLocale(event.target.value as Locale)}
        className="rounded-md border border-white/15 bg-black/35 px-3 py-2 font-cinzel text-xs uppercase tracking-[0.12em] text-white outline-none backdrop-blur-md transition hover:border-amber-300/50 focus:border-amber-300"
      >
        {LANGUAGE_OPTIONS.map((option) => (
          <option
            key={option.locale}
            value={option.locale}
            className="bg-[#0F172A] text-white"
          >
            {option.shortLabel} · {option.nativeLabel}
          </option>
        ))}
      </select>
    </div>
  );
}
