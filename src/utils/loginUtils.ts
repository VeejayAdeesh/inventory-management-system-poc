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

export const generateEmailTemplate = (resetToken: number) => {
	return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: Helvetica, Arial, sans-serif; background-color: #f4f5f7; margin: 0; padding: 40px 0; color: #333333; }
          .container { max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .header { background-color: #4f46e5; padding: 30px; text-align: center; color: #ffffff; font-size: 24px; font-weight: bold; }
          .content { padding: 40px 30px; line-height: 1.6; font-size: 16px; }
          .code-box { display: block; width: fit-content; margin: 30px auto; background-color: #f3f4f6; padding: 15px 40px; font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #111827; border-radius: 6px; text-align: center; }
          .footer { padding: 20px 30px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">Your Verification Code</div>
          <div class="content">
            <p>Hello,</p>
            <p>Please use the verification code below to complete your authentication process:</p>
            <div class="code-box">${resetToken}</div>
            <p>This code will expire in <strong>10 minutes</strong> and can only be used once.</p>
            <p>If you did not request this code, please ignore this email.</p>
            <p>Best regards,<br><strong>Your Team</strong></p>
          </div>
          <div class="footer">This is an automated message, please do not reply.</div>
        </div>
      </body>
      </html>`;
};
