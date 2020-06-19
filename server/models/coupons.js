import mongoose from "mongoose";
import "../models/users";

export const couponSchema = new mongoose.Schema({
    name: { type: String, required: true },
    serial: { type: String, required: true },
    image: { type: String, required: false },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    type: { type: String, required: true },
    catagories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Interest", required: false }],
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
    finishDate: { type: Date, required: true },
});

export const couponModel = mongoose.model("Coupon", couponSchema);
