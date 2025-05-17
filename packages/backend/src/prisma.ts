import { PrismaClient } from "@prisma/client";
import { CONFIG } from "./config";

// Initialize Prisma client
export const prisma = new PrismaClient({
    datasourceUrl: CONFIG.databaseURL,
});

// Handle shutdown
process.on('SIGINT', async () => {
    await prisma.$disconnect();
    process.exit(0);
});