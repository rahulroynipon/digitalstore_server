import mongoose, { Schema } from "mongoose";

const cartSchema = new Schema({
    product: { type: Schema.Types.ObjectId, ref: "Product" },
});

const refreshTokenSchema = new Schema({
    token: { type: String, required: true },
    expire: { type: Date, default: Date.now, expires: 60 * 60 * 24 * 7 },
});

const userSchema = new Schema(
    {
        googleID: { type: String, unique: true, sparse: true },
        email: { type: String, unique: true, required: true },
        fullname: { type: String, required: true },
        mobile: { type: String, required: true },
        avatar: { type: String },
        cart: { type: [cartSchema], default: [] },
        password: {
            type: String,
            required: function () {
                return !this.googleID;
            },
        },
        isValid: {
            type: Boolean,
            default: function () {
                return !!this.googleID;
            },
        },
        isBlock: { type: Boolean, default: false },
        refreshTokens: { type: [refreshTokenSchema], default: [] },
    },
    { timestamps: true }
);

export const User = mongoose.model("User", userSchema);