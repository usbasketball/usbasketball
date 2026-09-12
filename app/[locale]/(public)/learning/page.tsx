import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { pageMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata.learning" });

  return pageMetadata({
    locale,
    pathname: "/learning",
    title: t("title"),
    description: t("description"),
  });
}

const VIMEO_PARAMS = "?title=0&byline=0&portrait=0&badge=0&autopause=0&player_id=0&app_id=58479";

export default async function LearningPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Learning" });

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-4xl uppercase tracking-wide text-ink sm:text-5xl">
        {t("title")}
      </h1>

      <section className="mt-10">
        <h2 className="text-xl font-bold text-ink">{t("scorer.title")}</h2>
        <div className="mt-4 aspect-video overflow-hidden border border-line bg-black">
          <iframe
            src="https://www.youtube-nocookie.com/embed/uxj8TrQrejM"
            title={t("scorer.title")}
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            className="h-full w-full"
          />
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-bold text-ink">{t("timer.big.title")}</h2>
        <div className="mt-4 aspect-video overflow-hidden border border-line bg-black">
          <iframe
            src={`https://player.vimeo.com/video/1226066822${VIMEO_PARAMS}`}
            title={t("timer.big.title")}
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            className="h-full w-full"
          />
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-bold text-ink">{t("timer.small.title")}</h2>
        <div className="mt-4 aspect-video overflow-hidden border border-line bg-black">
          <iframe
            src={`https://player.vimeo.com/video/1226066832${VIMEO_PARAMS}`}
            title={t("timer.small.title")}
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            className="h-full w-full"
          />
        </div>
      </section>
    </div>
  );
}