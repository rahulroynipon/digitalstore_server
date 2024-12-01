import { Router } from "express";
import {
    createOrderHandler,
    getOrderByIdHandler,
    getOrderHandler,
    updateOrderHandler,
} from "../controllers/order.controller.js";
import { authorize, verifyToken } from "./../middlewares/Auth.middleware.js";

const router = Router();

router
    .route("/")
    .get(getOrderHandler)
    .post(createOrderHandler)
    .patch(verifyToken, authorize("admin"), updateOrderHandler);

router.route("/:id").get(getOrderByIdHandler);

export default router;
