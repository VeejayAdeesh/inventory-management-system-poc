import express from "express";
import {
	createUser,
	getUsers,
	getUserById,
	deleteUser,
	updateUserPassword,
} from "@/controller/user.js";

const userRouter = express.Router();

userRouter.post("/users", createUser);
userRouter.get("/users", getUsers);
userRouter.get("/users/:id", getUserById);
userRouter.delete("/users/:id", deleteUser);
userRouter.put("/users/:id/password", updateUserPassword);

export default userRouter;
