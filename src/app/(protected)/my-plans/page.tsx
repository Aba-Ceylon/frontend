"use client";

import { useI18n } from "@/components/i18n/I18nProvider";

export default function MyPlansPage() {
  const { t } = useI18n();

  return (
    <div>
      <h1>{t("account.myPlans")}</h1>
    </div>
  );
}
