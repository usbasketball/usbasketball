import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { FoysRegistrationForm } from "@/components/foys-registration-form";
import { isRegistrationAccessValid } from "@/lib/registration-link";
import { pageMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata.register" });

  return pageMetadata({
    locale,
    pathname: "/register",
    title: t("title"),
    description: t("description"),
    robots: { index: false, follow: false },
  });
}

export default async function RegisterPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const sp = await searchParams;

  // Defense in depth: the proxy already gates this route, but never rely on
  // proxy alone for authorization.
  const accessValid = await isRegistrationAccessValid({
    secret: process.env.REGISTRATION_SECRET,
    expires: typeof sp.expires === "string" ? sp.expires : null,
    token: typeof sp.token === "string" ? sp.token : null,
  });
  if (!accessValid) notFound();

  const t = await getTranslations("Register");
  // Per-locale Foys form (identical fields, NL/EN wording). Falls back to the
  // NL form when the EN-specific id is not configured.
  const formId =
    (locale === "en"
      ? process.env.FOYS_REGISTRATION_FORM_EN_ID
      : process.env.FOYS_REGISTRATION_FORM_ID) ||
    process.env.FOYS_REGISTRATION_FORM_ID;

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-4xl uppercase tracking-wide text-ink sm:text-5xl">
        {t("title")}
      </h1>
      <p className="mt-4 leading-relaxed text-ink-muted">{t("intro")}</p>

      <div className="mt-8 border border-line bg-white p-6">
        {formId ? (
          <FoysRegistrationForm configuration={formId} />
        ) : (
          <p className="text-sm leading-relaxed text-ink-muted">
            {t("formUnavailable")}
          </p>
        )}
      </div>
    </div>
  );
}
