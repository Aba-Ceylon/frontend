"use client";

import { use } from "react";
import { useI18n } from "@/components/i18n/I18nProvider";

export default function DestinationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { t } = useI18n();

  return (
    <div>
      <h1>{t("placeholders.destination", { slug })}</h1>
    </div>
  );
}
