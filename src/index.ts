import express, { Request, Response } from "express";
import customerRouter from "@/routes/customer.js";
import userRouter from "@/routes/user.js";
import cors from "cors";
import "dotenv/config";
import shopRounter from "@/routes/shop.js";
import supplierRounter from "./routes/supplier.js";
import loginRouter from "./routes/login.js";
import unitsRouter from "./routes/unit.js";
import categoryRouter from "./routes/category.js";
import brandRouter from "./routes/brand.js";
import productRouter from "./routes/product.js";
import saleRouter from "./routes/sales.js";
import payeeRouter from "./routes/payee.js";
import expenseCategoryRouter from "./routes/expenseCategory.js";
import expenseRouter from "./routes/expenses.js";

const app = express();

app.use(cors());

app.use(express.json());

const port = process.env.PORT || 8081;

app.listen(port, () => {
	console.log("App is running in the port ", port);
});

app.get("/", async (req: Request, res: Response) => {
	return res.status(200).send("IMPOS Backend Services");
});

app.use("/api/v1", customerRouter);
app.use("/api/v1", userRouter);
app.use("/api/v1", shopRounter);
app.use("/api/v1", supplierRounter);
app.use("/api/v1", loginRouter);
app.use("/api/v1", unitsRouter);
app.use("/api/v1", categoryRouter);
app.use("/api/v1", brandRouter);
app.use("/api/v1", productRouter);
app.use("/api/v1", saleRouter);
app.use("/api/v1", payeeRouter);
app.use("/api/v1", expenseCategoryRouter);
app.use("/api/v1", expenseRouter);
