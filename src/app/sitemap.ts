import type {MetadataRoute} from "next";
import {BASE_URL} from "@/lib/seo";

const publicRoutes = [
  "",
  "/informatie",
  "/aanmelden",
  "/help-us",
  "/vergaderingen",
  "/privacy",
];

const LAST_MODIFIED = process.env.VERCEL_GIT_COMMIT_DATE
  ? new Date(process.env.VERCEL_GIT_COMMIT_DATE)
  : new Date("2026-04-01");

export default function sitemap(): MetadataRoute.Sitemap {
  return publicRoutes.flatMap((route) => [
    {
      url: `${BASE_URL}/nl${route}`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "monthly" as const,
      priority: route === "" ? 1.0 : 0.8,
      alternates: {
        languages: {
          nl: `${BASE_URL}/nl${route}`,
          en: `${BASE_URL}/en${route}`,
          "x-default": `${BASE_URL}/nl${route}`,
        },
      },
    },
    {
      url: `${BASE_URL}/en${route}`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "monthly" as const,
      priority: route === "" ? 1.0 : 0.8,
      alternates: {
        languages: {
          nl: `${BASE_URL}/nl${route}`,
          en: `${BASE_URL}/en${route}`,
          "x-default": `${BASE_URL}/nl${route}`,
        },
      },
    },
  ]);
}
