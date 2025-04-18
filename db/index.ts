import { PrismaClient } from "@prisma/client";

declare global {
    // eslint-disable-next-line no-var
    var cachedPrisma: PrismaClient;
}

let prisma: PrismaClient;

if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not set");
}

try {
    if (process.env.NODE_ENV === "production") {
        prisma = new PrismaClient({
            errorFormat: "minimal",
            log: ["error", "warn"]
        });
    } else {
        if (!global.cachedPrisma) {
            global.cachedPrisma = new PrismaClient({
                log: ["query", "error", "warn"]
            });
        }
        prisma = global.cachedPrisma;
    }
} catch (error) {
    console.error("Failed to initialize Prisma client:", error);
    throw error;
}

export const db = prisma;
