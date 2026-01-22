import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { config } from "../config.js";

const connectionString = config.databaseUrl;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const pool = globalThis.__prismaPool || new Pool({ connectionString });
if (!globalThis.__prismaPool) {
  globalThis.__prismaPool = pool;
}

const adapter = new PrismaPg(pool);

// Ensure we do not create multiple clients in dev/hot-reload.
export const prisma = globalThis.__prismaClient || new PrismaClient({ adapter });
if (!globalThis.__prismaClient) {
  globalThis.__prismaClient = prisma;
}
