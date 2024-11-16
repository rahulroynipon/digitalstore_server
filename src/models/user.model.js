import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const cartSchema = new Schema({
    product: { type: Schema.Types.ObjectId, ref: "Product" },
});

const refreshTokenSchema = new Schema({
    token: { type: String, required: true },
    expire: { type: Date, default: () => Date.now() + 7 * 24 * 60 * 60 * 1000 },
});

const userSchema = new Schema(
    {
        googleID: { type: String, unique: true, sparse: true },
        email: { type: String, unique: true, required: true },
        fullname: { type: String, required: true },
        mobile: { type: String },
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
        role: { type: String, enum: ["admin", "user"], default: "user" },
        isBlock: { type: Boolean, default: false },
        refreshTokens: { type: [refreshTokenSchema], default: [] },
    },
    { timestamps: true }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    try {
        const salt = await bcrypt.getSalt(14);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
    return jwt.sign({ _id: this._id }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRE,
    });
};

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign({ _id: this._id }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRE,
    });
};

export const User = mongoose.model("User", userSchema);
