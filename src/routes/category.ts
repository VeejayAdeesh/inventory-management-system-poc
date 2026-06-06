import {
	createCategory,
	deleteCategoryById,
	getCategoryById,
	getCategoryLists,
	updateCategoryById,
} from "@/controller/category.js";
import express from "express";

const categoryRouter = express.Router();

categoryRouter.post("/category", createCategory);
categoryRouter.put("/category/:id", updateCategoryById);
categoryRouter.get("/category/:id", getCategoryById);
categoryRouter.get("/category", getCategoryLists);
categoryRouter.delete("/category/:id", deleteCategoryById);

export default categoryRouter;
