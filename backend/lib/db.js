import mongoose from "mongoose";

export const connectDB = async () => {
    try {

        const uri = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASE}?authSource=admin`;

        const conn = await mongoose.connect(uri);

        console.log(`MongoDB connected: ${conn.connection.host}`);

    } catch (error) {

        console.log("Error connecting to MongoDB", error.message);
        process.exit(1);

    }
};