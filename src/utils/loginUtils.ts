import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

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
