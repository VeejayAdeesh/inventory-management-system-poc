import {
	createNotification,
	getNotifications,
	updateNotficationById,
} from "@/controller/notification.js";
import express from "express";

const notificationRouter = express.Router();

notificationRouter.post("/notification", createNotification);
notificationRouter.put("/notification/:id", updateNotficationById);
notificationRouter.get("/notification", getNotifications);

export default notificationRouter;
