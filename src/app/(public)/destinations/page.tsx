"use client";

import { useI18n } from "@/components/i18n/I18nProvider";

export default function DestinationsPage() {
  const { t } = useI18n();

  return (
    <div>
      <h1>{t("placeholders.destinations")}</h1>
    </div>
  );
}
