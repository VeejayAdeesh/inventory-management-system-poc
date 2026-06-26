import {
	createSales,
	getSales,
	getSalesForAllShops,
	getSalesForShop,
} from "@/controller/sales.js";
import express from "express";

const saleRouter = express.Router();

saleRouter.post("/sales", createSales);
saleRouter.get("/sales", getSales);
saleRouter.get("/sales/shops/all", getSalesForAllShops);
saleRouter.get("/sales/shops", getSalesForShop);

export default saleRouter;
