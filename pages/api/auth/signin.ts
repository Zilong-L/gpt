import { signToken } from "@/lib/jwt";
import { connectToDatabase } from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import { NextApiRequest, NextApiResponse } from "next";
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "POST") {
        const { email, password } = JSON.parse(req.body);

        const client = await connectToDatabase();
        const db = await client.db("gpt-auth");

        const user = await db.collection("users").findOne({ email });
        console.log(user);
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return res.status(401).json({ message: "Invalid password" });
        }

        // At this point, the email and password are valid
        // You can generate a JWT or session token here and return it to the client
        const token = signToken({ userId: user._id.toString() });
        return res
            .status(200)
            .json({ message: "Sign in successful", token, email: user.email });
    }
}
