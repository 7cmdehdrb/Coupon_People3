import mongoose from "mongoose";

export const interestSchema = new mongoose.Schema({
    interest: { type: String, required: true, unique: true },
});

export const interestModel = mongoose.model("Interest", interestSchema);

export const userSchema = new mongoose.Schema({
    email: { type: String, required: false, unique: true },
    nickname: { type: String, required: true },
    profileImage: { type: String, required: false },
    password: { type: String, required: false },
    isAdmin: { type: Boolean, required: true, default: false },
    isActivated: { type: Boolean, required: true, default: true },
    emailSecret: { type: String, required: false },
    emailValid: { type: Boolean, required: false, default: false },
    interests: [{ type: mongoose.Schema.Types.ObjectId, ref: "Interest", required: false }],
    loginMethod: { type: String, required: true, default: "local" },
    money: { type: Number, required: true, default: 10000 },
});

export const userModel = mongoose.model("User", userSchema);
