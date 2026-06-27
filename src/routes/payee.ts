import {
	createPayee,
	deletePayeeById,
	getPayeeById,
	getPayees,
	updatePayee,
} from "@/controller/payee.js";
import express from "express";

const payeeRouter = express.Router();

payeeRouter.post("/payee", createPayee);
payeeRouter.put("/payee/:id", updatePayee);
payeeRouter.get("/payee/:id", getPayeeById);
payeeRouter.get("/payee", getPayees);
payeeRouter.delete("/payee/:id", deletePayeeById);

export default payeeRouter;
