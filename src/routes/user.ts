import express from "express";
import { createUser, getUsers, getUserById } from "@/controller/user.js";

const userRouter = express.Router();

userRouter.post("/users", createUser);
userRouter.get("/users", getUsers);
userRouter.get("/users/:id", getUserById);

export default userRouter;
