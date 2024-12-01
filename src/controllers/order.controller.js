import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

const createOrderHandler = asyncHandler(async (req, res) => {
    const { products, paymentIntent, orderby } = req.body;

    if (!products || !products.length) {
        return res
            .status(400)
            .json(new ApiResponse(400, null, "No products in the order"));
    }

    let totalOrderValue = 0;

    const productUpdates = products.map(async (item) => {
        const product = await Product.findById(item.product);

        if (!product) {
            throw new ApiError(
                404,
                `Product with ID ${item.product} not found`
            );
        }

        if (product.stack < item.count) {
            throw new ApiError(
                400,
                `Not enough stock for product: ${product.name}`
            );
        }

        product.stack -= item.count;
        product.order += item.count;
        await product.save();

        const discount = (product.discount / 100) * product.price;
        totalOrderValue += (product.price - discount) * item.count;
    });

    await Promise.all(productUpdates);

    const newOrder = new Order({
        products,
        paymentIntent,
        totalOrderValue,
        orderby,
    });

    await newOrder.save();

    return res
        .status(201)
        .json(new ApiResponse(201, newOrder, "Order placed successfully"));
});

const getOrderHandler = asyncHandler(async (req, res) => {
    const allOrder = await Order.find({}).sort({
        createdAt: -1,
    });

    return res
        .status(200)
        .json(
            new ApiResponse(200, allOrder, "All order retrieved successfully")
        );
});

const updateOrderHandler = asyncHandler(async (req, res) => {
    const { id, status } = req.body;

    if (!id || !status) {
        throw ApiError(400, "Order ID and new status are required");
    }

    const updatedOrder = await Order.findByIdAndUpdate(
        id,
        { orderStatus: status },
        { new: true }
    );

    if (!updatedOrder) {
        throw ApiError(404, "Order not found or update failed");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                updatedOrder,
                "Order status updated successfully"
            )
        );
});

const getOrderByIdHandler = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id) {
        throw ApiError(400, "Order ID is required");
    }

    const order = await Order.findById(id)
        .populate({
            path: "products.product",
            select: "title images price discount",
        })
        .populate({
            path: "orderby",
            select: "fullname email",
        });

    if (!order) {
        throw ApiError(404, "Order not found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                order ? [order] : [],
                "Order fetched successfully"
            )
        );
});

export {
    createOrderHandler,
    getOrderHandler,
    updateOrderHandler,
    getOrderByIdHandler,
};
