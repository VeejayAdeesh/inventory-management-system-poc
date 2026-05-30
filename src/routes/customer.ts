import express from "express";
import {
	getCustomers,
	createCustomer,
	getCustomerById,
} from "@/controller/customer.js";

const customerRouter = express.Router();

customerRouter.get("/customers", getCustomers);
customerRouter.post("/customers", createCustomer);
customerRouter.get("/customers/:id", getCustomerById);

export default customerRouter;
