import { Request, Response } from "express";
import { db } from "@/db/db.js";

const getShopDetailsByShopId = async (shopId: String) => {
	try {
		const shopData = await db.Shop.findUnique({
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
		const result = await db.Shop.create({
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
		return res.status(500).json({ data: null, error: "Unknown erro" });
	}
};

export const getShops = async (req: Request, res: Response) => {
	try {
		const result = await db.Shop.findMany({
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
		return res.status(500).json({ data: null, error: "Unknown error" });
	}
};

export const getAttendantsByShop = async (req: Request, res: Response) => {
	const { id } = req.params;
	try {
		const { shopData } = await getShopDetailsByShopId(id);
		const shopAttendants = await db.User.findMany({
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
		return res.status(500).json({ data: null, error: "Unknown error" });
	}
};

export const getShopsById = async (req: Request, res: Response) => {
	const { id } = req.params;
	try {
		const { shopData } = await getShopDetailsByShopId(id as String);
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
		return res.status(500).json({ data: null, error: "Unknown error" });
	}
};
