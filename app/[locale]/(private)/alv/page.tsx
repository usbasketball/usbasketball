import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { auth0, authEnabled } from "@/lib/auth";
import { getAlvDocuments } from "@/lib/alv-documents";
import { getAlvNotes } from "@/lib/alv-notes";
import { pageMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata.alv" });

  return pageMetadata({
    locale,
    pathname: "/alv",
    title: t("title"),
    description: t("description"),
    robots: { index: false, follow: false },
  });
}

export default async function AlvPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "AlvNotes" });

  const session = authEnabled() ? await auth0.getSession() : null;
  if (!session) {
    return redirect({ href: "/login", locale });
  }

  const [alvDocuments, notes] = await Promise.all([
    getAlvDocuments(),
    getAlvNotes(),
  ]);

  const hasNextAlv =
    alvDocuments !== null && alvDocuments.documents.length > 0;

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-4xl uppercase tracking-wide text-ink sm:text-5xl">
        {t("title")}
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-ink-muted">
        {t("intro")}
      </p>

      {alvDocuments !== null && (
        <section className="mt-12 border border-line bg-white">
          <header className="border-b border-line bg-paper px-6 py-4">
            <h2 className="font-display text-2xl uppercase tracking-wide text-ink">
              {alvDocuments.year !== null
                ? t("nextAlv.titleYear", { year: alvDocuments.year })
                : t("nextAlv.title")}
            </h2>
          </header>

          {!hasNextAlv ? (
            <p className="p-8 text-center text-ink-muted">
              {t("nextAlv.empty")}
            </p>
          ) : (
            <ul className="divide-y divide-line">
              {alvDocuments.documents.map((document) => (
                <li
                  key={document.id}
                  className="flex flex-col gap-2 px-6 py-4"
                >
                  <a
                    href={document.documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent underline decoration-accent/40 underline-offset-2 transition-colors hover:decoration-accent"
                  >
                    {document.title}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      <div className="mt-12">
        <h2 className="font-display text-2xl uppercase tracking-wide text-ink">
          {t("notes.title")}
        </h2>

        {notes.length === 0 ? (
          <p className="mt-6 border border-line bg-paper p-8 text-center text-ink-muted">
            {t("notes.empty")}
          </p>
        ) : (
          <ul className="mt-6 divide-y divide-line border border-line bg-white">
            {notes.map((note) => (
              <li
                key={note.id}
                className="flex flex-col gap-2 px-6 py-4"
              >
                <div className="flex items-baseline gap-4">
                  <span className="font-display text-xl uppercase tracking-wide text-ink">
                    {note.year ?? t("unknownYear")}
                  </span>
                  <a
                    href={note.documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent underline decoration-accent/40 underline-offset-2 transition-colors hover:decoration-accent"
                  >
                    {note.title}
                  </a>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
