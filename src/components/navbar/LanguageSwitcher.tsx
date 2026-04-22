"use client";

import { useTransition } from "react";
import { Languages } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  DEFAULT_LANGUAGE,
  isSupportedLanguage,
  SUPPORTED_LANGUAGES,
  type AppLanguage,
} from "@/lib/i18n/resources";

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const [isPending, startTransition] = useTransition();

  const resolvedLanguage = isSupportedLanguage(i18n.resolvedLanguage)
    ? i18n.resolvedLanguage
    : DEFAULT_LANGUAGE;

  return (
    <div className="fixed bottom-6 left-4 z-[60] sm:bottom-8 sm:left-6">
      <label className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/60 px-3 py-2 text-white shadow-lg backdrop-blur-md transition-colors hover:border-amber-400/40 hover:bg-black/70 cursor-pointer">
        <Languages className="h-4 w-4 shrink-0 text-amber-300" />
        <span className="hidden sm:inline font-cinzel text-[11px] uppercase tracking-[0.2em] text-white/70">
          {t("navbar.languageLabel")}
        </span>
        <select
          value={resolvedLanguage}
          aria-label={t("navbar.languageLabel")}
          disabled={isPending}
          onChange={(event) => {
            const nextLanguage = event.target.value as AppLanguage;
            startTransition(() => {
              void i18n.changeLanguage(nextLanguage);
            });
          }}
          className="bg-transparent font-cinzel text-sm text-white outline-none cursor-pointer"
        >
          {SUPPORTED_LANGUAGES.map((language) => (
            <option
              key={language.code}
              value={language.code}
              className="bg-slate-900 text-white"
            >
              {language.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
