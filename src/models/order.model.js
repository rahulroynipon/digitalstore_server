import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema(
    {
        products: [
            {
                product: {
                    type: Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                count: {
                    type: Number,
                    required: true,
                    min: 1,
                },
                color: {
                    type: String,
                    required: true,
                },
            },
        ],
        paymentIntent: {
            type: Schema.Types.Mixed,
            required: true,
        },
        orderStatus: {
            type: String,
            enum: [
                "Order Placed",
                "Processing",
                "Shipped",
                "Delivered",
                "Cancelled",
                "Returned",
            ],
            default: "Order Placed",
        },
        totalOrderValue: {
            type: Number,
            default: 0,
            min: 0,
        },
        orderby: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);
