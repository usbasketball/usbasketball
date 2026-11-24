import { RECRUITMENT_NOTICE_TAG } from "@/lib/cms-tags";
import { cmsRead } from "@/lib/payload";

export { RECRUITMENT_NOTICE_TAG };

export type NoticeContent = {
  title: string;
  intro: string;
  spots: { label: string; text: string }[];
  outro: string[];
};

export type RecruitmentNotice = {
  enabled: boolean;
  en: NoticeContent | null;
  nl: NoticeContent | null;
};

type RawContent = {
  title?: string | null;
  intro?: string | null;
  spots?: { label?: string | null; text?: string | null }[] | null;
  outro?: string | null;
};

export function normalizeContent(raw: RawContent | null | undefined): NoticeContent | null {
  const title = raw?.title?.trim();
  const intro = raw?.intro?.trim();
  if (!title || !intro) return null;
  return {
    title,
    intro,
    spots: (raw?.spots ?? [])
      .map((s) => ({ label: s.label?.trim() ?? "", text: s.text?.trim() ?? "" }))
      .filter((s) => s.label && s.text),
    outro: (raw?.outro ?? "")
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean),
  };
}

/**
 * The notice to show for a locale, or null when there is none (CMS
 * unconfigured, unreachable or never saved) or editors switched it off.
 */
export function pickNotice(
  notice: RecruitmentNotice | null,
  locale: string
): NoticeContent | null {
  if (!notice?.enabled) return null;
  return (locale === "nl" ? notice.nl : notice.en) ?? null;
}

export const getRecruitmentNotice = cmsRead<RecruitmentNotice | null>(
  "recruitment-notice",
  RECRUITMENT_NOTICE_TAG,
  async (payload) => {
    const doc = await payload.findGlobal({ slug: "recruitment-notice", depth: 0 });
    const en = normalizeContent(doc.en);
    const nl = normalizeContent(doc.nl);
    if (!en && !nl) return null;
    return { enabled: doc.enabled !== false, en, nl };
  },
  null
);
