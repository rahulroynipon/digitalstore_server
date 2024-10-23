import mongoose, { Schema } from "mongoose";

const graphSchema = new Schema(
    {
        date: { type: String, required: true, unique: true },
        sales: { type: Number, default: 0 },
        views: { type: Number, default: 0 },
    },
    { timestamps: true }
);

export const Graph = mongoose.model("Graph", graphSchema);
