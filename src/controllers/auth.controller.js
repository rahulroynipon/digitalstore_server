import { ApiError } from "../utils/ApiError.js";
import asyncHandler from "./../utils/asyncHandler.js";
import admin from "firebase-admin";
import { User } from "./../models/user.model.js";
import { COOKIE_OPTIONS } from "./../constants.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const googleAuthHandler = asyncHandler(async (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        throw new ApiError(401, "Authorization header is missing");
    }

    const token = authHeader.split(" ")[1];

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        const { uid, email, name, picture } = decodedToken;

        let user = await User.findOne({ googleID: uid });

        if (!user) {
            user = new User({
                googleID: uid,
                email,
                fullname: name,
                avatar: picture,
            });
        }

        const refreshToken = user.generateRefreshToken();
        const accessToken = user.generateAccessToken();

        user.refreshTokens.push({ token: refreshToken });
        await user.save();

        user = user.toObject();
        delete user.password;
        delete user.googleID;
        delete user.refreshTokens;

        return res
            .status(200)
            .cookie("accessToken", accessToken, COOKIE_OPTIONS)
            .cookie("refreshToken", refreshToken, COOKIE_OPTIONS)
            .json(
                new ApiResponse(
                    200,
                    user,
                    `User verified successfully as ${user.role === "admin" ? "Admin" : "Visitor"}`
                )
            );
    } catch (error) {
        console.error(error); // Log the error for easier debugging
        throw new ApiError(
            error.status || 401,
            error.message || "Token verification failed"
        );
    }
});

const logoutHandler = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    const user = await User.findById(req.user._id);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    user.refreshTokens = user.refreshTokens.filter(
        (item) =>
            item.token.toString() !== refreshToken.toString() &&
            item.expire > new Date()
    );

    await user.save();

    return res
        .status(200)
        .clearCookie("accessToken", COOKIE_OPTIONS)
        .clearCookie("refreshToken", COOKIE_OPTIONS)
        .json(new ApiResponse(200, null, "User logged out successfully"));
});

const getUserHandler = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select(
        "-password -googleId -refreshTokens"
    );

    return res
        .status(200)
        .json(new ApiResponse(200, user, "User retrieved successfully"));
});

const getUser = asyncHandler(async (req, res) => {
    const user = await User.find();
    return res.status(200).json(new ApiResponse(200, user));
});

export { googleAuthHandler, logoutHandler, getUserHandler, getUser };
