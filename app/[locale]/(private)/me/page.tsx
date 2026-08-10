import type { Metadata } from "next";
import { getFormatter, getTranslations } from "next-intl/server";
import { auth } from "@/auth";
import { logout } from "@/lib/actions/auth";
import { redirect } from "@/i18n/navigation";
import { localizedAlternates } from "@/lib/seo";
import { prisma } from "@/lib/prisma";
import { PasswordForm } from "@/components/password-form";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata.me" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: localizedAlternates("/me"),
    robots: { index: false, follow: false },
  };
}

export default async function MePage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Me" });
  const format = await getFormatter({ locale });

  const session = await auth();
  if (!session) {
    return redirect({ href: "/login", locale });
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) {
    return redirect({ href: "/login", locale });
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-4xl uppercase tracking-wide text-ink sm:text-5xl">
        {t("title")}
      </h1>
      <p className="mt-4 text-lg text-ink-muted">
        {t("welcome", { name: `${user.firstName} ${user.lastName}` })}
      </p>

      <section className="mt-10">
        <h2 className="text-xl font-bold text-ink">{t("profile.title")}</h2>
        <dl className="mt-4 divide-y divide-line border border-line">
          <div className="grid grid-cols-2 gap-4 px-6 py-4">
            <dt className="font-medium text-ink">
              {t("profile.firstName")}
            </dt>
            <dd className="text-ink-muted">
              {user.firstName}
            </dd>
          </div>
          <div className="grid grid-cols-2 gap-4 px-6 py-4">
            <dt className="font-medium text-ink">
              {t("profile.lastName")}
            </dt>
            <dd className="text-ink-muted">{user.lastName}</dd>
          </div>
          <div className="grid grid-cols-2 gap-4 px-6 py-4">
            <dt className="font-medium text-ink">
              {t("profile.email")}
            </dt>
            <dd className="text-ink-muted">{user.email}</dd>
          </div>
          <div className="grid grid-cols-2 gap-4 px-6 py-4">
            <dt className="font-medium text-ink">
              {t("profile.team")}
            </dt>
            <dd className="text-ink-muted">
              {user.team ?? "-"}
            </dd>
          </div>
          <div className="grid grid-cols-2 gap-4 px-6 py-4">
            <dt className="font-medium text-ink">
              {t("profile.since")}
            </dt>
            <dd className="text-ink-muted">
              {format.dateTime(user.joinedAt, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </dd>
          </div>
        </dl>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold text-ink">{t("password.title")}</h2>
        <PasswordForm />
      </section>

      <div className="mt-10">
        <form action={logout}>
          <button
            type="submit"
            className="border border-line px-4 py-2 text-sm font-semibold uppercase tracking-wide text-ink transition-colors hover:bg-paper"
          >
            {t("logout")}
          </button>
        </form>
      </div>
    </div>
  );
}
