import { db } from "@/db/db.js";
import { createNotificationService } from "./notificaitonServices.js";
import {
	Prisma,
	PurchaseOrder,
	PurchaseOrderStatus,
} from "@/generated/client.js";
import { PurchaseOrderWithItems } from "@/types/types.js";

export const sendProductStockForPurchaseNotification = async (
	productIdArr: Array<string>,
) => {
	const productData = await db.product.findMany({
		where: { id: { in: productIdArr } },
		select: {
			alertQty: true,
			stockQty: true,
			name: true,
		},
	});
	if (productData && productData.length) {
		for (const item of productData) {
			if (item.alertQty && item.alertQty >= item.stockQty) {
				createNotificationService({
					message: `${item.name} is less than threshold qty. Place PO for the item ${item.name}`,
					messageHeader: "Stock less then threshold qty",
					status: "DANGER",
				});
			}
		}
	}
};

export const updateProductStockQtyFromPO = async (
	purchaseOrderDetail: PurchaseOrderWithItems,
	purchaseOrderStatus: PurchaseOrderStatus,
) => {
	if (
		purchaseOrderDetail?.purchaseOrderStatus &&
		purchaseOrderDetail.purchaseOrderStatus !== "DELIVERED" &&
		purchaseOrderStatus === "DELIVERED"
	) {
		for (const item of purchaseOrderDetail.purchaseOrderItems) {
			try {
				await db.product.update({
					where: {
						id: item.productId,
					},
					data: {
						stockQty: {
							increment: item.orderQty,
						},
					},
				});
			} catch (e) {
				if (e instanceof Prisma.PrismaClientKnownRequestError) {
					console.error("Error in updating product stock qty", e.cause);
				} else if (e instanceof Error) {
					console.error("Error in updating product stock qty", e.message);
				} else {
					console.error("Unknown error in updating product stock qty", e);
				}
			} finally {
				continue;
			}
		}
	}
	return;
};
