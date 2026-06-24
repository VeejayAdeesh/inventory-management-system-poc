import { Request, Response } from "express";
import { db } from "@/db/db.js";
import {
	generateSecureRandomToken,
	generatJwtToken,
} from "@/utils/loginUtils.js";
import bcrypt from "bcrypt";
import { NetworkStatusCode } from "@/utils/errorCode.js";
import { addMinutes } from "date-fns";

export const loginUser = async (req: Request, res: Response) => {
	try {
		const { email, username, password } = req.body;
		let existingUser = null;
		if (email) {
			existingUser = await db.user.findUnique({
				where: {
					email,
				},
			});
		} else if (username) {
			existingUser = await db.user.findUnique({
				where: {
					username,
				},
			});
		} else {
			console.error("Missing username/email");
			return res.status(404).json({ error: "Invalid request", data: null });
		}
		if (!existingUser) {
			console.error("Invalid credentials");
			return res.status(401).json({ error: "wrong credentials", data: null });
		}
		const passwordMatch = await bcrypt.compare(password, existingUser.password);
		if (!passwordMatch) {
			return res.status(401).json({ error: "wrong credentials", data: null });
		}
		const { password: userPassword, ...userDataWithoutPassword } = existingUser;
		const accessToken = generatJwtToken(userDataWithoutPassword);
		return res
			.setHeader("IMPOS-TOKEN", accessToken)
			.status(200)
			.json({ data: "Login Success", error: null });
	} catch (e) {
		if (e instanceof Error) {
			console.error("Error in login", e.message);
			return res
				.status(500)
				.json({ error: "Internal Server error", data: null });
		}
		console.error("Unknown error", e);
		return res.status(500).json({ error: "Unknown error", data: null });
	}
};

export const generateResetToken = async (req: Request, res: Response) => {
	try {
		const { email } = req.body;
		const user = await db.user.findUnique({ where: { email } });
		if (!user) {
			return res
				.status(NetworkStatusCode.NotFound)
				.json({ data: null, error: "User not found" });
		}
		const resetToken = generateSecureRandomToken();
		const resetTokenExpiry = addMinutes(new Date(), 10);
		await db.user.update({
			where: { id: user.id, email },
			data: { resetToken, resetTokenExpiry },
		});
		return res.status(NetworkStatusCode.Created).json({
			data: { resetToken, resetTokenExpiry, userId: user.id },
			error: null,
		});
	} catch (e) {
		if (e instanceof Error) {
			console.error("Error in generating reset token", e.message);
			return res
				.status(NetworkStatusCode.InternalServerError)
				.json({ data: null, error: "Internal Server error" });
		}
		console.error("Unknown error", e);
		return res
			.status(NetworkStatusCode.InternalServerError)
			.json({ data: null, error: "Unknown error" });
	}
};

export const verifyResetToken = async (req: Request, res: Response) => {
	try {
		const { email, userId, resetToken } = req.body;
		const resultant = await db.user.findFirst({
			where: {
				email,
				id: userId,
				resetToken,
				resetTokenExpiry: { gte: new Date() },
			},
		});
		if (!resultant) {
			return res
				.status(NetworkStatusCode.BadRequest)
				.json({ data: false, error: "Invalid token or token expired" });
		}
		return res.status(NetworkStatusCode.Ok).json({ data: true, error: null });
	} catch (e) {
		if (e instanceof Error) {
			console.error("Error in validating the reset token ", e.message);
		}
		console.error("Unknown error", e);
		return res
			.status(NetworkStatusCode.InternalServerError)
			.json({ data: false, error: "Unknown Error" });
	}
};

export const updateUserPassword = async (req: Request, res: Response) => {
	try {
		const { userId, newPassword } = req.body;
		const hashedPassowrd = await bcrypt.hash(newPassword, 10);
		await db.user.update({
			where: { id: userId },
			data: {
				password: hashedPassowrd,
				resetToken: null,
				resetTokenExpiry: null,
			},
		});
		return res.status(NetworkStatusCode.Ok).json({ data: true, error: null });
	} catch (e) {
		if (e instanceof Error) {
			console.error("Error in updating user password", e.message);
			return res
				.status(NetworkStatusCode.InternalServerError)
				.json({ data: false, error: "Internal Server error" });
		}
		console.error("Unknown error", e);
		return res
			.status(NetworkStatusCode.InternalServerError)
			.json({ data: false, error: "Unknown error" });
	}
};
