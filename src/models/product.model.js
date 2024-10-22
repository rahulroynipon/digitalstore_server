import mongoose, { Schema } from "mongoose";

const ratingSchema = new Schema({
    star: { type: Number, required: true },
    comment: { type: String, required: true },
    date: { type: Date, default: Date.now },
    role: { type: String, default: "user" },
    postedby: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
});

const productTableSchema = new Schema({
    title: { type: String, required: true },
    value: { type: String, required: true },
});

const productSchema = new Schema(
    {
        name: { type: String, unique: true, required: true },
        brand: { type: String, required: true, index: true },
        category: { type: String, required: true, index: true },
        color: { type: String, required: true },
        stock: { type: Number, required: true },
        sold: { type: Number, required: true },
        price: { type: Number, required: true },
        discount: { type: Number, required: true, default: 0 },
        images: { type: [String], default: [] },
        tags: { type: [String] },
        description: { type: String, required: true },
        productTable: {
            type: [productTableSchema],
            default: [],
        },
        ratings: [ratingSchema],
        totalrating: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);
