import { ObjectId } from "mongodb";
import mongoose from "mongoose";

/* usersSchema will correspond to a collection in your MongoDB database. */
const NotificationsSchema = mongoose.Schema(
    {
        sourceUserId: {
            type: ObjectId,
            required: [true, "please provide sourceUserId"],
        },
        sourceUserName: {
            type: String,
            required: [true, "please provide sourceUserName"],
        },
        targetUserId: {
            type: ObjectId,
            required: [true, "please provide targetId"],
        },
        targetUserName: {
            type: String,
            default: "",
        },
        message: {
            type: String,
            required: [true, "please provide message"],
        },
        url: {
            type: String,
            required: [true, "please provide url"],
        },
        status: {
            type: String, //read or unread
            default: "unread",
        },
        deletedAt: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

export default mongoose.models.Notifications ||
    mongoose.model("Notifications", NotificationsSchema);
