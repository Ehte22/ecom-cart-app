import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { RabbitMQService } from "./services/rabbitMQ.service";
import CART_ROUTER from "./routes/cart.routes";
import { protectedRoute } from "./utils/protected";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors({
    origin: true,
    credentials: true
}));
app.use(cookieParser())

app.use("/api/v1/cart", protectedRoute, CART_ROUTER);

// 404 Handler
app.use("*", (req: Request, res: Response) => {
    res.status(404).json({ message: "Resource Not Found" });
});

// Error Middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    res.status(500).json({ message: "Something went wrong", error: err.message });
});

// Initialize MongoDB
mongoose.connect(process.env.MONGO_URL || "").catch((err) => {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
});

// Start the Server
const PORT = process.env.PORT || 5000;
mongoose.connection.once("open", async () => {
    console.log("MongoDb Connected");

    // Initialize RabbitMQ
    await RabbitMQService();

    app.listen(PORT, () => {
        console.log(`Server is running on ${PORT}`);
    });
});

