import { Request, Response } from "express";
import { db } from "@/db/db.js";

export const createSupplier = async (req: Request, res: Response) => {
	const {
		supplierType,
		name,
		contactPerson,
		phone,
		location,
		country,
		email,
		website,
		taxPin,
		registrationNumber,
		bankAccountNumber,
		bankName,
		paymentTerms,
		logo,
		rating,
		notes,
	} = req.body;
	try {
		const result = await db.supplier.create({
			data: {
				supplierType,
				name,
				contactPerson,
				phone,
				location,
				country,
				email,
				website,
				taxPin,
				registrationNumber,
				bankAccountNumber,
				bankName,
				paymentTerms,
				logo,
				rating,
				notes,
			},
		});
		return res.status(201).json({ data: result, error: null });
	} catch (e) {
		if (e instanceof Error) {
			console.error("Error in creating supplier ", e.message);
			if (
				e.message.includes(
					"Unique constraint failed on the constraint: `Supplier_phone_key`",
				)
			) {
				return res
					.status(409)
					.json({ data: null, error: "Phone already exist" });
			}
			if (
				e.message.includes(
					"Unique constraint failed on the constraint: `Supplier_registrationNumber_key`",
				)
			) {
				return res
					.status(409)
					.json({ data: null, error: "Registration number already exist" });
			}
			if (
				e.message.includes(
					"Unique constraint failed on the constraint: `Supplier_email_key`",
				)
			) {
				return res
					.status(409)
					.json({ data: null, error: "Email already exist" });
			}
			return res
				.status(500)
				.json({ data: null, error: "Internal server error" });
		}
		console.error("Unknown error ", e);
		return res.status(500).json({ data: null, error: "Internal server error" });
	}
};

export const getSupplierById = async (req: Request, res: Response) => {
	const id = req.params.id as string;
	try {
		const result = await db.supplier.findUnique({
			where: {
				id,
			},
		});
		if (!result) {
			console.error(`Supplier ${id} not found`);
			return res.status(404).json({ data: null, error: "Supplier not found" });
		}
		return res.status(200).json({ data: result, error: null });
	} catch (e) {
		if (e instanceof Error) {
			console.error("Error in retrieving suppler data ", e.message);
			return res
				.status(500)
				.json({ data: null, error: "Internal Server error" });
		}
		console.error("Unknown error ", e);
		return res.status(500).json({ data: null, error: "Internal Server error" });
	}
};

export const getSuppliers = async (req: Request, res: Response) => {
	try {
		const result = await db.supplier.findMany({
			orderBy: {
				createdAt: "desc",
			},
		});
		if (!result || !result.length) {
			console.error(`Supplier not found`);
			return res.status(404).json({ data: null, error: "Supplier not found" });
		}
		return res.status(200).json({ data: result, error: null });
	} catch (e) {
		if (e instanceof Error) {
			console.error("Error in retrieving suppler data ", e.message);
			return res
				.status(500)
				.json({ data: null, error: "Internal Server error" });
		}
		console.error("Unknown error ", e);
		return res.status(500).json({ data: null, error: "Internal Server error" });
	}
};
