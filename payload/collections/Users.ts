import type { CollectionConfig } from "payload";
import { auth0Strategy } from "../auth0-strategy";

export const Users: CollectionConfig = {
  slug: "users",
  // Prisma already owns a `users` table; Payload's `schemaName` is
  // experimental and breaks on same-named tables in another schema.
  dbName: "cms_users",
  admin: { useAsTitle: "email" },
  auth: {
    // enableFields keeps the email column (and its generated type); users never
    // have passwords, they sign in through the Auth0 strategy below.
    disableLocalStrategy: { enableFields: true, optionalPassword: true },
    strategies: [auth0Strategy],
  },
  fields: [],
};
