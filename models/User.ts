import bcrypt from "bcryptjs";
import { Schema, model, Document, models } from "mongoose";

interface User extends Document {
    email: string;
    password: string;
}

const UserSchema = new Schema<User>(
    {
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
    },
    { timestamps: true }
);

UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        console.log("already hashed");
        return next();
    }
    try {
        console.log("hashing");
        const hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;
        next();
    } catch (err) {
        console.log(err);
        next();
    }
});
const UserModel = models.User || model<User>("User", UserSchema);

export default UserModel;
