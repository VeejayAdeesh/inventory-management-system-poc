import { createNotificationService } from "@/services/notificaitonServices.js";
import { NetworkStatusCode, PrismaErrorCode } from "@/utils/errorCode.js";
import { Request, Response } from "express";
import { db } from "@/db/db.js";
import { Prisma } from "@/generated/client.js";

export const createNotification = async (req: Request, res: Response) => {
	try {
		const { message, messageHeader, status, read } = req.body;
		const notificationResult = await createNotificationService({
			message,
			messageHeader,
			status,
			read,
		});
		return res
			.status(NetworkStatusCode.Created)
			.json({ data: notificationResult, error: null });
	} catch (e) {
		if (e instanceof Error) {
			console.error("Error in creating notification", e.message);
		} else {
			console.error("Unknown error in creating notification", e);
		}
		return res
			.status(NetworkStatusCode.InternalServerError)
			.json({ data: null, error: "Internal server error" });
	}
};

export const updateNotficationById = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const { message, messageHeader, status, read } = req.body;
		const notificationUpdateResult = await db.notification.update({
			where: {
				id: id as string,
			},
			data: {
				message,
				messageHeader,
				status,
				read,
			},
		});
		return res
			.status(NetworkStatusCode.Ok)
			.json({ data: notificationUpdateResult, error: null });
	} catch (e) {
		if (e instanceof Prisma.PrismaClientKnownRequestError) {
			console.error("Error in updating prisma in db", e.cause);
			if (e.code === PrismaErrorCode.RecordNotFound) {
				return res
					.status(NetworkStatusCode.NotFound)
					.json({ data: null, error: "Notification data not found" });
			}
		} else if (e instanceof Error) {
			console.error("Error in updating notification", e.message);
		} else {
			console.error("Unknown error in updating notification", e);
		}
		return res
			.status(NetworkStatusCode.InternalServerError)
			.json({ data: null, error: "Internal server error" });
	}
};

export const getNotifications = async (req: Request, res: Response) => {
	try {
		const notificationData = await db.notification.findMany({
			orderBy: {
				createdAt: "desc",
			},
		});
		if (!notificationData || !notificationData.length) {
			console.error("No notification data found in db");
			return res
				.status(NetworkStatusCode.NotFound)
				.json({ data: null, error: "Notification data not found" });
		}
		return res
			.status(NetworkStatusCode.Ok)
			.json({ data: notificationData, error: null });
	} catch (e) {
		if (e instanceof Error) {
			console.error("Error in getting notification", e.message);
		} else {
			console.error("Unknown error in getting notification", e);
		}
		return res
			.status(NetworkStatusCode.InternalServerError)
			.json({ data: null, error: "Internal server error" });
	}
};
