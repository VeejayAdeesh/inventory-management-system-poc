import { Request, Response } from "express";
import { db } from "@/db/db.js";
import { AdjustmentItem, AdjustmentRequest } from "@/types/types.js";
import { getRefNo } from "@/utils/adjusmentUtils.js";
import { NetworkStatusCode } from "@/utils/errorCode.js";
import { sendProductStockForPurchaseNotification } from "@/services/productService.js";

export const createAdjustment = async (req: Request, res: Response) => {
	try {
		const { reason, adjustmentItems }: AdjustmentRequest = req.body;
		const result = await db.$transaction(async (transaction) => {
			// 1. Create Adjustment
			const adjustmentResult = await transaction.adjustment.create({
				data: {
					reason,
					refNo: getRefNo(),
				},
			});
			if (!adjustmentResult) {
				return res.status(NetworkStatusCode.InternalServerError).json({
					data: null,
					error: "Internal server error. Unable to create adjustment",
				});
			}
			for (const item of adjustmentItems as AdjustmentItem[]) {
				const adjustStockQty: any = {};
				// 2. Check if product qty is available in inventory
				if (item.type === "return") {
					adjustStockQty.increment = item.quantity;
				} else if (item.type === "buy") {
					const productData = await db.product.findUnique({
						where: { id: item.productId },
						select: { stockQty: true },
					});
					if (!productData) {
						throw new Error("PRODUCT_NOT_FOUND");
					}
					if (productData?.stockQty < item.quantity) {
						throw new Error("INSUFFICIENT_QTY");
					}
					adjustStockQty.decrement = item.quantity;
				} else {
					throw new Error("UNKOWN_ADJUSTMENT_TYPE");
				}
				// 3. update Stock quantity in product
				await transaction.product.update({
					where: {
						id: item.productId,
					},
					data: {
						stockQty: adjustStockQty,
					},
				});
				// 4. create adjustment item
				await transaction.adjustmentItem.create({
					data: {
						adjustmentId: adjustmentResult.id as string,
						productId: item.productId,
						quantity: item.quantity,
						type: item.type,
					},
				});
			}
			// 5. Get adjustment and adjustment item data
			const adjustmentData = await transaction.adjustment.findUnique({
				where: {
					id: adjustmentResult.id,
				},
				select: {
					adjustmentItems: true,
				},
			});
			return adjustmentData;
		});
		const productIds = adjustmentItems.map((v) => v.productId);
		sendProductStockForPurchaseNotification(productIds);
		return res
			.status(NetworkStatusCode.Created)
			.json({ data: result, error: null });
	} catch (e) {
		if (e instanceof Error) {
			console.error("Error in creating product adjustment ", e.message);
			switch (e.message) {
				case "UNKOWN_ADJUSTMENT_TYPE":
					return res
						.status(NetworkStatusCode.BadRequest)
						.json({ data: null, error: "Unknown adjustment type" });
				case "PRODUCT_NOT_FOUND":
					return res
						.status(NetworkStatusCode.NotFound)
						.json({ data: null, error: "Product Not found" });
				case "INSUFFICIENT_QTY":
					return res.status(NetworkStatusCode.UnprocessableEntiry).json({
						data: null,
						error: "Requested quantity exceeds available inventor",
					});
				default:
					return res.status(NetworkStatusCode.InternalServerError).json({
						data: null,
						error: "Internal Server error. Unable to create Adjusment",
					});
			}
		}
		console.error("Unknown error occured while creating adjustment ", e);
		return res.status(NetworkStatusCode.InternalServerError).json({
			data: null,
			error: "Internal Server error. Unable to create Adjusment",
		});
	}
};

export const getAdjustments = async (req: Request, res: Response) => {
	try {
		const adjustmentData = await db.adjustment.findMany({
			orderBy: {
				createdAt: "desc",
			},
		});
		if (!adjustmentData || !adjustmentData.length) {
			console.error("Adjustment data not found");
			return res
				.status(NetworkStatusCode.NotFound)
				.json({ data: null, error: "No adjustment data found" });
		}
		return res
			.status(NetworkStatusCode.Ok)
			.json({ data: adjustmentData, error: null });
	} catch (e) {
		if (e instanceof Error) {
			console.error("Error in getting adjustment data", e.message);
		} else {
			console.error("Unknown error in getting adjustment data", e);
		}
		return res.status(NetworkStatusCode.InternalServerError).json({
			data: null,
			error: "Internal server error. Unable to get adjustment data",
		});
	}
};

export const getAdjustmentsById = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const adjustmentData = await db.adjustment.findUnique({
			where: {
				id: id as string,
			},
		});
		if (!adjustmentData) {
			console.error("Adjustment data not found");
			return res
				.status(NetworkStatusCode.NotFound)
				.json({ data: null, error: "No adjustment data found" });
		}
		return res
			.status(NetworkStatusCode.Ok)
			.json({ data: adjustmentData, error: null });
	} catch (e) {
		if (e instanceof Error) {
			console.error("Error in getting adjustment data", e.message);
		} else {
			console.error("Unknown error in getting adjustment data", e);
		}
		return res.status(NetworkStatusCode.InternalServerError).json({
			data: null,
			error: "Internal server error. Unable to get adjustment data",
		});
	}
};
