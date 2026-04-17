import {createClient} from "contentful";
import type {Locale} from "@/lib/i18n";

function getClient() {
  const spaceId = process.env.CONTENTFUL_SPACE_ID;
  const accessToken = process.env.CONTENTFUL_DELIVERY_ACCESS_TOKEN;
  if (!spaceId || !accessToken) return null;
  return createClient({space: spaceId, accessToken});
}

// ─── Types matching Contentful content models ──────────────────────────────

export type InformatieSection = {
  id: string;
  title: string;
  body: readonly string[];
  list?: readonly string[];
  note?: string;
  disclaimer?: string;
  cta?: {text: string; href: string; external: boolean};
};

export type Committee = {
  name: string;
  description: string;
};

export type HelpUsContent = {
  intro: string;
  cta: string;
  committees: Committee[];
};

export type InstagramPost = {
  postUrl: string;
  imageAlt: string;
  caption: string;
};

export type MeetingNote = {
  id: string;
  year: number;
  title: string;
  documentUrl: string;
};

// ─── Fetchers ──────────────────────────────────────────────────────────────

export async function getInformatieSections(
  locale: Locale,
): Promise<InformatieSection[] | null> {
  const client = getClient();
  if (!client) return null;

  const res = await client.getEntries({
    content_type: "informatieSection",
    locale: locale === "nl" ? "nl" : "en",
    order: ["fields.order"],
  });

  if (!res.items.length) return null;

  return res.items.map((item) => {
    const f = item.fields as Record<string, unknown>;
    return {
      id: f.sectionId as string,
      title: f.title as string,
      body: (f.body as string[]) ?? [],
      list: f.list ? (f.list as string[]) : undefined,
      note: f.note ? (f.note as string) : undefined,
      disclaimer: f.disclaimer ? (f.disclaimer as string) : undefined,
      cta: f.ctaText
        ? {
            text: f.ctaText as string,
            href: f.ctaHref as string,
            external: (f.ctaExternal as boolean) ?? false,
          }
        : undefined,
    };
  });
}

export async function getHelpUsContent(
  locale: Locale,
): Promise<HelpUsContent | null> {
  const client = getClient();
  if (!client) return null;

  const [pageRes, committeesRes] = await Promise.all([
    client.getEntries({
      content_type: "helpUsPage",
      locale: locale === "nl" ? "nl" : "en",
      limit: 1,
    }),
    client.getEntries({
      content_type: "committee",
      locale: locale === "nl" ? "nl" : "en",
      order: ["fields.order"],
    }),
  ]);

  if (!pageRes.items.length) return null;

  const page = pageRes.items[0].fields as Record<string, unknown>;
  return {
    intro: page.intro as string,
    cta: page.cta as string,
    committees: committeesRes.items.map((item) => {
      const f = item.fields as Record<string, unknown>;
      return {name: f.name as string, description: f.description as string};
    }),
  };
}

export async function getMeetingNotes(): Promise<MeetingNote[] | null> {
  const client = getClient();
  if (!client) return null;

  const res = await client.getEntries({
    content_type: "meetingNote",
    include: 1,
    order: ["-fields.year"],
  });

  if (!res.items.length) return null;

  return res.items.map((item) => {
    const f = item.fields as Record<string, unknown>;
    const asset = f.document as {fields: {file: {url: string}}};
    const rawUrl = asset.fields.file.url;
    return {
      id: item.sys.id,
      year: f.year as number,
      title: f.title as string,
      documentUrl: rawUrl.startsWith("//") ? `https:${rawUrl}` : rawUrl,
    };
  });
}

export async function getInstagramPost(): Promise<InstagramPost | null> {
  const client = getClient();
  if (!client) return null;

  const res = await client.getEntries({
    content_type: "instagramPost",
    limit: 1,
  });

  if (!res.items.length) return null;

  const f = res.items[0].fields as Record<string, unknown>;
  return {
    postUrl: f.postUrl as string,
    imageAlt: f.imageAlt as string,
    caption: f.caption as string,
  };
}
