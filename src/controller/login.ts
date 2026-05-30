import { Request, Response } from "express";
import { db } from "@/db/db.js";
import { generatJwtToken } from "@/utils/loginUtils.js";
import bcrypt from "bcrypt";

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
