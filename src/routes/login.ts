import {
	generateResetToken,
	loginUser,
	updateUserPassword,
	verifyResetToken,
} from "@/controller/login.js";
import express from "express";

const loginRouter = express.Router();

loginRouter.post("/login/auth", loginUser);
loginRouter.post("/login/auth/generate-reset-token", generateResetToken);
loginRouter.post("/login/auth/verify-reset-token", verifyResetToken);
loginRouter.patch("/login/auth/change-password", updateUserPassword);

export default loginRouter;
