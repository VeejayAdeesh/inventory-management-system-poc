import { rateLimit } from "express-rate-limit";

export const strictRateLimiter = rateLimit({
	windowMs: Number(process.env.STRICT_TIME_LIMIT) * 60 * 1000,
	limit: Number(process.env.STRICT_REQUEST_LIMIT),
	standardHeaders: "draft-8",
	legacyHeaders: false,
    ipv6Subnet: 56
});

export const linientRateLimiter = rateLimit({
	windowMs: Number(process.env.LINENT_TIME_LIMIT) * 60 * 1000,
	limit: Number(process.env.LINENT_REQUEST_LIMIT),
	standardHeaders: "draft-8",
	legacyHeaders: false,
    ipv6Subnet: 56
});