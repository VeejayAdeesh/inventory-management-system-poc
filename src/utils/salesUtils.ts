export const generateSaleNumber = (): string => {
	const ALPHABETS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	const randomNumber = Math.floor(Math.random() * 26) + 1;
	return `${ALPHABETS.charAt(randomNumber)}${Date.now()}`;
};

export const calculatePurchaseBalance = (
	saleAmount: number,
	paidAmount: number,
): number => {
	let balanceAmount = 0;
	balanceAmount = saleAmount - paidAmount;
	return balanceAmount;
};

export const isCreditEligibility = (
	maxCreditLimit: number,
	unpaidCreditAmount: number,
	balanceAmount: number,
): boolean => {
	if (
		unpaidCreditAmount + balanceAmount >= maxCreditLimit ||
		balanceAmount >= maxCreditLimit
	) {
		return false;
	}
	return true;
};
