import mongoose from "mongoose";
import { ApiError } from "./ApiError.js";

const validateMongoDbId = (id) => {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) {
        throw new ApiError(400, "Invaild id");
    }
};

export { validateMongoDbId };
