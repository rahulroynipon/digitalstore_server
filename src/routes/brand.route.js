import { Router } from "express";
import { authorize, verifyToken } from "../middlewares/Auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";
import {
    createBrandHandler,
    deleteBrandHandler,
    getBrandHandler,
} from "../controllers/brand.controller.js";

const router = Router();

router
    .route("/")
    .get(getBrandHandler)
    .post(
        verifyToken,
        authorize("admin"),
        upload.single("image"),
        createBrandHandler
    );

router
    .route("/:name")
    .delete(verifyToken, authorize("admin"), deleteBrandHandler);

export default router;
