import mongoose, { Schema } from "mongoose";

const BrandSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            index: true,
        },
        image: { type: String, required: true },
        count: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

export const Brand = mongoose.model("Brand", BrandSchema);
