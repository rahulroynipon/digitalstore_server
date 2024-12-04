import { Brand } from "../models/brand.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import fs from "fs";

const createBrandHandler = asyncHandler(async (req, res) => {
    const { brand } = req.body;
    const filePath = req.file.path;

    try {
        const isExisted = await Brand.findOne({ name: brand });
        let imageUrl;
        if (!isExisted) {
            imageUrl = await uploadOnCloudinary(filePath);
            const newBrand = new Brand({
                name: brand,
                image: imageUrl?.url,
            });

            await newBrand.save();

            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }

            return res
                .status(201)
                .json(
                    new ApiResponse(
                        201,
                        newBrand,
                        "New brand added successfully"
                    )
                );
        } else {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }

            throw new ApiError(409, "Brand already exists");
        }
    } catch (error) {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        throw new ApiError(500, "Internal Server Error");
    }
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
