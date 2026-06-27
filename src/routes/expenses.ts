import {
	createExpenses,
	deleteExpenseById,
	getExpenses,
	getExpensesById,
	updateExpenses,
} from "@/controller/expenses.js";
import express from "express";

const expenseRouter = express.Router();

expenseRouter.post("/expenses", createExpenses);
expenseRouter.put("/expenses/:id", updateExpenses);
expenseRouter.get("/expenses/:id", getExpensesById);
expenseRouter.get("/expenses", getExpenses);
expenseRouter.delete("/expenses/:id", deleteExpenseById);

export default expenseRouter;
