import { Router } from "express";
import {
    getUser,
    getUserHandler,
    googleAuthHandler,
    logoutHandler,
} from "../controllers/auth.controller.js";
import { verifyToken } from "./../middlewares/Auth.middleware.js";

const router = Router();

router.route("/google").post(googleAuthHandler);
router.route("/logout").get(verifyToken, logoutHandler);

router.route("/user").get(verifyToken, getUserHandler);
router.route("/users").get(getUser);

export default router;
