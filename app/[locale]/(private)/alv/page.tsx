import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { auth0, authEnabled } from "@/lib/auth";
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

  const notes = await getAlvNotes();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-4xl uppercase tracking-wide text-ink sm:text-5xl">
        {t("title")}
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-ink-muted">
        {t("intro")}
      </p>

      {notes.length === 0 ? (
        <p className="mt-12 border border-line bg-paper p-8 text-center text-ink-muted">
          {t("empty")}
        </p>
      ) : (
        <ul className="mt-10 divide-y divide-line border border-line bg-white">
          {notes.map((note) => (
            <li
              key={note.id}
              className="flex flex-col gap-2 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-baseline gap-4">
                <span className="font-display text-xl uppercase tracking-wide text-ink">
                  {note.year ?? t("unknownYear")}
                </span>
                <span className="text-ink-muted">{note.title}</span>
              </div>
              <a
                href={note.documentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="self-start whitespace-nowrap border border-line px-3 py-2 text-sm font-semibold uppercase tracking-wide text-ink transition-colors hover:bg-paper sm:self-auto"
              >
                {t("openDocument")}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
