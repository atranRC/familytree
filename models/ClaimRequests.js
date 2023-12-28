import mongoose from "mongoose";

const ClaimRequestsSchema = mongoose.Schema(
    {
        userId: {
            type: String,
            required: [true, "Please provide userId."],
        },
        targetId: {
            type: String,
            required: [true, "please provide targetId"],
        },
        targetOwnerId: {
            type: String,
            required: [true, "please provide targetOwnerId"],
        },
        name: { type: String, required: [true, "please provide name"] },
        claimerName: { type: String, required: [true, "please provide name"] },
        message: { type: String },
        status: { type: String, required: [true, "please provide status"] },
    },
    { timestamps: true }
);

export default mongoose.models.ClaimRequests ||
    mongoose.model("ClaimRequests", ClaimRequestsSchema);
