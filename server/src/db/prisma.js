import { PrismaClient } from "@prisma/client";

// Ensure we do not create multiple clients in dev/hot-reload.
export const prisma = globalThis.__prismaClient || new PrismaClient();
if (!globalThis.__prismaClient) {
  globalThis.__prismaClient = prisma;
}
