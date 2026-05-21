import { Request, Response } from "express";
import { db } from "@/db/db.js";

export const getCustomers = async (req: Request, res: Response) => {
	const customers = await db.customer.findMany();
	return res.status(200).json(customers);
};

export const createCustomer = async (req: Request, res: Response) => {
	try {
		const { customer } = req.body;
		const result = await db.customer.create({ data: { ...customer } });
		console.log("Created successfully");
		return res.status(201).json(result);
	} catch (e) {
		console.error(e);
	}
};

export const getCustomerById = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const result = await db.customer.findMany({
			where: {
				id,
			},
		});
		return res.status(200).json(result);
	} catch (e) {
		console.error(e);
		return res.status(500).json("something went wrong");
	}
};
