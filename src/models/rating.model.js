import mongoose, { Schema } from "mongoose";

const ratingSchema = new Schema({
    star: { type: Number, required: true },
    comment: { type: String, required: true },
    date: { type: Date, default: Date.now },
    role: { type: String, default: "user" },
    postedby: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
});

export const Rating = mongoose.model("Rating", ratingSchema);
