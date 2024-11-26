import mongoose, { Schema } from "mongoose";

const productTableSchema = new Schema({
    label: { type: String, required: true },
    value: { type: String, required: true },
    required: { type: Boolean, required: true, default: false },
});

const productSchema = new Schema(
    {
        title: { type: String, unique: true, required: true },
        brand: {
            type: Schema.Types.ObjectId,
            ref: "Brand",
            required: true,
            index: true,
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: "Category",
            required: true,
            index: true,
        },
        colors: { type: [String], required: true },
        stack: { type: Number, required: true },
        sold: { type: Number, default: 0 },
        order: { type: Number, default: 0 },
        price: { type: Number, required: true },
        discount: { type: Number, required: true, default: 0 },
        images: { type: [String], default: [] },
        tags: { type: [String], required: true },
        description: { type: String, required: true },
        productTable: {
            type: [productTableSchema],
            default: [],
        },
        ratings: [
            {
                type: Schema.Types.ObjectId,
                ref: "Rating",
            },
        ],
        totalrating: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);
