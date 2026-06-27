import { Prisma } from "@/generated/client.js";
import { NetworkStatusCode, PrismaErrorCode } from "@/utils/errorCode.js";
import { Request, Response } from "express";
import { db } from "@/db/db.js";

export const createPayee = async (req: Request, res: Response) => {
	const { name, phone } = req.body;
	try {
		const result = await db.payee.create({
			data: {
				name,
				phone,
			},
		});
		return res
			.status(NetworkStatusCode.Created)
			.json({ data: result, error: null });
	} catch (e) {
		if (e instanceof Prisma.PrismaClientKnownRequestError) {
			if (e.code === PrismaErrorCode.UniqueContraintFailed) {
				console.error(`Unique key constraint. ${phone} already exit`, e.meta);
				const fields = e.meta?.target as Array<string>;
				if (fields.includes("phone")) {
					return res
						.status(NetworkStatusCode.Conflit)
						.json({ data: null, error: "Payee phone already exsist" });
				}
			}
		}
		if (e instanceof Error) {
			console.error("Something went wrong creating payee ", e.message);
		} else {
			console.error("Unknown error ", e);
		}
		return res
			.status(NetworkStatusCode.InternalServerError)
			.json({ data: null, error: "Internal Server Error" });
	}
};

export const updatePayee = async (req: Request, res: Response) => {
	const { id } = req.params;
	const { name, phone } = req.body;
	try {
		const result = await db.payee.update({
			where: {
				id: id as string,
			},
			data: {
				name,
				phone,
			},
		});
		return res.status(NetworkStatusCode.Ok).json({ data: result, error: null });
	} catch (e) {
		if (e instanceof Prisma.PrismaClientKnownRequestError) {
			if (e.code === PrismaErrorCode.RecordNotFound) {
				console.error(`Payee not found. ${name}: ${id}`, e.meta);
				return res.status(404).json({ data: null, error: "Payee not found" });
			}
			if (e.code === PrismaErrorCode.UniqueContraintFailed) {
				console.error(`Unique key constraint. ${phone}: ${id}`, e.meta);
				const fields = e.meta?.target as string;
				if (fields.includes("phone")) {
					return res
						.status(NetworkStatusCode.Conflit)
						.json({ data: null, error: "Payee phone already exsist" });
				}
			}
		}
		if (e instanceof Error) {
			console.error("Error in updating payee data ", e.message);
		} else {
			console.error("Unknown error ", e);
		}
		return res
			.status(NetworkStatusCode.InternalServerError)
			.json({ data: null, error: "Internal Server Error." });
	}
};

export const getPayees = async (req: Request, res: Response) => {
	try {
		const result = await db.payee.findMany({
			orderBy: {
				createdAt: "desc",
			},
		});
		if (!result || !result.length) {
			console.error("No payees found in the database");
			return res
				.status(NetworkStatusCode.NotFound)
				.json({ data: null, error: "No payees found in the database" });
		}
		return res.status(NetworkStatusCode.Ok).json({ data: result, error: null });
	} catch (e) {
		if (e instanceof Error) {
			console.error("Error in payee data", e.message);
		} else {
			console.error("Unknown error occurred payee data", e);
		}
		return res
			.status(NetworkStatusCode.InternalServerError)
			.json({ data: null, error: "Internal Server error" });
	}
};

export const getPayeeById = async (req: Request, res: Response) => {
	const { id } = req.params;
	try {
		const result = await db.payee.findUnique({
			where: {
				id: id as string,
			},
		});
		if (!result) {
			console.error(`Payee not found ${id}`);
			return res
				.status(NetworkStatusCode.NotFound)
				.json({ data: null, error: "Payee not found" });
		}
		return res.status(NetworkStatusCode.Ok).json({ data: result, error: null });
	} catch (e) {
		if (e instanceof Error) {
			console.error("Error in payee data", e.message);
		} else {
			console.error("Unknown error occurred payee data", e);
		}
		return res
			.status(NetworkStatusCode.InternalServerError)
			.json({ data: null, error: "Internal Server error" });
	}
};

export const deletePayeeById = async (req: Request, res: Response) => {
	const { id } = req.params;
	try {
		await db.payee.delete({
			where: {
				id: id as string,
			},
		});
		return res
			.status(NetworkStatusCode.Ok)
			.json({ success: true, error: null });
	} catch (e) {
		if (e instanceof Prisma.PrismaClientKnownRequestError) {
			console.error(`Error in deleting payee data: ${id}`, e.meta);
			if (e.code === PrismaErrorCode.RelationViolationCode) {
				return res.status(NetworkStatusCode.UnprocessableEntiry).json({
					success: false,
					error: "This action violates a required database relationship",
				});
			}
			if (e.code === PrismaErrorCode.RecordNotFound) {
				return res.status(NetworkStatusCode.UnprocessableEntiry).json({
					success: false,
					error: "No payee record found",
				});
			}
		}
		if (e instanceof Error) {
			console.error(`Error in deleting payee data: ${id}`, e.message);
		} else {
			console.error(`Unknown error occurred deleting payee data: ${id}`, e);
		}
		return res
			.status(NetworkStatusCode.InternalServerError)
			.json({ success: false, error: "Internal Server error" });
	}
};
