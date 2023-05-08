import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

interface Payload {
    userId: string;
}

export function signToken(payload: Payload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
}

export function verifyToken(token: string): Payload | null {
    try {
        return jwt.verify(token, JWT_SECRET) as Payload;
    } catch (error) {
        console.error("Error verifying JWT:", error);
        return null;
    }
}
