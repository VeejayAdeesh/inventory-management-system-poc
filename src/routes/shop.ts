import {
	createShops,
	getAttendantsByShop,
	getShops,
	getShopsById,
} from "@/controller/shop.js";
import express from "express";

const shopRounter = express.Router();

shopRounter.post("/shops", createShops);
shopRounter.get("/shops", getShops);
shopRounter.get("/shops/:id/attendants", getAttendantsByShop);
shopRounter.get("/shops/:id", getShopsById);

export default shopRounter;
