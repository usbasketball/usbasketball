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
  const t = await getTranslations({ locale, namespace: "Metadata.me" });

  return pageMetadata({
    locale,
    pathname: "/me",
    title: t("title"),
    description: t("description"),
    robots: { index: false, follow: false },
  });
}

export default async function MePage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Me" });

  const session = authEnabled() ? await auth0.getSession() : null;
  if (!session) {
    return redirect({ href: "/login", locale });
  }

  const user = session.user;
  const name = user.name ?? user.nickname ?? "";

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-4xl uppercase tracking-wide text-ink sm:text-5xl">
        {t("title")}
      </h1>
      {name ? (
        <p className="mt-4 text-lg text-ink-muted">{t("welcome", { name })}</p>
      ) : null}

      <section className="mt-10">
        <h2 className="text-xl font-bold text-ink">{t("profile.title")}</h2>
        <dl className="mt-4 divide-y divide-line border border-line">
          <div className="grid grid-cols-2 gap-4 px-6 py-4">
            <dt className="font-medium text-ink">{t("profile.name")}</dt>
            <dd className="text-ink-muted">{name || "-"}</dd>
          </div>
          <div className="grid grid-cols-2 gap-4 px-6 py-4">
            <dt className="font-medium text-ink">{t("profile.email")}</dt>
            <dd className="text-ink-muted">{user.email ?? "-"}</dd>
          </div>
        </dl>
      </section>

      <div className="mt-10">
        {/* Auth0 routes must not use next-intl Link (client-side navigation). */}
        <a
          href={`/auth/logout?returnTo=/${locale}`}
          className="border border-line px-4 py-2 text-sm font-semibold uppercase tracking-wide text-ink transition-colors hover:bg-paper"
        >
          {t("logout")}
        </a>
      </div>
    </div>
  );
}
