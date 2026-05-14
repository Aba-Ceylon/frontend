"use client";

import { useI18n } from "./I18nProvider";

interface TranslatedTextProps {
  id: string;
  values?: Record<string, string | number>;
}

export default function TranslatedText({ id, values }: TranslatedTextProps) {
  const { t } = useI18n();

  return <>{t(id, values)}</>;
}
