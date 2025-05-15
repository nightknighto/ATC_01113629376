import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export namespace JwtService {
    export const sign = (payload: object, options?: jwt.SignOptions) => {
        return jwt.sign(payload, JWT_SECRET, { expiresIn: "1d", ...options });
    };

    export const verify = <T = any>(token: string): T => {
        return jwt.verify(token, JWT_SECRET) as T;
    };
}