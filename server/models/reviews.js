import mongoose from "mongoose";
import "../models/users";

export const reviewSchema = new mongoose.Schema({
    from: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    to: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    element1: { type: Number, min: 1, max: 10, default: 10, required: true },
    element2: { type: Number, min: 1, max: 10, default: 10, required: true },
    element3: { type: Number, min: 1, max: 10, default: 10, required: true },
    element4: { type: Number, min: 1, max: 10, default: 10, required: true },
});

export const reviewModel = mongoose.model("Review", reviewSchema);
