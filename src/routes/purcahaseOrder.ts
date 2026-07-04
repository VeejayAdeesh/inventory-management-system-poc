import {
	createPurchaseOrder,
	getPurchaseOrderById,
	getPurchaseOrders,
	updatePurchaseOrderById,
} from "@/controller/purchaseOrder.js";
import express from "express";

const purchaseOrderRouter = express.Router();

purchaseOrderRouter.post("/purchase-order", createPurchaseOrder);
purchaseOrderRouter.get("/purchase-order/:id", getPurchaseOrderById);
purchaseOrderRouter.get("/purchase-order", getPurchaseOrders);
purchaseOrderRouter.put("/purchase-order/:id", updatePurchaseOrderById);

export default purchaseOrderRouter;
