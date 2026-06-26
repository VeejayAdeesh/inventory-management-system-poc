import { Request, Response } from "express";
import { db } from "@/db/db.js";
import { SalesItem, SalesRequest } from "@/types/types.js";
import { NetworkStatusCode } from "@/utils/errorCode.js";
import {
	calculatePurchaseBalance,
	generateSaleNumber,
	isCreditEligibility,
} from "@/utils/salesUtils.js";

export const createSales = async (req: Request, res: Response) => {
	const {
		customerId,
		shopId,
		customerName,
		customerEmail,
		saleAmount,
		paidAmount,
		paymentType,
		paymentMethod,
		transactionCode,
		salesItems,
	}: SalesRequest = req.body;
	try {
		const sales = await db.$transaction(async (transaction) => {
			const customerData = await transaction.customer.findFirst({
				where: {
					id: customerId,
				},
				select: { maxCreditLimit: true, unpaidCreditAmount: true },
			});
			if (!customerData) {
				throw new Error("CUSTOMER_NOT_FOUND");
			}
			const balanceAmount = calculatePurchaseBalance(saleAmount, paidAmount);
			if (
				balanceAmount > 0 &&
				!isCreditEligibility(
					customerData?.maxCreditLimit || 0,
					customerData?.unpaidCreditAmount || 0,
					balanceAmount,
				)
			) {
				throw new Error("CREDIT_NOT_ELIGIBLE");
			}
			const salesResult = await transaction.sale.create({
				data: {
					customerId,
					shopId,
					customerName,
					saleNumber: generateSaleNumber(),
					customerEmail,
					saleAmount,
					balanceAmount,
					paidAmount,
					paymentType,
					paymentMethod,
					transactionCode,
				},
			});
			if (!salesResult) {
				return res.status(NetworkStatusCode.InternalServerError).json({
					data: null,
					error: "Internal server error. Unable to process sales request",
				});
			}
			if (balanceAmount && balanceAmount > 0) {
				await transaction.customer.update({
					where: {
						id: customerId as string,
					},
					data: {
						unpaidCreditAmount: {
							increment: balanceAmount,
						},
					},
				});
			}
			for (const item of salesItems as SalesItem[]) {
				const productData = await transaction.product.findUnique({
					where: {
						id: item.productId as string,
					},
					select: {
						stockQty: true,
					},
				});
				if (!productData) {
					throw new Error("PRODUCT_NOT_FOUND");
				}
				if (productData?.stockQty && productData.stockQty < item.qty) {
					console.error(
						`Product: ${item.productId} Reuested Qty: ${item.qty} Available Qty: ${productData.stockQty}`,
					);
					throw new Error("INSUFFICIENT_QTY");
				}
				await transaction.product.update({
					where: {
						id: item.productId as string,
					},
					data: {
						stockQty: {
							decrement: item.qty,
						},
					},
				});
				await transaction.saleItem.create({
					data: {
						saleId: salesResult.id as string,
						productId: item.productId,
						qty: item.qty,
						productPrice: item.productPrice,
					},
				});
			}

			return salesResult;
		});
		return res.status(201).json({ data: sales, error: null });
	} catch (e) {
		if (e instanceof Error) {
			console.error("Error in processing create sales request", e.message);
			switch (e.message) {
				case "PRODUCT_NOT_FOUND":
					return res.status(NetworkStatusCode.NotFound).json({
						data: null,
						error: "Product not found",
					});

				case "CUSTOMER_NOT_FOUND":
					return res.status(NetworkStatusCode.NotFound).json({
						data: null,
						error: "Customer Detail not found",
					});

				case "CREDIT_NOT_ELIGIBLE":
					return res.status(NetworkStatusCode.BadRequest).json({
						data: null,
						error: "Customer not eligible for credit",
					});

				case "INSUFFICIENT_QTY":
					return res.status(NetworkStatusCode.UnprocessableEntiry).json({
						data: null,
						error: "Requested quantity exceeds available inventory",
					});

				default:
					return res.status(NetworkStatusCode.InternalServerError).json({
						data: null,
						error: "Internal server error. Unable to process sales request",
					});
			}
		}
		console.error("Error in processing create sales request", e);
		return res.status(NetworkStatusCode.InternalServerError).json({
			data: null,
			error: "Internal server error. Unable to process sales request",
		});
	}
};

export const getSales = async (req: Request, res: Response) => {
	try {
		const salesResult = await db.sale.findMany({
			orderBy: {
				createdAt: "desc",
			},
			include: {
				salesItems: true,
			},
		});
		if (!salesResult || !salesResult.length) {
			return res
				.status(NetworkStatusCode.NotFound)
				.json({ data: null, error: "No sales data" });
		}
		return res.status(200).json({ data: salesResult, error: null });
	} catch (e) {
		if (e instanceof Error) {
			console.error("Error occured getting sales data", e.message);
			return res
				.status(NetworkStatusCode.InternalServerError)
				.json({ data: null, error: "Internal server error" });
		}
		console.error("Unknown error occured while getting sales data ", e);
		return res
			.status(NetworkStatusCode.InternalServerError)
			.json({ data: null, error: "Internal server error" });
	}
};
