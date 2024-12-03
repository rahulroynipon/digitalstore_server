console.log(process.env.SERVICE_ACCOUNT_TYPE);

export const serviceAccount = {
    type: process.env.SERVICE_ACCOUNT_TYPE,
    project_id: process.env.SERVICE_ACCOUNT_PROJECT_ID,
    private_key_id: process.env.SERVICE_ACCOUNT_PRIVATE_KEY_ID,
    private_key: process.env.SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, "\n"),
    client_email: process.env.SERVICE_ACCOUNT_CLIENT_EMAIL,
    client_id: process.env.SERVICE_ACCOUNT_CLIENT_ID,
    auth_uri: process.env.SERVICE_ACCOUNT_AUTH_URI,
    token_uri: process.env.SERVICE_ACCOUNT_TOKEN_URI,
    auth_provider_x509_cert_url:
        process.env.SERVICE_ACCOUNT_AUTH_PROVIDER_CERT_URL,
    client_x509_cert_url: process.env.SERVICE_ACCOUNT_CLIENT_CERT_URL,
    universe_domain: process.env.UNIVERSE_DOMAIN,
};

export const DB_NAME = "MAIN_PROJECT_1";
export const LIMIT = "1mb";

export const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "None",
};

export const MAINTENANCE_DAY = 15;
export const TOKEN_TIME = 7;
export const OTP_TIME = 2;
export const RESET_TIME = 5;

export const PUBLIC_ITEM =
    "_id firstname lastname fullname email avatar mobile role address wishlist cart isBlocked";
