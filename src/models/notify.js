import mongoose, { Schema } from "mongoose";

const notifySchema = new Schema(
    {
        seen: { type: Boolean, default: false },
        category: { type: String, required: true, enum: ["Rating", "Order"] },
        refId: {
            type: Schema.Types.ObjectId,
            required: true,
            refPath: "category",
        },
    },
    { timestamps: true }
);

export const Notify = mongoose.model("Notify", notifySchema);
