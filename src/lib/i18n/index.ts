import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import {
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGES,
  translationResources,
} from "./resources";

export function initializeI18n() {
  if (i18n.isInitialized) {
    return i18n;
  }

  void i18n.use(initReactI18next).init({
    resources: translationResources,
    lng: DEFAULT_LANGUAGE,
    fallbackLng: DEFAULT_LANGUAGE,
    supportedLngs: SUPPORTED_LANGUAGES.map((language) => language.code),
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
    returnNull: false,
  });

  return i18n;
}

export default i18n;
