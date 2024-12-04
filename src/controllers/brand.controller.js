import { Brand } from "../models/brand.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const createBrandHandler = asyncHandler(async (req, res) => {
    const { brand } = req.body;

    const isExisted = await Brand.findOne({ name: brand });
    if (isExisted) {
        throw new ApiError(409, "Brand already exists");
    }

    const imageUrl = req.file?.path;

    console.log(imageUrl);

    const newBrand = new Brand({
        name: brand,
        image: imageUrl || null,
    });

    await newBrand.save();

    return res
        .status(201)
        .json(new ApiResponse(201, newBrand, "New brand added successfully"));
});

const getBrandHandler = asyncHandler(async (req, res) => {
    const allBrand = await Brand.find({})
        .collation({ locale: "en", strength: 2 })
        .sort({ name: 1 });

    return res
        .status(200)
        .json(
            new ApiResponse(200, allBrand, "All brands retrieved successfully")
        );
});

const deleteBrandHandler = asyncHandler(async (req, res) => {
    const { name } = req.params;

    await Brand.findOneAndDelete({ name });

    return res.status(200, null, "Delete brand successfully");
});

export { createBrandHandler, getBrandHandler, deleteBrandHandler };
