import type { Document } from "@contentful/rich-text-types";
import { unstable_cache } from "next/cache";
import { contentfulClient } from "@/lib/contentful";

export const TRAINING_SCHEDULE_TAG = "training-schedule";

export type TrainingSchedule = {
  season: string | null;
  firstHalf: Document | null;
  secondHalf: Document | null;
  friday: Document | null;
  fridayLastUpdatedAt: Date | null;
};

function toDocument(value: unknown): Document | null {
  return value && typeof value === "object" ? (value as Document) : null;
}

function parseDate(value: unknown): Date | null {
  const raw = String(value ?? "");
  if (!raw) return null;
  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? null : date;
}

async function fetchTrainingSchedule(): Promise<TrainingSchedule | null> {
  if (!contentfulClient) return null;

  try {
    const result = await contentfulClient.getEntries({
      content_type: "wednesdaySlot",
      limit: 1,
    });
    const entry = result.items[0];
    if (!entry) return null;

    const fields = entry.fields as Record<string, unknown>;
    return {
      season: String(fields.season ?? "").trim() || null,
      firstHalf: toDocument(fields.wednesdaySchedule1stHalf),
      secondHalf: toDocument(fields.wednesdayTrainingSchedule2ndHalf),
      friday: toDocument(fields.fridayTrainingSchedule),
      fridayLastUpdatedAt: parseDate(fields.fridayTrainingScheduleLastUpdatedAt),
    };
  } catch (error) {
    console.error("Failed to fetch training schedule from Contentful", error);
    return null;
  }
}

export const getTrainingSchedule = unstable_cache(
  fetchTrainingSchedule,
  ["training-schedule"],
  {
    tags: [TRAINING_SCHEDULE_TAG],
  }
);
