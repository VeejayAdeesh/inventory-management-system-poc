import { db } from "@/db/db.js";
import { Prisma } from "@/generated/client.js";
import { updateProductStockQtyFromPO } from "@/services/productService.js";
import { PurcahaseOrderRequest } from "@/types/types.js";
import { NetworkStatusCode, PrismaErrorCode } from "@/utils/errorCode.js";
import { Request, Response } from "express";

export const createPurchaseOrder = async (req: Request, res: Response) => {
	try {
		const {
			supplierId,
			paymentStatus,
			purchaseOrderStatus,
			discount,
			notes,
			tax,
			refNo,
			totalAmount,
			balanceAmount,
			shippingCost,
			purchaseOrderItems,
		}: PurcahaseOrderRequest = req.body;
		const purchaseOrderData = await db.purchaseOrder.create({
			data: {
				supplierId,
				paymentStatus,
				purchaseOrderStatus,
				discount,
				notes,
				tax,
				refNo,
				totalAmount,
				balanceAmount,
				shippingCost,
				purchaseOrderItems: {
					create: purchaseOrderItems.map((val) => {
						return {
							productId: val.productId,
							orderQty: val.orderQty,
							unitCost: val.unitCost,
							subTotal: val.subTotal,
						};
					}),
				},
			},
		});
		return res
			.status(NetworkStatusCode.Created)
			.json({ data: purchaseOrderData, error: null });
	} catch (e) {
		if (e instanceof Error) {
			console.error("Error in creating Purchase order ", e.message);
		} else {
			console.error("Unknown error in creating Purchase order", e);
		}
		return res.status(NetworkStatusCode.InternalServerError).json({
			data: null,
			error: "Internal server error. Unable to create purchase order",
		});
	}
};

export const updatePurchaseOrderById = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const {
			paymentStatus,
			purchaseOrderStatus,
			discount,
			notes,
			tax,
			totalAmount,
			balanceAmount,
			shippingCost,
		} = req.body;
		const purchaseOrderDetail = await db.purchaseOrder.findUnique({
			where: { id: id as string },
			include: {
				purchaseOrderItems: true,
			},
		});
		if (!purchaseOrderDetail) {
			return res
				.status(NetworkStatusCode.NotFound)
				.json({ data: null, error: "Purchase Order data not found" });
		}
		const updatedPurchaseOrder = await db.purchaseOrder.update({
			where: {
				id: id as string,
			},
			data: {
				paymentStatus,
				purchaseOrderStatus,
				discount,
				notes,
				tax,
				totalAmount,
				balanceAmount,
				shippingCost,
			},
		});
		updateProductStockQtyFromPO(purchaseOrderDetail, purchaseOrderStatus);
		return res
			.status(NetworkStatusCode.Ok)
			.json({ data: updatedPurchaseOrder, error: null });
	} catch (e) {
		if (e instanceof Prisma.PrismaClientKnownRequestError) {
			console.error("Error in updating purchase order", e.cause);
			if (e.code === PrismaErrorCode.RecordNotFound) {
				return res
					.status(NetworkStatusCode.NotFound)
					.json({ data: null, error: "Purchase order not found" });
			}
		} else if (e instanceof Error) {
			console.error("Error in updating purchase order", e.message);
		} else {
			console.error("Unknown error in updating purchase order", e);
		}
		return res.status(NetworkStatusCode.InternalServerError).json({
			data: null,
			error: "Internal server error. Unable to update purcahse order",
		});
	}
};

export const getPurchaseOrders = async (req: Request, res: Response) => {
	try {
		const purchaseOrders = await db.purchaseOrder.findMany({
			orderBy: { createdAt: "desc" },
		});
		if (!purchaseOrders || !purchaseOrders.length) {
			console.error("Purchase orders not found");
			return res
				.status(NetworkStatusCode.NotFound)
				.json({ data: null, error: "Purchase orders not found" });
		}
		return res
			.status(NetworkStatusCode.Ok)
			.json({ data: purchaseOrders, error: null });
	} catch (e) {
		if (e instanceof Error) {
			console.error("Error in getting purchase order", e.message);
		} else {
			console.error("Unknown error in getting purchase order", e);
		}
		return res.status(NetworkStatusCode.InternalServerError).json({
			data: null,
			error: "Internal server error. Unable to get purcahse order",
		});
	}
};

export const getPurchaseOrderById = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const purchaseOrders = await db.purchaseOrder.findUnique({
			where: {
				id: id as string,
			},
			include: {
				purchaseOrderItems: true,
			},
		});
		if (!purchaseOrders) {
			console.error("Purchase orders not found");
			return res
				.status(NetworkStatusCode.NotFound)
				.json({ data: null, error: "Purchase orders not found" });
		}
		return res
			.status(NetworkStatusCode.Ok)
			.json({ data: purchaseOrders, error: null });
	} catch (e) {
		if (e instanceof Error) {
			console.error("Error in getting purchase order", e.message);
		} else {
			console.error("Unknown error in getting purchase order", e);
		}
		return res.status(NetworkStatusCode.InternalServerError).json({
			data: null,
			error: "Internal server error. Unable to get purcahse order",
		});
	}
};
