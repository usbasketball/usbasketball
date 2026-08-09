import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { localizedAlternates } from "@/lib/seo";
import { LoginForm } from "@/components/login-form";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata.login" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: localizedAlternates("/login"),
    robots: { index: false, follow: false },
  };
}

export default async function LoginPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Login" });

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
        {t("title")}
      </h1>
      <p className="mt-4 text-zinc-600 dark:text-zinc-400">{t("intro")}</p>

      <div className="mt-8 rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <LoginForm />
      </div>

      <p className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
        <Link
          href="/signup"
          className="font-medium text-orange-600 hover:underline"
        >
          {t("signupLink")}
        </Link>
      </p>
    </div>
  );
}
