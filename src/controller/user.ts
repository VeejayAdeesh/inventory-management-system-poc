import { Request, Response } from "express";
import { db } from "@/db/db.js";
import bcrypt from "bcrypt";
import { error } from "node:console";

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
		const result = await db.User.create({
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
};

export const getUserById = async (req: Request, res: Response) => {
	const { id } = req.params;
	try {
		const result = await db.User.findUnique({
			where: {
				id,
			},
		});
		const { password: userPassword, ...others } = result;
		return res.status(200).json({ data: others, error: null });
	} catch (e) {
		console.error("Error in fetching user ", e);
		return res.status(500).json({
			error: "Error getting user details",
			data: null,
		});
	}
};

export const getUsers = async (req: Request, res: Response) => {
	try {
		const result = await db.User.findMany({
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
		const formatUserData = result.map((val) => {
			const { password, ...others } = val;
			return others;
		});
		return res.status(200).json({ data: formatUserData, error: null });
	} catch (e) {
		console.error("Error in getting user details", e.message);
		return res.status(500).json({
			error: "Error in getting user details",
			data: null,
		});
	}
};
