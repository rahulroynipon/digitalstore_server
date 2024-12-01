import { Product } from "../models/product.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import fs from "fs";
import { validateMongoDbId } from "../utils/validateMongoDbId.js";
import { Category } from "../models/category.model.js";
import { Brand } from "../models/brand.model.js";

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
    await Category.findByIdAndUpdate({ _id: category }, { $inc: { count: 1 } });
    await Brand.findByIdAndUpdate({ _id: brand }, { $inc: { count: 1 } });

    return res
        .status(201)
        .json(new ApiResponse(201, product, "New product added successfully"));
});

const getProductHandler = asyncHandler(async (req, res) => {
    // Step 1: Clone and parse query parameters
    let queryObj = { ...req.query };

    const excludeFields = [
        "page",
        "sort",
        "limit",
        "fields",
        "minPrice",
        "maxPrice",
        "stack",
    ];
    excludeFields.forEach((el) => delete queryObj[el]);

    // Step 2: Apply price filter
    if (req.query.minPrice || req.query.maxPrice) {
        queryObj.price = {};
        if (req.query.minPrice) queryObj.price.$gte = +req.query.minPrice;
        if (req.query.maxPrice) queryObj.price.$lte = +req.query.maxPrice;
    }

    // Step 3: Apply stock filter
    if (req.query.stack) {
        queryObj.stack =
            req.query.stack === "in-stack"
                ? { $gt: 0 }
                : req.query.stack === "out-of-stack"
                  ? { $lte: 0 }
                  : undefined;
    }

    // Step 4: Build query
    let query = Product.find(queryObj)
        .populate("category", "name")
        .populate("brand", "name")
        .select("-tags -description -productTable");

    // Step 5: Apply sorting
    if (req.query.sort) {
        const sortOptions = {
            price: "price",
            "-price": "-price",
            rating: "totalrating",
            "-rating": "-totalrating",
        };
        query = query.sort(sortOptions[req.query.sort] || "-createdAt");
    } else {
        query = query.sort("-createdAt"); // Default sort by newest
    }

    // Step 6: Pagination
    const page = Math.max(1, req.query.page * 1 || 1);
    const limit = Math.max(1, req.query.limit * 1 || 10);
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    // Step 7: Execute query
    const products = await query;
    const totalProducts = await Product.countDocuments(queryObj);

    // Step 8: Send response
    const response = {
        status: 200,
        data: products,
        message: "Products retrieved successfully",
        pagination: {
            totalProducts,
            currentPage: page,
            totalPages: Math.ceil(totalProducts / limit),
            pageSize: limit,
        },
    };

    return res.status(200).json(response);
});

const deleteProductHandler = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);

    const product = await Product.findByIdAndDelete(id);
    await Category.findByIdAndUpdate(
        { _id: product?.category },
        { $inc: { count: -1 } }
    );
    await Brand.findByIdAndUpdate(
        { _id: product?.brand },
        { $inc: { count: -1 } }
    );

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Delete product successfully"));
});

const getProductById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id)
        .populate("category", "name")
        .populate("brand", "name")
        .populate("colors", "name code");

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                product ? [product] : [],
                "Product retrieved successfully"
            )
        );
});

export {
    createProductHandler,
    getProductHandler,
    deleteProductHandler,
    getProductById,
};
