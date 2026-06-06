import { Request, Response } from "express";
import { db } from "@/db/db.js";
import { NetworkStatusCode, PrismaErrorCode } from "@/utils/errorCode.js";
import { Prisma } from "@/generated/client.js";

export const createProduct = async (req: Request, res: Response) => {
	const {
		name,
		description,
		batchNumber,
		barcode,
		image,
		tax,
		sku,
		alertQty,
		stockQty,
		productCode,
		price,
		buyingPrice,
		slug,
		supplierId,
		unitId,
		brandId,
		categoryId,
		expiryDate,
	} = req.body;
	try {
		const result = await db.product.create({
			data: {
				name,
				description,
				batchNumber,
				barcode,
				image,
				tax,
				sku,
				alertQty,
				stockQty,
				productCode,
				price,
				buyingPrice,
				slug,
				supplierId,
				unitId,
				brandId,
				categoryId,
				expiryDate,
			},
		});
		return res.status(NetworkStatusCode.Ok).json({ data: result, error: null });
	} catch (e) {
		if (e instanceof Prisma.PrismaClientKnownRequestError) {
			if (e.code === PrismaErrorCode.UniqueContraintFailed) {
				const fields = e.meta?.target as string;
				if (fields.includes("slug")) {
					console.error(`Unique key constraint. ${slug} already exit`, e.meta);
					return res
						.status(NetworkStatusCode.Conflit)
						.json({ data: null, error: `${slug} alreay exist` });
				}
				if (fields.includes("sku")) {
					console.error(`Unique key constraint. ${sku} already exit`, e.meta);
					return res
						.status(NetworkStatusCode.Conflit)
						.json({ data: null, error: `${sku} alreay exist` });
				}
				if (fields.includes("productCode")) {
					console.error(
						`Unique key constraint. ${productCode} already exit`,
						e.meta,
					);
					return res
						.status(NetworkStatusCode.Conflit)
						.json({ data: null, error: `${productCode} alreay exist` });
				}
				if (fields.includes("barcode")) {
					console.error(
						`Unique key constraint. ${barcode} already exit`,
						e.meta,
					);
					return res
						.status(NetworkStatusCode.Conflit)
						.json({ data: null, error: `${barcode} alreay exist` });
				}
			}
		}
		if (e instanceof Error) {
			console.error("Error occured while creating product ", e.message);
			return res
				.status(NetworkStatusCode.InternalServerError)
				.json({ data: null, error: "Internal server error" });
		}
		console.error("Unknown error occured while creating product ", e);
		return res
			.status(NetworkStatusCode.InternalServerError)
			.json({ data: null, error: "Internal server error" });
	}
};

export const updateProduct = async (req: Request, res: Response) => {
	const { id } = req.params;
	const {
		name,
		description,
		batchNumber,
		barcode,
		image,
		tax,
		sku,
		alertQty,
		stockQty,
		productCode,
		price,
		buyingPrice,
		slug,
		supplierId,
		unitId,
		brandId,
		categoryId,
		expiryDate,
	} = req.body;
	try {
		const result = await db.product.update({
			where: {
				id: id as string,
			},
			data: {
				name,
				description,
				batchNumber,
				barcode,
				image,
				tax,
				sku,
				alertQty,
				stockQty,
				productCode,
				price,
				buyingPrice,
				slug,
				supplierId,
				unitId,
				brandId,
				categoryId,
				expiryDate,
			},
		});
		return res.status(NetworkStatusCode.Ok).json({ data: result, error: null });
	} catch (e) {
		if (e instanceof Prisma.PrismaClientKnownRequestError) {
			if (e.code === PrismaErrorCode.RecordNotFound) {
				console.error(`Product not found. ${name} : ${id}`);
				return res
					.status(NetworkStatusCode.NotFound)
					.json({ data: null, error: "Product not found" });
			}
			if (e.code === PrismaErrorCode.UniqueContraintFailed) {
				const fields = e.meta?.target as Array<string>;
				if (fields.includes("slug")) {
					console.error(`Unique key constraint. ${slug} already exit`);
					return res
						.status(NetworkStatusCode.Conflit)
						.json({ data: null, error: `${slug} alreay exist` });
				}
				if (fields.includes("sku")) {
					console.error(`Unique key constraint. ${sku} already exit`);
					return res
						.status(NetworkStatusCode.Conflit)
						.json({ data: null, error: `${sku} alreay exist` });
				}
				if (fields.includes("productCode")) {
					console.error(`Unique key constraint. ${productCode} already exit`);
					return res
						.status(NetworkStatusCode.Conflit)
						.json({ data: null, error: `${productCode} alreay exist` });
				}
				if (fields.includes("barcode")) {
					console.error(`Unique key constraint. ${barcode} already exit`);
					return res
						.status(NetworkStatusCode.Conflit)
						.json({ data: null, error: `${barcode} alreay exist` });
				}
			}
		}
		if (e instanceof Error) {
			console.error("Error occured while updating product ", e.message);
			return res
				.status(NetworkStatusCode.InternalServerError)
				.json({ data: null, error: "Internal server error" });
		}
		console.error("Unknown error occured while updating product ", e);
		return res
			.status(NetworkStatusCode.InternalServerError)
			.json({ data: null, error: "Internal server error" });
	}
};

export const getProducts = async (req: Request, res: Response) => {
	try {
		const result = await db.product.findMany({
			orderBy: {
				createdAt: "desc",
			},
		});
		if (!result || !result.length) {
			console.error("Products not found");
			return res
				.status(NetworkStatusCode.NotFound)
				.json({ data: null, error: "Products not found" });
		}
		return res.status(NetworkStatusCode.Ok).json({ data: result, error: null });
	} catch (e) {
		if (e instanceof Error) {
			console.error("Error occured getting products", e.message);
			return res
				.status(NetworkStatusCode.InternalServerError)
				.json({ data: null, error: "Internal server error" });
		}
		console.error("Unknown error occured while getting product ", e);
		return res
			.status(NetworkStatusCode.InternalServerError)
			.json({ data: null, error: "Internal server error" });
	}
};

export const getProductById = async (req: Request, res: Response) => {
	const { id } = req.params;
	try {
		const result = await db.product.findUnique({
			where: {
				id: id as string,
			},
		});
		if (!result) {
			console.error(`Record not found ${id}`);
			return res
				.status(NetworkStatusCode.NotFound)
				.json({ data: null, error: "Record not found" });
		}
		return res.status(NetworkStatusCode.Ok).json({ data: result, error: null });
	} catch (e) {
		if (e instanceof Prisma.PrismaClientKnownRequestError) {
			if (e.code === PrismaErrorCode.RecordNotFound) {
				console.error(`Product not found: ${id}`);
				return res
					.status(NetworkStatusCode.NotFound)
					.json({ data: null, error: "Product not found" });
			}
		}
		if (e instanceof Error) {
			console.error("Error occured getting products", e.message);
			return res
				.status(NetworkStatusCode.InternalServerError)
				.json({ data: null, error: "Internal server error" });
		}
		console.error("Unknown error occured while getting product ", e);
		return res
			.status(NetworkStatusCode.InternalServerError)
			.json({ data: null, error: "Internal server error" });
	}
};

export const deleteProductById = async (req: Request, res: Response) => {
	const { id } = req.params;
	try {
		await db.product.delete({
			where: {
				id: id as string,
			},
		});
		return res
			.status(NetworkStatusCode.Ok)
			.json({ success: true, error: null });
	} catch (e) {
		if (e instanceof Prisma.PrismaClientKnownRequestError) {
			if (e.code === PrismaErrorCode.RecordNotFound) {
				console.error(`Product not found: ${id}`);
				return res
					.status(NetworkStatusCode.NotFound)
					.json({ success: false, error: "Product not found" });
			}
		}
		if (e instanceof Error) {
			console.error("Error occured getting products", e.message);
			return res
				.status(NetworkStatusCode.InternalServerError)
				.json({ success: false, error: "Internal server error" });
		}
		console.error("Unknown error occured while getting product ", e);
		return res
			.status(NetworkStatusCode.InternalServerError)
			.json({ success: false, error: "Internal server error" });
	}
};
