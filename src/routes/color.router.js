import { Router } from "express";
import {
    createNewColorHandler,
    deleteColorHandler,
    getColorHandler,
} from "../controllers/color.controller.js";
import { authorize, verifyToken } from "../middlewares/Auth.middleware.js";

const router = Router();

router
    .route("/")
    .get(getColorHandler)
    .post(verifyToken, authorize("admin"), createNewColorHandler);

router
    .route("/:name")
    .delete(verifyToken, authorize("admin"), deleteColorHandler);

export default router;
