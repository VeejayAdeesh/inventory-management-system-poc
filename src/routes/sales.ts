import { createSales, getSales } from "@/controller/sales.js";
import express from "express";

const saleRouter = express.Router();

saleRouter.post("/sales", createSales);
saleRouter.get("/sales", getSales);

export default saleRouter;
