import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { Color } from "./../models/color.model.js";

const createNewColorHandler = asyncHandler(async (req, res) => {
    const { color, code } = req.body;

    const isExisted = await Color.findOne({ name: color });

    if (isExisted) {
        throw new ApiError(409, "Color already exists");
    }

    const newColor = new Color({
        name: color,
        code,
    });

    await newColor.save();

    return res
        .status(201)
        .json(new ApiResponse(201, newColor, "New color added successfully"));
});

const getColorHandler = asyncHandler(async (req, res) => {
    const allColor = await Color.find({})
        .collation({
            locale: "en",
            strength: 2,
        })
        .sort({ name: 1 });

    return res
        .status(200)
        .json(
            new ApiResponse(200, allColor, "All colors retrieved successfully")
        );
});

const deleteColorHandler = asyncHandler(async (req, res) => {
    const { name } = req.params;
    await Color.findOneAndDelete({ name });

    return res.status(200, null, "Delete color successfully");
});

export { createNewColorHandler, getColorHandler, deleteColorHandler };
