import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import { generateRandomLikeCount } from "../utils/modelUtils";

/* usersSchema will correspond to a collection in your MongoDB database. */
const ArticleSharedWrittenStoriesSchema = mongoose.Schema(
    {
        articleId: {
            type: ObjectId,
            required: [true, "Please provide artileId."],
        },
        writtenStoryId: {
            type: ObjectId,
            required: [true, "Please provide writtenStoryId."],
        },
        userName: {
            type: String,
        },
        upvotes: {
            type: Number,
            default: generateRandomLikeCount(),
        },
    },
    { timestamps: true }
);

export default mongoose.models.ArticleSharedWrittenStories ||
    mongoose.model(
        "ArticleSharedWrittenStories",
        ArticleSharedWrittenStoriesSchema
    );
