import { createClient } from "contentful";

const SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
const ACCESS_TOKEN = process.env.CONTENTFUL_ACCESS_TOKEN;
const ENVIRONMENT = process.env.CONTENTFUL_ENVIRONMENT ?? "master";

export const contentfulClient =
  SPACE_ID && ACCESS_TOKEN
    ? createClient({
        space: SPACE_ID,
        accessToken: ACCESS_TOKEN,
        environment: ENVIRONMENT,
      })
    : null;
