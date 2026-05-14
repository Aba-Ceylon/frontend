"use client";

import { useI18n } from "@/components/i18n/I18nProvider";

interface ValidationErrorsProps {
  issues: string[];
  title?: string;
}

export default function ValidationErrors({ issues, title = "Required Detail" }: ValidationErrorsProps) {
  const { t } = useI18n();

  if (!issues.length) return null;
  return (
    <div className="rounded-3xl border border-red-200 bg-red-50 p-5">
      <p className="font-cinzel text-lg text-red-900 mb-3">
        {title === "Required Detail" ? t("common.requiredDetail") : title}
      </p>
      <ul className="space-y-2 text-sm text-red-700">
        {issues.map((issue) => (
          <li key={issue}>{issue}</li>
        ))}
      </ul>
    </div>
  );
}
