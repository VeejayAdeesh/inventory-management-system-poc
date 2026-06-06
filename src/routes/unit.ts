import {
	createUnits,
	deleteUnitById,
	getUnits,
	getUnitsById,
	updateUnitsById,
} from "@/controller/unit.js";
import express from "express";

const unitsRouter = express.Router();

unitsRouter.post("/units", createUnits);
unitsRouter.put("/units/:id", updateUnitsById);
unitsRouter.get("/units", getUnits);
unitsRouter.get("/units/:id", getUnitsById);
unitsRouter.delete("/units/:id", deleteUnitById);

export default unitsRouter;
