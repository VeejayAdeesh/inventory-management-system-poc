import { Prisma } from "@/generated/client.js";
import { NetworkStatusCode, PrismaErrorCode } from "@/utils/errorCode.js";
import { Request, Response } from "express";
import { db } from "@/db/db.js";

export const createExpenses = async (req: Request, res: Response) => {
	const {
		title,
		amount,
		expenseDate,
		attachments,
		description,
		payeeId,
		expenseCategoryId,
		shopId,
	} = req.body;
	try {
		const result = await db.expenses.create({
			data: {
				title,
				amount,
				expenseDate,
				attachments,
				description,
				payeeId,
				expenseCategoryId,
				shopId,
			},
		});
		return res
			.status(NetworkStatusCode.Created)
			.json({ data: result, error: null });
	} catch (e) {
		if (e instanceof Error) {
			console.error("Something went wrong while creating expense", e.message);
		} else {
			console.error("Unknown error while creating expense", e);
		}
		return res
			.status(NetworkStatusCode.InternalServerError)
			.json({ data: null, error: "Internal Server Error" });
	}
};

export const updateExpenses = async (req: Request, res: Response) => {
	const { id } = req.params;
	const {
		title,
		amount,
		expenseDate,
		attachments,
		description,
		payeeId,
		expenseCategoryId,
		shopId,
	} = req.body;
	try {
		const result = await db.expenses.update({
			where: {
				id: id as string,
			},
			data: {
				title,
				amount,
				expenseDate,
				attachments,
				description,
				payeeId,
				expenseCategoryId,
				shopId,
			},
		});
		return res.status(NetworkStatusCode.Ok).json({ data: result, error: null });
	} catch (e) {
		if (e instanceof Prisma.PrismaClientKnownRequestError) {
			if (e.code === PrismaErrorCode.RecordNotFound) {
				console.error(`Expenses not found: ${id}`, e.meta);
				return res.status(404).json({ data: null, error: "Expense not found" });
			}
		}
		if (e instanceof Error) {
			console.error("Error in updating expenses data ", e.message);
		} else {
			console.error("Unknown error in updating expenses data ", e);
		}
		return res
			.status(NetworkStatusCode.InternalServerError)
			.json({ data: null, error: "Internal Server Error." });
	}
};

export const getExpenses = async (req: Request, res: Response) => {
	try {
		const result = await db.expenses.findMany({
			orderBy: {
				createdAt: "desc",
			},
		});
		if (!result || !result.length) {
			console.error("No Expenses found in the database");
			return res.status(NetworkStatusCode.NotFound).json({
				data: null,
				error: "No Expenses found in the database",
			});
		}
		return res.status(NetworkStatusCode.Ok).json({ data: result, error: null });
	} catch (e) {
		if (e instanceof Error) {
			console.error("Error in getting expenses data", e.message);
		} else {
			console.error("Unknown error occurred getting expenses data", e);
		}
		return res
			.status(NetworkStatusCode.InternalServerError)
			.json({ data: null, error: "Internal Server error" });
	}
};

export const getExpensesById = async (req: Request, res: Response) => {
	const { id } = req.params;
	try {
		const result = await db.expenses.findUnique({
			where: {
				id: id as string,
			},
		});
		if (!result) {
			console.error(`Expenses not found ${id}`);
			return res
				.status(NetworkStatusCode.NotFound)
				.json({ data: null, error: "Expenses not found" });
		}
		return res.status(NetworkStatusCode.Ok).json({ data: result, error: null });
	} catch (e) {
		if (e instanceof Error) {
			console.error("Error in getting Expenses data by id", e.message);
		} else {
			console.error("Unknown error getting Expenses data by id", e);
		}
		return res
			.status(NetworkStatusCode.InternalServerError)
			.json({ data: null, error: "Internal Server error" });
	}
};

export const deleteExpenseById = async (req: Request, res: Response) => {
	const { id } = req.params;
	try {
		await db.expenses.delete({
			where: {
				id: id as string,
			},
		});
		return res
			.status(NetworkStatusCode.Ok)
			.json({ success: true, error: null });
	} catch (e) {
		if (e instanceof Prisma.PrismaClientKnownRequestError) {
			console.error(`Error in deleting expenses data: ${id}`, e.meta);
			if (e.code === PrismaErrorCode.RelationViolationCode) {
				return res.status(NetworkStatusCode.UnprocessableEntiry).json({
					success: false,
					error: "This action violates a required database relationship",
				});
			}
			if (e.code === PrismaErrorCode.RecordNotFound) {
				return res.status(NetworkStatusCode.UnprocessableEntiry).json({
					success: false,
					error: "No expenses record found",
				});
			}
		}
		if (e instanceof Error) {
			console.error(`Error in deleting expenses data: ${id}`, e.message);
		} else {
			console.error(`Unknown error occurred deleting expense data: ${id}`, e);
		}
		return res
			.status(NetworkStatusCode.InternalServerError)
			.json({ success: false, error: "Internal Server error" });
	}
};
