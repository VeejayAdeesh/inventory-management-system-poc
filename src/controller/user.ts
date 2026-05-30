import { Request, Response } from "express";
import { db } from "@/db/db.js";
import bcrypt from "bcrypt";
import { error } from "node:console";

const checkExistingUser = async (userId: string) => {
	try {
		const existingUser = await db.user.findUnique({
			where: {
				id: userId,
			},
		});
		if (!existingUser) {
			return { userData: null, message: "user data not found" };
		}
		return { userData: existingUser, message: null };
	} catch (e) {
		if (e instanceof Error) {
			console.error("Error in finding existing user exist or not", e.message);
			return {
				userData: null,
				message: "Error in finding existing user exist",
			};
		}
		return { userData: null, error: "Unknown error" };
	}
};

export const createUser = async (req: Request, res: Response) => {
	const {
		username,
		password,
		firstname,
		lastname,
		email,
		phone,
		dob,
		role,
		gender,
		image = "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png",
	} = req.body;
	try {
		const hashedPassowrd: string = await bcrypt.hash(password, 10);
		const result = await db.user.create({
			data: {
				username,
				password: hashedPassowrd,
				firstname,
				lastname,
				email,
				phone,
				dob,
				role,
				gender,
				image,
			},
		});
		const { password: userPassword, ...others } = result;
		return res.status(201).json({ data: others, error: null });
	} catch (e) {
		if (e instanceof Error) {
			if (
				e.message.includes(
					"Unique constraint failed on the constraint: `User_username_key`",
				)
			) {
				return res.status(409).json({
					error: "User name already exist",
					data: null,
				});
			}
			if (
				e.message.includes(
					"Unique constraint failed on the constraint: `User_phone_key`",
				)
			) {
				return res.status(409).json({
					error: "User phone already exist",
					data: null,
				});
			}
			if (
				e.message.includes(
					"Unique constraint failed on the constraint: `User_email_key`",
				)
			) {
				return res.status(409).json({
					error: "User email already exist",
					data: null,
				});
			}
			console.error("Error in creating user", e.message);
			return res.status(500).json({
				error: e.message || "Internal serer error",
				data: null,
			});
		}
		return res.status(500).json({ error: "Unknown error", data: null });
	}
};

export const getUserById = async (req: Request, res: Response) => {
	const id = req.params.id as string;
	try {
		const result = await db.user.findUnique({
			where: {
				id,
			},
		});
		const { password: userPassword, ...others } = result;
		return res.status(200).json({ data: others, error: null });
	} catch (e) {
		if (e instanceof Error) {
			console.error("Error in fetching user ", e);
			return res.status(500).json({
				error: "Error getting user details",
				data: null,
			});
		}
		return res.status(500).json({ error: "Unknown error", data: null });
	}
};

export const getUsers = async (req: Request, res: Response) => {
	try {
		const result = await db.user.findMany({
			orderBy: {
				createdAt: "desc",
			},
		});
		if (!result) {
			return res.status(404).json({
				error: "User not found",
				data: null,
			});
		}
		const formatUserData = result.map((val: any) => {
			const { password, ...others } = val;
			return others;
		});
		return res.status(200).json({ data: formatUserData, error: null });
	} catch (e) {
		if (e instanceof Error) {
			console.error("Error in getting user details", e.message);
			return res.status(500).json({
				error: "Error in getting user details",
				data: null,
			});
		}
		return res.status(500).json({ error: "Unknown error", data: null });
	}
};

export const deleteUser = async (req: Request, res: Response) => {
	const { id } = req.params;
	try {
		const { userData } = await checkExistingUser(id as string);
		if (userData) {
			await db.user.delete({
				where: {
					id,
				},
			});
			return res.status(200).json({
				success: true,
				error: null,
			});
		}
	} catch (e) {
		if (e instanceof Error) {
			console.error("Error in deleteing user", e.message);
			if (e.message.includes("user data not found")) {
				return res
					.status(404)
					.json({ success: false, error: "User not found" });
			}
			return res.status(500).json({
				success: false,
				error: "Internal server error",
			});
		}
		return res.status(500).json({ error: "Unknown error", success: false });
	}
};

export const updateUserPassword = async (req: Request, res: Response) => {
	const { id } = req.params;
	const { password } = req.body;
	try {
		const { userData } = await checkExistingUser(id);
		if (userData) {
			const hashedPassowrd: string = await bcrypt.hash(password, 10);
			await db.user.update({
				where: {
					id,
				},
				data: {
					password: hashedPassowrd,
				},
			});
			return res.status(200).json({ success: true, error: null });
		}
	} catch (e) {
		if (e instanceof Error) {
			console.error("Error in updating user password", e.message);
			if (e.message.includes("user data not found")) {
				return res
					.status(404)
					.json({ success: false, error: "User not found" });
			}
			return res.status(500).json({
				success: false,
				error: "Internal server error",
			});
		}
		return res.status(500).json({ success: false, error: "Unknown error" });
	}
};
