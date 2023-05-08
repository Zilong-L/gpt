import mongoose, { ConnectOptions } from "mongoose";

async function connectToDatabase() {
    const dbUri = process.env.MONGODB_URI as string;
    try {
        await mongoose.connect(dbUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        } as ConnectOptions);
        console.log("Connected to the MongoDB database");
    } catch (error) {
        console.error("Error connecting to the MongoDB database:", error);
        process.exit(1);
    }
}
async function disconnectFromDatabase() {
    try {
        await mongoose.disconnect();
        console.log("Disconnected from the MongoDB database");
    } catch (error) {
        console.error("Error disconnecting from the MongoDB database:", error);
        process.exit(1);
    }
}
export { connectToDatabase, disconnectFromDatabase };
