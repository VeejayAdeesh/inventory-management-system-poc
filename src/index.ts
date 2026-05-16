import express from "express";
import cors from "cors";
import consumers = require("node:stream/consumers");
import type Request = require("express");
require("dotenv").config();

const app = express();

app.use(cors());

app.use(express.json());

const port = process.env.PORT || 8081;

app.listen(port, () => {
	console.log("App is running in the port ", port);
});

app.get("/customers", async (req: Request, res: Response) => {
	const sampleDate = [
		{
			test: "te212",
		},
	];
	return res.status(200).json(sampleDate);
});
