import express from "express";
import {
	getCustomers,
	createCustomer,
	getCustomerById,
} from "@/controller/customer.js";

const customerRouter = express.Router();

customerRouter.get("/customers", getCustomers);
customerRouter.post("/customer", createCustomer);
customerRouter.get("/customer/:id", getCustomerById);

export default customerRouter;
