"use client";

import { PropsWithChildren, useEffect } from "react";
import { I18nextProvider } from "react-i18next";
import i18n, { initializeI18n } from "@/lib/i18n";
import {
  DEFAULT_LANGUAGE,
  detectBrowserLanguage,
  isSupportedLanguage,
  LANGUAGE_STORAGE_KEY,
} from "@/lib/i18n/resources";

const i18nInstance = initializeI18n();

export default function I18nProvider({ children }: PropsWithChildren) {
  useEffect(() => {
    const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    const nextLanguage = isSupportedLanguage(storedLanguage)
      ? storedLanguage
      : detectBrowserLanguage(window.navigator.languages);

    void i18nInstance.changeLanguage(nextLanguage);
  }, []);

  useEffect(() => {
    const syncLanguage = (language: string) => {
      const resolvedLanguage = isSupportedLanguage(language)
        ? language
        : DEFAULT_LANGUAGE;

      document.documentElement.lang = resolvedLanguage;
      document.documentElement.dir = "ltr";
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, resolvedLanguage);
    };

    syncLanguage(i18nInstance.resolvedLanguage ?? i18nInstance.language);
    i18nInstance.on("languageChanged", syncLanguage);

    return () => {
      i18nInstance.off("languageChanged", syncLanguage);
    };
  }, []);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
