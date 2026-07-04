import {
	createAdjustment,
	getAdjustments,
	getAdjustmentsById,
} from "@/controller/adjustment.js";
import express from "express";

const adjustmentRouter = express.Router();

adjustmentRouter.post("/adjustment", createAdjustment);
adjustmentRouter.get("/adjustment/:id", getAdjustmentsById);
adjustmentRouter.get("/adjustment", getAdjustments);

export default adjustmentRouter;
