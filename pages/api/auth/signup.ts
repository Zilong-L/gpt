// import bcrypt from "bcryptjs";
// import { NextApiRequest, NextApiResponse } from "next";
// import { connectToDatabase } from "lib/mongodb";
// export default async function handler(
//     req: NextApiRequest,
//     res: NextApiResponse
// ) {
//     if (req.method === "POST") {
//         const { email, password } = JSON.parse(req.body);
//         const client = await connectToDatabase();
//         const db = await client.db("gpt-auth");
//         const existingUser = await db.collection("users").findOne({ email });

//         if (existingUser) {
//             return res.status(409).json({ message: "Email already exists" });
//         }

//         const hashedPassword = await bcrypt.hash(password, 12);

//         await db
//             .collection("users")
//             .insertOne({ email, password: hashedPassword });

//         return res.status(201).json({ message: "Sign up successful" });
//     }
// }
import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import UserModel from "models/User";
import { connectToDatabase, disconnectFromDatabase } from "@/lib/mongoose";

const signupHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const { email, password } = JSON.parse(req.body);

    // Validate the user input
    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        // Check if the email is already in use
        await connectToDatabase();
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "Email is already in use" });
        }
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save the new user to the database
        const user = await UserModel.create({
            email,
            password: hashedPassword,
        });

        // Return the new user
        res.status(201).json({ message: "User created successfully", user });
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({ message: "An error occurred during signup" });
    } finally {
        await disconnectFromDatabase();
    }
};

export default signupHandler;
