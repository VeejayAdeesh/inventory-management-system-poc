import { Request, Response } from "express";
import { db } from "@/db/db.js";
import { Prisma } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export const getCustomers = async (req: Request, res: Response) => {
	try {
		const customers = await db.customer.findMany();
		return res.status(200).json({ data: customers, error: null });
	} catch (e) {
		if (e instanceof Error) {
			console.error("Error in retrieving customer data", e.message);
			return res
				.status(500)
				.json({ data: null, error: "Internal server error" });
		}
		console.error("Unknown error", e);
		return res.status(500).json({ data: null, error: "Internal server error" });
	}
};

export const createCustomer = async (req: Request, res: Response) => {
	try {
		const {
			customerType,
			firstname,
			lastname,
			phone,
			gender,
			maxCreditLimit,
			maxCreditDays,
			country,
			location,
			taxPin,
			dob,
			email,
			NIN,
		} = req.body;
		const result = await db.customer.create({
			data: {
				customerType,
				firstname,
				lastname,
				phone,
				gender,
				maxCreditLimit,
				maxCreditDays,
				country,
				location,
				taxPin,
				dob,
				email,
				NIN,
			},
		});
		console.log("Created successfully");
		return res.status(201).json({ data: result, error: null });
	} catch (e) {
		if (e instanceof Error) {
			console.error("Error in creating customer ", e.message);
			if (
				e.message.includes(
					"Unique constraint failed on the constraint: `Customer_phone_key`",
				)
			) {
				return res
					.status(404)
					.json({ data: null, error: "Phone number already in use" });
			}
			if (
				e.message.includes(
					"Unique constraint failed on the constraint: `Customer_email_key`",
				)
			) {
				return res
					.status(404)
					.json({ data: null, error: "Email already in use" });
			}
			if (
				e.message.includes(
					"Unique constraint failed on the constraint: `Customer_NIN_key`",
				)
			) {
				return res
					.status(404)
					.json({ data: null, error: "NIN already in use" });
			}
			return res
				.status(500)
				.json({ data: null, error: "Internal server error" });
		}
		console.error("Unknown error", e);
		return res.status(500).json({ data: null, error: "Internal server error" });
	}
};

export const getCustomerById = async (req: Request, res: Response) => {
	try {
		const id = req.params.id as string;
		const result = await db.customer.findUnique({
			where: {
				id,
			},
		});
		if (!result) {
			return res.status(404).json({ data: null, error: "Customer not found" });
		}
		return res.status(200).json({ data: result, error: null });
	} catch (e) {
		if (e instanceof Error) {
			console.error("Error in retrieving customer data", e.message);
			return res
				.status(500)
				.json({ data: null, error: "Internal server error" });
		}
		console.error("Unknown error", e);
		return res.status(500).json({ data: null, error: "Internal server error" });
	}
};
