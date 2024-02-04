import { ObjectId } from "mongodb";
import mongoose from "mongoose";

/* FeaturedUserStoriesSchema will correspond to a collection in your MongoDB database. */
const FeaturedUserStoriesSchema = mongoose.Schema(
    {
        articleSharedStoryId: {
            type: ObjectId,
        },
        featureDate: {
            type: Date,
            required: [true, "please provide date"],
        },
        deletedAt: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

export default mongoose.models.FeaturedUserStories ||
    mongoose.model("FeaturedUserStories", FeaturedUserStoriesSchema);
