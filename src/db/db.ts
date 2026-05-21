// src/lib/db.ts
import { PrismaClient } from "@/generated/client.js";

// Create a global variable to hold the Prisma client in development
declare global {
	// eslint-disable-next-line no-var
	var prisma: PrismaClient | undefined;
}

// Use the existing global Prisma client if it exists (only in dev)
export const db = globalThis.prisma || new PrismaClient();

// Assign the client to the global object in development
if (process.env.NODE_ENV !== "production") {
	globalThis.prisma = db;
}
