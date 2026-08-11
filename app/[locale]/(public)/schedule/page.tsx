import type { Metadata } from "next";
import { getFormatter, getTranslations } from "next-intl/server";
import { JsonLd } from "@/components/json-ld";
import { ScheduleContent } from "@/components/schedule/schedule-content";
import { localizedAlternates } from "@/lib/seo";
import { getTrainingSchedule } from "@/lib/schedule";
import { scheduleJsonLd } from "@/lib/site";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata.schedule" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: localizedAlternates("/schedule"),
  };
}

export default async function SchedulePage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Training" });
  const format = await getFormatter({ locale });
  const schedule = await getTrainingSchedule();

  const hasData =
    schedule !== null &&
    (schedule.firstHalf || schedule.secondHalf || schedule.friday);

  const fridayLastUpdatedAt = schedule?.fridayLastUpdatedAt
    ? new Date(schedule.fridayLastUpdatedAt)
    : null;
  const showLastUpdated =
    fridayLastUpdatedAt !== null &&
    !Number.isNaN(fridayLastUpdatedAt.getTime());

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <JsonLd data={scheduleJsonLd()} />
      <h1 className="font-display text-4xl uppercase tracking-wide text-ink sm:text-5xl">
        {t("title")}
      </h1>
      {schedule?.season ? (
        <p className="mt-4 inline-block border border-line bg-paper px-3 py-1 font-display text-lg uppercase tracking-widest text-ink">
          {schedule.season}
        </p>
      ) : null}
      <p className="mt-4 text-lg leading-relaxed text-ink-muted">{t("intro")}</p>

      {!hasData ? (
        <p className="mt-12 border border-line bg-paper p-8 text-center text-ink-muted">
          {t("empty")}
        </p>
      ) : schedule ? (
        <>
          <section className="mt-12">
            <h2 className="font-display text-2xl uppercase tracking-wide text-ink">
              {t("wednesday.title")}
            </h2>
            <h3 className="mt-6 font-display text-xl uppercase tracking-wide text-ink">
              {t("wednesday.firstHalf")}
            </h3>
            <ScheduleContent document={schedule.firstHalf} />
            <h3 className="mt-8 font-display text-xl uppercase tracking-wide text-ink">
              {t("wednesday.secondHalf")}
            </h3>
            <ScheduleContent document={schedule.secondHalf} />
          </section>

          <section className="mt-16">
            <h2 className="font-display text-2xl uppercase tracking-wide text-ink">
              {t("friday.title")}
            </h2>
            {showLastUpdated ? (
              <p className="mt-2 text-sm text-ink-muted">
                {t("friday.lastUpdated")}:{" "}
                <span className="font-medium text-ink">
                  {format.dateTime(fridayLastUpdatedAt!, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </p>
            ) : null}
            <ScheduleContent document={schedule.friday} />
          </section>
        </>
      ) : null}
    </div>
  );
}
