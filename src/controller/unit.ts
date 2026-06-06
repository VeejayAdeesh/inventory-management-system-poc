import { Request, Response } from "express";
import { db } from "@/db/db.js";
import { Prisma } from "@/generated/client.js";
import { PrismaErrorCode, NetworkStatusCode } from "@/utils/errorCode.js";

export const createUnits = async (req: Request, res: Response) => {
	const { name, abbrevation, slug } = req.body;
	try {
		const result = await db.unit.create({
			data: {
				name,
				abbrevation,
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
				const fields = e.meta?.target as string;
				if (fields.includes("slug")) {
					return res
						.status(NetworkStatusCode.Conflit)
						.json({ data: null, error: "Unit name already exit" });
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

export const updateUnitsById = async (req: Request, res: Response) => {
	const { id } = req.params;
	const { name, abbrevation, slug } = req.body;
	try {
		const result = await db.unit.update({
			where: {
				id: id as string,
			},
			data: {
				name,
				abbrevation,
				slug,
			},
		});
		return res.status(NetworkStatusCode.Ok).json({ data: result, error: null });
	} catch (e) {
		if (e instanceof Prisma.PrismaClientKnownRequestError) {
			if (e.code === PrismaErrorCode.RecordNotFound) {
				console.error(`Record not found. ${name}: ${id} already exit`, e.meta);
				return res.status(404).json({ data: null, error: "Record not found" });
			}
			if (e.code === PrismaErrorCode.UniqueContraintFailed) {
				console.error(`Unique key constraint. ${name}: ${id}`, e.meta);
				const fields = e.meta?.target as string;
				if (fields.includes("slug")) {
					return res
						.status(NetworkStatusCode.Conflit)
						.json({ data: null, error: "Unit name already exit" });
				}
			}
		}
		if (e instanceof Error) {
			console.error("Error in updating data ", e.message);
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

export const getUnitsById = async (req: Request, res: Response) => {
	const { id } = req.params;
	try {
		const result = await db.unit.findUnique({
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
		if (e instanceof Error) {
			console.error("Error in retriving data", e.message);
			return res
				.status(NetworkStatusCode.InternalServerError)
				.json({ data: null, error: "Internal Server error" });
		}
		console.error("Unknown error occurred retriving data", e);
		return res
			.status(NetworkStatusCode.InternalServerError)
			.json({ data: null, error: "Internal Server error" });
	}
};

export const getUnits = async (req: Request, res: Response) => {
	try {
		const results = await db.unit.findMany({
			orderBy: {
				createdAt: "desc",
			},
		});
		if (!results || results.length) {
			console.error("Units not found");
			return res
				.status(NetworkStatusCode.NotFound)
				.json({ data: results, error: null });
		}
		return res
			.status(NetworkStatusCode.Ok)
			.json({ data: results, error: null });
	} catch (e) {
		if (e instanceof Error) {
			console.error("Error in retriving data", e.message);
			return res
				.status(NetworkStatusCode.InternalServerError)
				.json({ data: null, error: "Internal Server error" });
		}
		console.error("Unknown error occurred retriving data", e);
		return res
			.status(NetworkStatusCode.InternalServerError)
			.json({ data: null, error: "Internal Server error" });
	}
};

export const deleteUnitById = async (req: Request, res: Response) => {
	const { id } = req.params;
	try {
		await db.unit.delete({
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
				console.error(`Error in deleting unit data: ${id}`, e.meta);
				return res
					.status(NetworkStatusCode.UnprocessableEntiry)
					.json({
						success: false,
						error: "This action violates a required database relationship",
					});
			}
		}
		if (e instanceof Error) {
			console.error(`Error in deleting unit data: ${id}`, e.message);
			return res
				.status(NetworkStatusCode.InternalServerError)
				.json({ data: null, error: "Internal Server error" });
		}
		console.error(`Unknown error occurred deleting unit data: ${id}`, e);
		return res
			.status(NetworkStatusCode.InternalServerError)
			.json({ data: null, error: "Internal Server error" });
	}
};
