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
      <h1 className="font-display text-4xl uppercase tracking-wide text-ink sm:text-5xl">
        {t("title")}
      </h1>
      <p className="mt-4 leading-relaxed text-ink-muted">{t("intro")}</p>

      <div className="mt-8 border border-line bg-white p-6">
        <LoginForm />
      </div>

      <p className="mt-6 text-center text-sm text-ink-muted">
        <Link
          href="/signup"
          className="font-semibold text-accent hover:underline"
        >
          {t("signupLink")}
        </Link>
      </p>
    </div>
  );
}
