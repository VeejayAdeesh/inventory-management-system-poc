import {
	createExpenseCategory,
	deleteExpenseCategoryDataById,
	getExpenseCategoryById,
	getExpenseCategoryList,
	updateExpenseCategory,
} from "@/controller/expenseCategory.js";
import express from "express";

const expenseCategoryRouter = express.Router();

expenseCategoryRouter.post("/expense-category", createExpenseCategory);
expenseCategoryRouter.put("/expense-category/:id", updateExpenseCategory);
expenseCategoryRouter.get("/expense-category/:id", getExpenseCategoryById);
expenseCategoryRouter.get("/expense-category", getExpenseCategoryList);
expenseCategoryRouter.delete(
	"/expense-category/:id",
	deleteExpenseCategoryDataById,
);

export default expenseCategoryRouter;
