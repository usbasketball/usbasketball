import { getLocale, getTranslations } from "next-intl/server";
import { NotFoundContent } from "@/components/not-found-content";

export default async function NotFoundPage() {
  const [locale, t] = await Promise.all([
    getLocale(),
    getTranslations("NotFound"),
  ]);

  return (
    <NotFoundContent
      locale={locale}
      title={t("title")}
      description={t("description")}
      home={t("home")}
    />
  );
}
