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

async function initialiseDatabaseIndexed() {
	try {
		await db.$runCommandRaw({
			dropIndexes: "Supplier",
			index: "Supplier_email_key",
		});
		await db.$runCommandRaw({
			dropIndexes: "Product",
			index: "Product_barcode_key",
		});
	} catch (e) {
		console.error("Index not found. Countuning to create new index", e.message);
	}
	try {
		await db.$runCommandRaw({
			createIndexes: "Supplier",
			indexes: [
				{
					key: { email: 1 },
					name: "Supplier_email_key",
					unique: true,
					partialFilterExpression: {
						email: { $exists: true, $type: "string" },
					},
				},
			],
		});
		await db.$runCommandRaw({
			createIndexes: "Product",
			indexes: [
				{
					key: { barcode: 1 },
					name: "Product_barcode_key",
					unique: true,
					partialFilterExpression: {
						barcode: { $exists: true, $type: "string" },
					},
				},
			],
		});
	} catch (e) {
		console.error("Error in creating supplier index", e.message);
	}
}

initialiseDatabaseIndexed();
