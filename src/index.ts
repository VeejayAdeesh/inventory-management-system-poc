import express from "express";
import customerRouter from "@/routes/customer.js";
import userRouter from "@/routes/user.js";
import cors from "cors";
import "dotenv/config";
import shopRounter from "@/routes/shop.js";

const app = express();

app.use(cors());

app.use(express.json());

const port = process.env.PORT || 8081;

app.listen(port, () => {
	console.log("App is running in the port ", port);
});

app.use("/api/v1", customerRouter);
app.use("/api/v1", userRouter);
app.use("/api/v1", shopRounter);
