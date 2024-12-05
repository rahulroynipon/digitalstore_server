import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import { COOKIE_OPTIONS } from "../constants.js";

const verifyToken = asyncHandler(async (req, res, next) => {
    const headerTokens = req.headers.authorization?.split(" ")[1];

    const [accessHeaderTokens, refreshHeaderToken] = headerTokens.split(
        process.env.DELIMITER
    );
    let accessToken = req.cookies.accessToken;
    console.log(accessToken);
    console.log(accessHeaderTokens);

    if (!accessToken && accessHeaderTokens) {
        accessToken = accessHeaderTokens;
    }

    if (!accessToken) {
        throw new ApiError(401, "Access denied. No tokens provided.");
    }

    try {
        const decoded = jwt.verify(
            accessToken,
            process.env.ACCESS_TOKEN_SECRET
        );

        const user = await User.findById(decoded._id);

        if (!user || !user.isValid) {
            throw new ApiError(401, "Invalid access token.");
        }

        req.user = user;
        return next();
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            const refreshToken = req.cookies.refreshToken;

            if (!refreshToken && refreshHeaderToken) {
                refreshToken = refreshHeaderToken;
            }

            if (!refreshToken) {
                throw new ApiError(
                    401,
                    "Access token expired and no refresh token provided."
                );
            }

            try {
                const decodedRefresh = jwt.verify(
                    refreshToken,
                    process.env.REFRESH_TOKEN_SECRET
                );

                const user = await User.findById(decodedRefresh._id);

                if (
                    !user ||
                    !user.isValid ||
                    !user.refreshTokens.some(
                        (tokenObj) => tokenObj.token == refreshToken
                    )
                ) {
                    throw new ApiError(403, "Invalid refresh token.");
                }

                const newAccessToken = user.generateAccessToken();

                res.cookie("accessToken", newAccessToken, COOKIE_OPTIONS);

                req.user = user;
                return next();
            } catch (refreshErr) {
                throw new ApiError(403, "Invalid refresh token.");
            }
        } else {
            throw new ApiError(403, "Invalid token.");
        }
    }
});

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            throw new ApiError(403, "Access denied: insufficient permissions");
        }
        return next();
    };
};

export { verifyToken, authorize };
