import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { validateMongoDbId } from "../utils/validateMongoDbId.js";
import { Category } from "./../models/category.model.js";

const createNewCategoryHandler = asyncHandler(async (req, res) => {
    const { category } = req.body;

    const isExisted = await Category.findOne({ name: category });
    if (isExisted) {
        throw new ApiError(409, "Category already exists");
    }

    const imageUrl = req.file?.path;

    const newCategory = new Category({
        name: category,
        image: imageUrl,
    });

    await newCategory.save();

    return res
        .status(201)
        .json(
            new ApiResponse(201, newCategory, "New category added successfully")
        );
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
