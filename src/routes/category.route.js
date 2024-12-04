import { Router } from "express";
import { authorize, verifyToken } from "../middlewares/Auth.middleware.js";
import {
    createNewCategoryHandler,
    deleteCategoryHandler,
    getCategoryHandler,
} from "../controllers/category.controller.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = Router();

router
    .route("/")
    .get(getCategoryHandler)
    .post(
        verifyToken,
        authorize("admin"),
        upload.single("image"),
        createNewCategoryHandler
    );

router
    .route("/:name")
    .delete(verifyToken, authorize("admin"), deleteCategoryHandler);

export default router;
