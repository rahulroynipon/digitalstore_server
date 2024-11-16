import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { validateMongoDbId } from "../utils/validateMongoDbId.js";
import { Category } from "./../models/category.model.js";
import fs from "fs";

const createNewCategoryHandler = asyncHandler(async (req, res) => {
    const { category } = req.body;
    const filePath = req.file.path;

    try {
        const isExisted = await Category.findOne({ name: category });
        let imageUrl;
        if (!isExisted) {
            imageUrl = await uploadOnCloudinary(filePath);
            const newCategory = new Category({
                name: category,
                image: imageUrl?.url,
            });
            await newCategory.save();

            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }

            return res
                .status(201)
                .json(
                    new ApiResponse(
                        201,
                        newCategory,
                        "New category added successfully"
                    )
                );
        } else {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
            return res
                .status(409)
                .json(new ApiResponse(409, "Category already exists"));
        }
    } catch (error) {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        return res
            .status(500)
            .json(new ApiResponse(500, "Internal Server Error"));
    }
});

const getCategoryHandler = asyncHandler(async (req, res) => {
    const allCategory = await Category.find({})
        .collation({ locale: "en", strength: 2 })
        .sort({ name: 1 });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                allCategory,
                "All categories retrieved successfully"
            )
        );
});

const deleteCategoryHandler = asyncHandler(async (req, res) => {
    const { name } = req.params;

    await Category.findOneAndDelete({ name });

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Delete category successfully"));
});

export { createNewCategoryHandler, getCategoryHandler, deleteCategoryHandler };
