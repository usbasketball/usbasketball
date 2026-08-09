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
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
        {t("title")}
      </h1>
      <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
        {t("welcome", { name: `${user.firstName} ${user.lastName}` })}
      </p>

      <section className="mt-10">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
          {t("profile.title")}
        </h2>
        <dl className="mt-4 divide-y divide-zinc-200 rounded-lg border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
          <div className="grid grid-cols-2 gap-4 px-6 py-4">
            <dt className="font-medium text-zinc-900 dark:text-zinc-50">
              {t("profile.firstName")}
            </dt>
            <dd className="text-zinc-600 dark:text-zinc-400">
              {user.firstName}
            </dd>
          </div>
          <div className="grid grid-cols-2 gap-4 px-6 py-4">
            <dt className="font-medium text-zinc-900 dark:text-zinc-50">
              {t("profile.lastName")}
            </dt>
            <dd className="text-zinc-600 dark:text-zinc-400">{user.lastName}</dd>
          </div>
          <div className="grid grid-cols-2 gap-4 px-6 py-4">
            <dt className="font-medium text-zinc-900 dark:text-zinc-50">
              {t("profile.email")}
            </dt>
            <dd className="text-zinc-600 dark:text-zinc-400">{user.email}</dd>
          </div>
          <div className="grid grid-cols-2 gap-4 px-6 py-4">
            <dt className="font-medium text-zinc-900 dark:text-zinc-50">
              {t("profile.team")}
            </dt>
            <dd className="text-zinc-600 dark:text-zinc-400">
              {user.team ?? "-"}
            </dd>
          </div>
          <div className="grid grid-cols-2 gap-4 px-6 py-4">
            <dt className="font-medium text-zinc-900 dark:text-zinc-50">
              {t("profile.since")}
            </dt>
            <dd className="text-zinc-600 dark:text-zinc-400">
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
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
          {t("password.title")}
        </h2>
        <PasswordForm />
      </section>

      <div className="mt-10">
        <form action={logout}>
          <button
            type="submit"
            className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-900"
          >
            {t("logout")}
          </button>
        </form>
      </div>
    </div>
  );
}
