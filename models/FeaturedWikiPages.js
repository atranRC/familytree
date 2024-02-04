import { ObjectId } from "mongodb";
import mongoose from "mongoose";

/* FeaturedWikiPagesSchema will correspond to a collection in your MongoDB database. */
const FeaturedWikiPagesSchema = mongoose.Schema(
    {
        wikiId: {
            type: ObjectId,
        },
        featureDate: {
            type: Date,
            required: [true, "please provide date"],
        },
        tag: {
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

export default mongoose.models.FeaturedWikiPages ||
    mongoose.model("FeaturedWikiPages", FeaturedWikiPagesSchema);
