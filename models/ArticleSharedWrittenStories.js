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
        articleTitle: {
            type: String,
        },
        uploaderId: {
            type: ObjectId,
            required: [true, "Please provide uploader id."],
        },
        profileId: {
            type: ObjectId,
            required: [true, "Please provide profileId."],
        },
        writtenStoryId: {
            type: ObjectId,
            required: [true, "Please provide writtenStoryId."],
        },
        userName: {
            type: String,
        },
        title: {
            type: String,
            required: [true, "Please provide title"],
        },
        content: {
            type: String,
            required: [true, "Please provide content."],
        },
        /*upvotes: {
            type: Number,
            default: generateRandomLikeCount(),
        },*/
        isAnnon: {
            type: Boolean,
            required: [true, "please provide isAnnon"],
        },
        deletedAt: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

export default mongoose.models.ArticleSharedWrittenStories ||
    mongoose.model(
        "ArticleSharedWrittenStories",
        ArticleSharedWrittenStoriesSchema
    );
