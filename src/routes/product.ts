import {
	createProduct,
	deleteProductById,
	getProductById,
	getProducts,
	updateProduct,
} from "@/controller/product.js";
import express from "express";

const productRouter = express.Router();

productRouter.post("/products", createProduct);
productRouter.put("/products/:id", updateProduct);
productRouter.get("/products/:id", getProductById);
productRouter.get("/products", getProducts);
productRouter.delete("/products/:id", deleteProductById);

export default productRouter;
