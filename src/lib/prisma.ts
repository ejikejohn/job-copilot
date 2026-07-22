import { PrismaClient } from "@prisma/client";

// This pattern prevents creating a new database connection every time
// this file is imported during development (Next.js hot-reloads a lot).
// In production, one clean instance is created per server start.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
