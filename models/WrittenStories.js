import { ObjectId } from "mongodb";
import mongoose from "mongoose";

/* usersSchema will correspond to a collection in your MongoDB database. */
const WrittenStoriesSchema = mongoose.Schema(
    {
        userId: {
            type: ObjectId,
            required: [true, "Please provide userId."],
        },
        authorId: {
            type: ObjectId,
            required: [true, "please provide authorId"],
        },
        authorName: {
            type: String,
            required: [true, "please provide collab authorName"],
        },
        title: { type: String, required: [true, "please provide title"] },
        content: {
            type: String,
            required: [true, "please provide collab name"],
        },
    },
    { timestamps: true }
);

export default mongoose.models.WrittenStories ||
    mongoose.model("WrittenStories", WrittenStoriesSchema);
