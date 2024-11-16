import mongoose, { Schema } from "mongoose";

const ColorSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            index: true,
        },
        code: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

export const Color = mongoose.model("Color", ColorSchema);
