import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema(
    {
        seen: { type: Boolean, default: false },
        products: [
            {
                product: {
                    type: Schema.Types.ObjectId,
                    ref: "Product",
                },
                count: Number,
                color: String,
            },
        ],
        paymentIntent: {},
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
        orderby: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);
