import { PaymentMethod, PaymentType } from "@/generated/enums.js";

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
