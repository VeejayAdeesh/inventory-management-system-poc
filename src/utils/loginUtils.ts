import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import crypto from "crypto";

const DEFAULT_SIGN_OPTION: SignOptions = {
	expiresIn: "7h",
};

export const generatJwtToken = (
	payload: JwtPayload,
	options: SignOptions = DEFAULT_SIGN_OPTION,
) => {
	const secretKey = process.env.SECRET_KEY as string;
	if (!secretKey) {
		throw new Error("Secret key not configured");
	}
	const accessToken = jwt.sign(payload, secretKey, options);
	return accessToken;
};

export const generateSecureRandomToken = () => {
	const MIN_VALUE = 100000;
	const MAX_VALUE = 999999;
	const range = MAX_VALUE - MIN_VALUE + 1;
	const bytes = new Uint32Array(1);
	crypto.getRandomValues(bytes);
	const firstByte = bytes[0] ?? 0;
	return MIN_VALUE + (firstByte % range);
};
