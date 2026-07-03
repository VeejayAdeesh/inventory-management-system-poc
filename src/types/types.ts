import { Prisma } from "@/generated/client.js";
import {
	PaymentMethod,
	PaymentType,
	PurchaseOrderPaymentStatus,
	PurchaseOrderStatus,
} from "@/generated/enums.js";

export interface SalesRequest {
	customerId: string;
	shopId: string;
	customerName: string;
	customerEmail: string;
	saleAmount: number;
	paidAmount: number;
	paymentType: PaymentType;
	paymentMethod: PaymentMethod;
	transactionCode: string;
	salesItems: SalesItem[];
}

export interface SalesItem {
	saleId: string;
	productId: string;
	qty: number;
	productPrice: number;
}

export interface AdjustmentRequest {
	reason: string;
	adjustmentItems: AdjustmentItem[];
}

export interface AdjustmentItem {
	adjustmentId: string;
	productId: string;
	quantity: number;
	type: string;
}

export interface PurcahaseOrderRequest {
	supplierId: string;
	paymentStatus: PurchaseOrderPaymentStatus;
	purchaseOrderStatus: PurchaseOrderStatus;
	discount: number;
	notes: string;
	tax: number;
	refNo: string;
	totalAmount: number;
	balanceAmount: number;
	shippingCost: number;
	purchaseOrderItems: PurchaseOrderItem[];
}

export interface PurchaseOrderItem {
	purchaseOrderId: string;
	productId: string;
	orderQty: number;
	unitCost: number;
	subTotal: number;
}

export type PurchaseOrderWithItems = Prisma.PurchaseOrderGetPayload<{
	include: { purchaseOrderItems: true };
}>;
