import { Request, Response } from "express";
import { db } from "@/db/db.js";
import { error } from "node:console";

const getShopDetailsByShopId = async (shopId: string) => {
	try {
		const shopData = await db.shop.findUnique({
			where: {
				id: shopId,
			},
		});
		if (!shopData) {
			throw new Error("Shop not found");
		}
		return { shopData, message: null };
	} catch (e) {
		if (e instanceof Error) {
			console.error("Error in getting shop data", e.message);
			return { shopData: null, message: e.message };
		}
		return { shopData: null, message: "Unknown error" };
	}
};

export const createShops = async (req: Request, res: Response) => {
	try {
		const { name, slug, location, adminId, attendantIds } = req.body;
		const result = await db.shop.create({
			data: {
				name,
				slug,
				location,
				adminId,
				attendantIds,
			},
		});
		return res.status(201).json({
			data: result,
			error: null,
		});
	} catch (e) {
		if (e instanceof Error) {
			console.error("Error in creating shop ", e.message);
			if (
				e.message.includes(
					"Unique constraint failed on the constraint: `Shop_slug_key`",
				)
			) {
				return res
					.status(409)
					.json({ data: null, error: "Shop name already exist" });
			}
			return res
				.status(500)
				.json({ data: null, error: e.message || "Internal Server error." });
		}
		console.error("Unknown error ", e);
		return res.status(500).json({ data: null, error: "Unknown erro" });
	}
};

export const getShops = async (req: Request, res: Response) => {
	try {
		const result = await db.shop.findMany({
			orderBy: {
				createdAt: "desc",
			},
		});
		return res.status(200).json({ data: result, error: null });
	} catch (e) {
		if (e instanceof Error) {
			console.error("Error in retrieving shop data", e.message);
			return res
				.status(500)
				.json({ data: null, error: e.message || "Internal server error" });
		}
		console.error("Unknown error ", e);
		return res.status(500).json({ data: null, error: "Unknown error" });
	}
};

export const getAttendantsByShop = async (req: Request, res: Response) => {
	const { id } = req.params;
	try {
		const { shopData } = await getShopDetailsByShopId(id as string);
		if (!shopData) {
			console.error(`Shop ${id} not found`);
			return res.status(404).send({ data: null, error: "Shop data not found" });
		}
		const shopAttendants = await db.user.findMany({
			where: {
				id: {
					in: shopData.attendantIds,
				},
			},
			select: {
				firstname: true,
				lastname: true,
				email: true,
				phone: true,
				dob: true,
				gender: true,
				image: true,
			},
		});
		return res.status(200).json({ data: shopAttendants, error: null });
	} catch (e) {
		if (e instanceof Error) {
			console.error("Error in getting attendants by shop", e.message);
			if (e.message.includes("not found")) {
				return res
					.status(404)
					.json({ data: null, error: e.message || "Resource not found" });
			}
			return res
				.status(500)
				.json({ data: null, error: e.message || "Internal Server error" });
		}
		console.error("Unknown error ", e);
		return res.status(500).json({ data: null, error: "Unknown error" });
	}
};

export const getShopsById = async (req: Request, res: Response) => {
	const { id } = req.params;
	try {
		const { shopData } = await getShopDetailsByShopId(id as string);
		return res.status(200).json({ data: shopData, error: null });
	} catch (e) {
		if (e instanceof Error) {
			console.error("Error in getting attendants by shop", e.message);
			if (e.message.includes("not found")) {
				return res
					.status(404)
					.json({ data: null, error: e.message || "Resource not found" });
			}
			return res
				.status(500)
				.json({ data: null, error: e.message || "Internal Server error" });
		}
		console.error("Unknown error ", e);
		return res.status(500).json({ data: null, error: "Unknown error" });
	}
};
