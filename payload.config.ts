import path from "node:path";
import { randomUUID } from "node:crypto";
import { fileURLToPath } from "node:url";
import { postgresAdapter } from "@payloadcms/db-postgres";
import {
  EXPERIMENTAL_TableFeature,
  lexicalEditor,
} from "@payloadcms/richtext-lexical";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import { buildConfig } from "payload";
import { AlvDocuments } from "./payload/collections/AlvDocuments";
import { MeetingNotes } from "./payload/collections/MeetingNotes";
import { Media } from "./payload/collections/Media";
import { Users } from "./payload/collections/Users";
import { importContentfulEndpoint } from "./payload/endpoints/importContentful";
import { migrations } from "./payload/migrations";
import { TasksPdf } from "./payload/globals/TasksPdf";
import { TrainingSchedule } from "./payload/globals/TrainingSchedule";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default buildConfig({
  admin: {
    user: Users.slug,
    components: { afterLogin: ["/payload/components/AuthLoginLink"] },
  },
  collections: [Users, Media, AlvDocuments, MeetingNotes],
  globals: [TrainingSchedule, TasksPdf],
  // Temporary: one-off Contentful import. Remove after cutover.
  endpoints: [importContentfulEndpoint],
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures,
      EXPERIMENTAL_TableFeature(),
    ],
  }),
  // Unset-safe: importing this config must never throw at build time. Without
  // a secret we fall back to a random per-process one; lib/payload.ts refuses
  // to talk to Payload unless the real env vars are set.
  secret: process.env.PAYLOAD_SECRET || randomUUID(),
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URL },
    schemaName: "payload",
    // Dev can push schema changes; production applies committed migrations.
    push: process.env.NODE_ENV !== "production",
    migrationDir: path.resolve(dirname, "payload/migrations"),
    // Applied automatically on first init in production (serverless: no CLI step).
    prodMigrations: migrations,
  }),
  plugins: [
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      collections: { media: { disablePayloadAccessControl: true } },
      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),
  ],
  // Auth is Auth0-only, so Payload's "create first user" screen is useless.
  // Seed the allowlisted editors instead; the Auth0 strategy matches by email.
  onInit: async (payload) => {
    const emails = (process.env.PAYLOAD_ADMIN_EMAILS ?? "")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean);
    for (const email of emails) {
      const existing = await payload.find({
        collection: "users",
        where: { email: { equals: email } },
        limit: 1,
        depth: 0,
        overrideAccess: true,
      });
      if (existing.totalDocs === 0) {
        await payload.create({
          collection: "users",
          data: { email },
          overrideAccess: true,
        });
      }
    }
  },
  typescript: { outputFile: path.resolve(dirname, "payload-types.ts") },
});
