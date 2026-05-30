import {
	createSupplier,
	getSupplierById,
	getSuppliers,
} from "@/controller/suppplier.js";
import express from "express";

const supplierRounter = express.Router();

supplierRounter.post("/suppliers", createSupplier);
supplierRounter.get("/suppliers", getSuppliers);
supplierRounter.get("/suppliers/:id", getSupplierById);

export default supplierRounter;
