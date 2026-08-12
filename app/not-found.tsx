import { createTranslator } from "next-intl";
import { NotFoundContent } from "@/components/not-found-content";
import nlMessages from "@/messages/nl.json";
import { routing } from "@/i18n/routing";

const t = createTranslator({
  locale: routing.defaultLocale,
  messages: nlMessages,
  namespace: "NotFound",
});

export default function NotFound() {
  return (
    <NotFoundContent
      locale={routing.defaultLocale}
      title={t("title")}
      description={t("description")}
      home={t("home")}
    />
  );
}
