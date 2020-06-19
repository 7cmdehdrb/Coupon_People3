import mongoose from "mongoose";
import "../models/users";
import "../models/coupons";

export const commentSchema = new mongoose.Schema({
    coupon: { type: mongoose.Schema.Types.ObjectId, ref: "Coupon", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
    date: { type: Date, required: true, default: Date.now },
});

export const commentModel = mongoose.model("Comment", commentSchema);
