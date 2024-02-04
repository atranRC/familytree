import { ObjectId } from "mongodb";
import mongoose from "mongoose";

/* FeaturedTimelineArticlesSchema will correspond to a collection in your MongoDB database. */
const FeaturedTimelineArticlesSchema = mongoose.Schema(
    {
        articleId: {
            type: ObjectId,
        },
        featureDate: {
            type: Date,
            required: [true, "please provide date"],
        },
        tag: {
            //gen or his
            type: String,
            required: [true, "please provide tag"],
        },
        deletedAt: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

export default mongoose.models.FeaturedTimelineArticles ||
    mongoose.model("FeaturedTimelineArticles", FeaturedTimelineArticlesSchema);
