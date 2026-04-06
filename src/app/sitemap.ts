import type {MetadataRoute} from "next";
import {BASE_URL} from "@/lib/seo";

const routes = [
  "",
  "/informatie",
  "/trainingschema",
  "/takenschema",
  "/aanmelden",
  "/help-us",
  "/vertrouwenspersoon",
  "/privacy",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.flatMap((route) => [
    {
      url: `${BASE_URL}/nl${route}`,
      lastModified: new Date(),
      alternates: {
        languages: {
          nl: `${BASE_URL}/nl${route}`,
          en: `${BASE_URL}/en${route}`,
        },
      },
    },
    {
      url: `${BASE_URL}/en${route}`,
      lastModified: new Date(),
      alternates: {
        languages: {
          nl: `${BASE_URL}/nl${route}`,
          en: `${BASE_URL}/en${route}`,
        },
      },
    },
  ]);
}
