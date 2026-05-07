"use client";

import Button from "@/components/ui/Button";
import { useI18n } from "./I18nProvider";

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
      <div className="flex items-center rounded-md border border-white/15 bg-white/5 p-1 backdrop-blur-md">
        <Button
          type="button"
          size="sm"
          variant={locale === "en" ? "secondary" : "ghost"}
          className="rounded-sm px-3 py-1 text-[11px]"
          onClick={() => setLocale("en")}
        >
          EN
        </Button>
        <Button
          type="button"
          size="sm"
          variant={locale === "si" ? "secondary" : "ghost"}
          className="rounded-sm px-3 py-1 text-[11px]"
          onClick={() => setLocale("si")}
        >
          සි
        </Button>
      </div>
    </div>
  );
}
