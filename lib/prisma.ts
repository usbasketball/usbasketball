import postgres from "@prisma/orm-postgres/runtime";
import type { Contract } from "@/prisma/contract";
import contractJson from "@/prisma/contract.json" with { type: "json" };

type Db = ReturnType<typeof postgres<Contract>>;

const globalForPrisma = globalThis as unknown as {
  db?: Db;
};

export const db = globalForPrisma.db ?? postgres<Contract>({
  contractJson,
  url: process.env.DATABASE_URL,
});

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.db = db;
}
