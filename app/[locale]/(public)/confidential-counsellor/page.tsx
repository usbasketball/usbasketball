import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { pageMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: string }>;
};

type Counsellor = {
  name: string;
  teamNumber: string;
  teamRoleKey: "dames" | "heren";
  photo: string;
  email: string;
};

const COUNSELLORS: Counsellor[] = [
  {
    name: "Robin Hak",
    teamNumber: "3",
    teamRoleKey: "dames",
    photo: "/images/robin.jpeg",
    email: "robinhak1998@hotmail.com",
  },
  {
    name: "Bas van de Kerkhof",
    teamNumber: "2",
    teamRoleKey: "heren",
    photo: "/images/bas.jpeg",
    email: "bvdkhof@hotmail.com",
  },
];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "Metadata.confidentialCounsellor",
  });

  return pageMetadata({
    locale,
    pathname: "/confidential-counsellor",
    title: t("title"),
    description: t("description"),
  });
}

export default async function ConfidentialCounsellorPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ConfidentialCounsellor" });
  const role = (key: "dames" | "heren") => t(`roles.${key}`);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-4xl uppercase tracking-wide text-ink sm:text-5xl">
        {t("title")}
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-ink-muted">{t("intro")}</p>

      <section className="mt-12">
        <h2 className="font-display text-2xl uppercase tracking-wide text-ink">
          {t("whatWeDo.title")}
        </h2>
        <p className="mt-3 leading-relaxed text-ink-muted">{t("whatWeDo.p")}</p>
        <p className="mt-4 border-l-2 border-accent pl-4 text-ink-muted">
          {t("whatWeDo.note")}
        </p>
      </section>

      <section className="mt-14">
        <h2 className="font-display text-2xl uppercase tracking-wide text-ink">
          {t("people.title")}
        </h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {COUNSELLORS.map((counsellor) => (
            <div
              key={counsellor.name}
              className="flex flex-col border border-line bg-white"
            >
              <div className="relative aspect-[4/5] w-full bg-paper">
                <Image
                  src={counsellor.photo}
                  alt={counsellor.name}
                  fill
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <p className="font-display text-2xl uppercase tracking-wide text-ink">
                  {counsellor.name}
                </p>
                <p className="mt-1 text-sm font-medium text-ink">
                  {role(counsellor.teamRoleKey)} {counsellor.teamNumber}
                </p>
                {counsellor.email ? (
                  <a
                    href={`mailto:${counsellor.email}`}
                    className="mt-3 text-sm text-accent underline decoration-accent/40 underline-offset-2 transition-colors hover:decoration-accent"
                  >
                    {counsellor.email}
                  </a>
                ) : (
                  <p className="mt-3 text-sm text-ink-muted">
                    {t("contact")}: {t("emailPlaceholder")}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
