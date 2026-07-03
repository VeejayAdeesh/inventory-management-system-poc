import { db } from "@/db/db.js";
import { Prisma } from "@/generated/client.js";

export const createNotificationService = async (
	notificationData: Prisma.NotificationCreateInput,
) => {
	try {
		const result = await db.notification.create({ data: notificationData });
		return result;
	} catch (e) {
		throw e;
	}
};
