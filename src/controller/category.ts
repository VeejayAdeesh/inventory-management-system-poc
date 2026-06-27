import { Request, Response } from "express";
import { db } from "@/db/db.js";
import { Prisma } from "@/generated/client.js";
import { PrismaErrorCode, NetworkStatusCode } from "@/utils/errorCode.js";

export const createCategory = async (req: Request, res: Response) => {
	const { name, slug } = req.body;
	try {
		const result = await db.category.create({
			data: {
				name,
				slug,
			},
		});
		return res
			.status(NetworkStatusCode.Created)
			.json({ data: result, error: null });
	} catch (e) {
		if (e instanceof Prisma.PrismaClientKnownRequestError) {
			if (e.code === PrismaErrorCode.UniqueContraintFailed) {
				console.error(`Unique key constraint. ${name} already exit`, e.meta);
				const fields = e.meta?.target as Array<string>;
				if (fields.includes("slug")) {
					return res
						.status(NetworkStatusCode.Conflit)
						.json({ data: null, error: "Category name already exit" });
				}
			}
		}
		if (e instanceof Error) {
			console.error("Unknown error ", e.message);
			return res
				.status(NetworkStatusCode.InternalServerError)
				.json({ data: null, error: "Internal Server Error." });
		}
		return res
			.status(NetworkStatusCode.InternalServerError)
			.json({ data: null, error: "Unknown error" });
	}
};

export const updateCategoryById = async (req: Request, res: Response) => {
	const { id } = req.params;
	const { name, slug } = req.body;
	try {
		const result = await db.category.update({
			where: {
				id: id as string,
			},
			data: {
				name,
				slug,
			},
		});
		return res.status(NetworkStatusCode.Ok).json({ data: result, error: null });
	} catch (e) {
		if (e instanceof Prisma.PrismaClientKnownRequestError) {
			if (e.code === PrismaErrorCode.RecordNotFound) {
				console.error(
					`Category not found. ${name}: ${id} already exit`,
					e.meta,
				);
				return res
					.status(404)
					.json({ data: null, error: "Category not found" });
			}
			if (e.code === PrismaErrorCode.UniqueContraintFailed) {
				console.error(`Unique key constraint. ${name}: ${id}`, e.meta);
				const fields = e.meta?.target as string;
				if (fields.includes("slug")) {
					return res
						.status(NetworkStatusCode.Conflit)
						.json({ data: null, error: "Category name already exit" });
				}
			}
		}
		if (e instanceof Error) {
			console.error("Error in categroy data ", e.message);
			return res
				.status(NetworkStatusCode.InternalServerError)
				.json({ data: null, error: "Internal Server Error." });
		}
		console.error("Unknown error ", e);
		return res
			.status(NetworkStatusCode.InternalServerError)
			.json({ data: null, error: "Unknown error" });
	}
};

export const getCategoryById = async (req: Request, res: Response) => {
	const { id } = req.params;
	try {
		const result = await db.category.findUnique({
			where: {
				id: id as string,
			},
		});
		if (!result) {
			console.error(`Category not found ${id}`);
			return res
				.status(NetworkStatusCode.NotFound)
				.json({ data: null, error: "Category not found" });
		}
		return res.status(NetworkStatusCode.Ok).json({ data: result, error: null });
	} catch (e) {
		if (e instanceof Error) {
			console.error("Error in category data", e.message);
			return res
				.status(NetworkStatusCode.InternalServerError)
				.json({ data: null, error: "Internal Server error" });
		}
		console.error("Unknown error occurred category data", e);
		return res
			.status(NetworkStatusCode.InternalServerError)
			.json({ data: null, error: "Internal Server error" });
	}
};

export const getCategoryLists = async (req: Request, res: Response) => {
	try {
		const results = await db.category.findMany({
			orderBy: {
				createdAt: "desc",
			},
		});
		if (!results || !results.length) {
			console.error("Category not found");
			return res
				.status(NetworkStatusCode.NotFound)
				.json({ data: null, error: "Category not found" });
		}
		return res
			.status(NetworkStatusCode.Ok)
			.json({ data: results, error: null });
	} catch (e) {
		if (e instanceof Error) {
			console.error("Error in category data", e.message);
			return res
				.status(NetworkStatusCode.InternalServerError)
				.json({ data: null, error: "Internal Server error" });
		}
		console.error("Unknown error occurred category data", e);
		return res
			.status(NetworkStatusCode.InternalServerError)
			.json({ data: null, error: "Internal Server error" });
	}
};

export const deleteCategoryById = async (req: Request, res: Response) => {
	const { id } = req.params;
	try {
		await db.category.delete({
			where: {
				id: id as string,
			},
		});
		return res
			.status(NetworkStatusCode.Ok)
			.json({ success: true, error: null });
	} catch (e) {
		if (e instanceof Prisma.PrismaClientKnownRequestError) {
			if (e.code === PrismaErrorCode.RelationViolationCode) {
				console.error(`Error in deleting category data: ${id}`, e.meta);
				return res.status(NetworkStatusCode.UnprocessableEntiry).json({
					success: false,
					error: "This action violates a required database relationship",
				});
			}
		}
		if (e instanceof Error) {
			console.error(`Error in deleting category data: ${id}`, e.message);
			return res
				.status(NetworkStatusCode.InternalServerError)
				.json({ success: null, error: "Internal Server error" });
		}
		console.error(`Unknown error occurred deleting category data: ${id}`, e);
		return res
			.status(NetworkStatusCode.InternalServerError)
			.json({ success: null, error: "Internal Server error" });
	}
};
