import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { LIMIT } from "./constants.js";
import { ApiError } from "./utils/ApiError.js";
import admin from "firebase-admin";
import serviceAccount from "../serviceAccountKey.json" assert { type: "json" };

const app = express();

app.use(
    cors({
        origin: process.env.CORS_ORIGIN.split(","),
        credentials: true,
        optionsSuccessStatus: 200,
    })
);
app.use(express.json({ limit: LIMIT }));
app.use(express.urlencoded({ extended: true, limit: LIMIT }));
app.use(express.static("public"));
app.use(cookieParser());

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

// all the route here
import authRoute from "./routes/auth.router.js";
import categoryRoute from "./routes/category.route.js";
import brandRoute from "./routes/brand.route.js";
import colorRoute from "./routes/color.router.js";
import productRoute from "./routes/product.router.js";
import orderRouter from "./routes/order.route.js";

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/brand", brandRoute);
app.use("/api/v1/color", colorRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/order", orderRouter);

app.use((err, req, res, next) => {
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            status: err.statusCode,
            message: err.message,
            errors: err.error,
            path: req.originalUrl,
        });
    }

    res.status(err.statusCode || 500).json({
        status: err.statusCode || 500,
        message: err.message || "Internal Server Error",
        errors: err.errors || null,
        path: req.originalUrl,
    });
});

export { app };
