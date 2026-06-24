export const generateSaleNumber = (): string => {
	const ALPHABETS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	const randomNumber = Math.floor(Math.random() * 26) + 1;
	return `${ALPHABETS.charAt(randomNumber)}${Date.now()}`;
};
