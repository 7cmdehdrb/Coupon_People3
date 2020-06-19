import mongoose from "mongoose";
import "../models/users";
import "../models/coupons";

export const tradeSchema = new mongoose.Schema({
    coupon: { type: mongoose.Schema.Types.ObjectId, ref: "Coupon", required: true },
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
    tradeDate: { type: Date, required: true, default: Date.now },
    isFinished: { type: Boolean, required: true, default: false },
    isDetermined: { type: Boolean, required: true, default: false },
    isCheated: { type: Boolean, required: true, default: false },
});

export const tradeModel = mongoose.model("Trade", tradeSchema);
