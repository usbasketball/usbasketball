import { config } from "dotenv";
import { resolve } from "path";
import { definePrismaConfig } from "prisma/config";
import { defineConfig as ormConfig } from "@prisma/orm-postgres/config";

config({ path: resolve(__dirname, ".env.local") });
config({ path: resolve(__dirname, ".env") });

export default definePrismaConfig({
  orm: ormConfig({
    contract: "./prisma/contract.prisma",
    db: {
      connection: process.env["DATABASE_URL"],
    },
  }),
});
