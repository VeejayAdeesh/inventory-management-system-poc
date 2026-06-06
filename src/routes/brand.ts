import {
	createBrand,
	deleteBrandById,
	getBrandById,
	getBrands,
	updateBrandById,
} from "@/controller/brand.js";
import express from "express";

const brandRouter = express.Router();

brandRouter.post("/brands", createBrand);
brandRouter.put("/brands/:id", updateBrandById);
brandRouter.get("/brands/:id", getBrandById);
brandRouter.get("/brands", getBrands);
brandRouter.delete("/brands/:id", deleteBrandById);

export default brandRouter;
