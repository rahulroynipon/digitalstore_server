export const DB_NAME = "ECOMMERCE";
export const LIMIT = "1mb";

export const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: true,
    // sameSite: "Strict",
    // maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export const MAINTENANCE_DAY = 15;
export const TOKEN_TIME = 7;
export const OTP_TIME = 2;
export const RESET_TIME = 5;

export const PUBLIC_ITEM =
    "_id firstname lastname fullname email avatar mobile role address wishlist cart isBlocked";
