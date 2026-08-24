import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { auth0, authEnabled } from "@/lib/auth";
import { pageMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata.tasks" });

  return pageMetadata({
    locale,
    pathname: "/tasks",
    title: t("title"),
    description: t("description"),
    robots: { index: false, follow: false },
  });
}

export default async function TasksPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Tasks" });

  const session = authEnabled() ? await auth0.getSession() : null;
  if (!session) {
    return redirect({ href: "/login", locale });
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-4xl uppercase tracking-wide text-ink sm:text-5xl">
        {t("title")}
      </h1>
      <p className="mt-4 leading-relaxed text-ink-muted">{t("comingSoon")}</p>
    </div>
  );
}