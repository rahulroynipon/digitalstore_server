import { Router } from "express";
import { authorize, verifyToken } from "../middlewares/Auth.middleware.js";
import {
    createProductHandler,
    deleteProductHandler,
    getProductHandler,
} from "../controllers/product.controller.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = Router();

router
    .route("/")
    .get(getProductHandler)
    .post(
        verifyToken,
        authorize("admin"),
        upload.array("images", 10),
        createProductHandler
    );

router
    .route("/:id")
    .delete(verifyToken, authorize("admin"), deleteProductHandler);

export default router;
