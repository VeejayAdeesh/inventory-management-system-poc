import { Prisma } from "@/generated/client.js";
import { NetworkStatusCode, PrismaErrorCode } from "@/utils/errorCode.js";
import { Request, Response } from "express";
import { db } from "@/db/db.js";

export const createExpenseCategory = async (req: Request, res: Response) => {
	const { name, slug } = req.body;
	try {
		const result = await db.expenseCategory.create({
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
				console.error(`Unique key constraint. ${slug} already exit`, e.meta);
				const fields = e.meta?.target as Array<string>;
				if (fields.includes("slug")) {
					return res
						.status(NetworkStatusCode.Conflit)
						.json({ data: null, error: "Expense Category already exsist" });
				}
			}
		}
		if (e instanceof Error) {
			console.error(
				"Something went wrong creating expense category ",
				e.message,
			);
		} else {
			console.error("Unknown error ", e);
		}
		return res
			.status(NetworkStatusCode.InternalServerError)
			.json({ data: null, error: "Internal Server Error" });
	}
};

export const updateExpenseCategory = async (req: Request, res: Response) => {
	const { id } = req.params;
	const { name, slug } = req.body;
	try {
		const result = await db.expenseCategory.update({
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
				console.error(`Expense Category not found. ${name}: ${id}`, e.meta);
				return res
					.status(404)
					.json({ data: null, error: "Expense Category not found" });
			}
			if (e.code === PrismaErrorCode.UniqueContraintFailed) {
				console.error(`Unique key constraint. ${slug}: ${id}`, e.meta);
				const fields = e.meta?.target as string;
				if (fields.includes("slug")) {
					return res
						.status(NetworkStatusCode.Conflit)
						.json({ data: null, error: "Expense Category already exsist" });
				}
			}
		}
		if (e instanceof Error) {
			console.error("Error in updating expense category data ", e.message);
		} else {
			console.error("Unknown error in updating expense category data ", e);
		}
		return res
			.status(NetworkStatusCode.InternalServerError)
			.json({ data: null, error: "Internal Server Error." });
	}
};

export const getExpenseCategoryList = async (req: Request, res: Response) => {
	try {
		const result = await db.expenseCategory.findMany({
			orderBy: {
				createdAt: "desc",
			},
		});
		if (!result || !result.length) {
			console.error("No Expense category found in the database");
			return res
				.status(NetworkStatusCode.NotFound)
				.json({
					data: null,
					error: "No Expense Category found in the database",
				});
		}
		return res.status(NetworkStatusCode.Ok).json({ data: result, error: null });
	} catch (e) {
		if (e instanceof Error) {
			console.error("Error in getting expense category data", e.message);
		} else {
			console.error("Unknown error occurred getting expense category data", e);
		}
		return res
			.status(NetworkStatusCode.InternalServerError)
			.json({ data: null, error: "Internal Server error" });
	}
};

export const getExpenseCategoryById = async (req: Request, res: Response) => {
	const { id } = req.params;
	try {
		const result = await db.expenseCategory.findUnique({
			where: {
				id: id as string,
			},
		});
		if (!result) {
			console.error(`Expense Category not found ${id}`);
			return res
				.status(NetworkStatusCode.NotFound)
				.json({ data: null, error: "Expense Category not found" });
		}
		return res.status(NetworkStatusCode.Ok).json({ data: result, error: null });
	} catch (e) {
		if (e instanceof Error) {
			console.error("Error in getting Expense Category data by id", e.message);
		} else {
			console.error("Unknown error getting Expense Category data by id", e);
		}
		return res
			.status(NetworkStatusCode.InternalServerError)
			.json({ data: null, error: "Internal Server error" });
	}
};

export const deleteExpenseCategoryDataById = async (
	req: Request,
	res: Response,
) => {
	const { id } = req.params;
	try {
		await db.expenseCategory.delete({
			where: {
				id: id as string,
			},
		});
		return res
			.status(NetworkStatusCode.Ok)
			.json({ success: true, error: null });
	} catch (e) {
		if (e instanceof Prisma.PrismaClientKnownRequestError) {
            console.error(`Error in deleting expense category data: ${id}`, e.meta);
			if (e.code === PrismaErrorCode.RelationViolationCode) {				
				return res.status(NetworkStatusCode.UnprocessableEntiry).json({
					success: false,
					error: "This action violates a required database relationship",
				});
            }
            if (e.code === PrismaErrorCode.RecordNotFound) {
				return res.status(NetworkStatusCode.UnprocessableEntiry).json({
					success: false,
					error: "No expense category record found",
				});
			}
		}
		if (e instanceof Error) {
			console.error(
				`Error in deleting expense category data: ${id}`,
				e.message,
			);
		} else {
			console.error(
				`Unknown error occurred deleting expense category data: ${id}`,
				e,
			);
		}
		return res
			.status(NetworkStatusCode.InternalServerError)
			.json({ success: false, error: "Internal Server error" });
	}
};
