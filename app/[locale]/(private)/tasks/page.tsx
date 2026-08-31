import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { auth0, authEnabled } from "@/lib/auth";
import { pageMetadata } from "@/lib/seo";
import { getTasksPdf } from "@/lib/tasks-pdf";

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

  const pdf = await getTasksPdf();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-4xl uppercase tracking-wide text-ink sm:text-5xl">
        {t("title")}
      </h1>

      {!pdf ? (
        <p className="mt-12 border border-line bg-paper p-8 text-center text-ink-muted">
          {t("empty")}
        </p>
      ) : (
        <>
          <div className="mt-8 flex justify-end">
            <a
              href={pdf.url}
              download={pdf.fileName}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-line px-4 py-2 text-sm font-semibold uppercase tracking-wide text-ink transition-colors hover:bg-paper"
            >
              {t("download")}
            </a>
          </div>

          <iframe
            src={pdf.url}
            title={t("pdfTitle")}
            className="mt-4 h-[75vh] w-full border border-line bg-white"
          />
        </>
      )}
    </div>
  );
}