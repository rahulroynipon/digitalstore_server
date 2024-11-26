import { Product } from "../models/product.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import fs from "fs";
import { validateMongoDbId } from "../utils/validateMongoDbId.js";

const createProductHandler = asyncHandler(async (req, res) => {
    const {
        title,
        tags,
        category,
        brand,
        colors,
        description,
        stack,
        price,
        discount,
        table,
    } = req.body;

    const files = req.files;

    const isExisted = await Product.findOne({ title });
    if (isExisted) {
        throw new ApiError(409, "Product already exists");
    }

    const processedTags = tags?.split(",").map((item) => item.trim());

    let imageUrls = [];
    try {
        const imageUploadPromises = files.map((file) =>
            uploadOnCloudinary(file.path)
        );

        const uploadedImages = await Promise.all(imageUploadPromises);
        imageUrls = uploadedImages
            .filter((upload) => upload?.url)
            .map((upload) => upload.url);

        for (const file of files) {
            if (fs.existsSync(file.path)) {
                fs.unlinkSync(file.path);
            }
        }
    } catch (error) {
        for (const file of files) {
            if (fs.existsSync(file.path)) {
                fs.unlinkSync(file.path);
            }
        }
        throw new ApiError(500, "Internal Server Error");
    }

    let productTable;
    try {
        productTable =
            typeof table === "string" ? JSON.parse(table) : table || [];
    } catch (error) {
        throw new ApiError(
            400,
            "Invalid table format. Must be a valid JSON string."
        );
    }

    const product = new Product({
        title,
        tags: processedTags,
        category,
        brand,
        colors,
        description,
        stack,
        price,
        discount,
        productTable: productTable,
        images: imageUrls,
    });

    await product.save();

    return res
        .status(200)
        .json(new ApiResponse(200, product, "New product added successfully"));
});

const getProductHandler = asyncHandler(async (req, res) => {
    const product = await Product.find({})
        .populate("category", "name")
        .populate("brand", "name");

    return res
        .status(200)
        .json(
            new ApiResponse(200, product, "All products retrieved successfully")
        );
});

const deleteProductHandler = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);

    await Product.findByIdAndDelete(id);

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Delete product successfully"));
});

export { createProductHandler, getProductHandler, deleteProductHandler };
