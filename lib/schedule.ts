import type { TrainingSchedule as TrainingScheduleDoc } from "@/payload-types";
import { TRAINING_SCHEDULE_TAG } from "@/lib/cms-tags";
import { cmsRead } from "@/lib/payload";

export { TRAINING_SCHEDULE_TAG };

export type ScheduleRichText = NonNullable<TrainingScheduleDoc["firstHalf"]>;

export type TrainingSchedule = {
  season: string | null;
  firstHalf: ScheduleRichText | null;
  secondHalf: ScheduleRichText | null;
  friday: ScheduleRichText | null;
  // ISO string: unstable_cache round-trips values through JSON.
  fridayLastUpdatedAt: string | null;
};

function parseDate(value: unknown): string | null {
  const raw = String(value ?? "");
  if (!raw) return null;
  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

export const getTrainingSchedule = cmsRead<TrainingSchedule | null>(
  "training-schedule",
  TRAINING_SCHEDULE_TAG,
  async (payload) => {
    const doc = await payload.findGlobal({
      slug: "training-schedule",
      depth: 0,
    });
    return {
      season: doc.season?.trim() || null,
      firstHalf: doc.firstHalf ?? null,
      secondHalf: doc.secondHalf ?? null,
      friday: doc.friday ?? null,
      fridayLastUpdatedAt: parseDate(doc.fridayLastUpdatedAt),
    };
  },
  null
);
