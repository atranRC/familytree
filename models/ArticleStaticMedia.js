//ownerId
//url
//thumbnail
//tags
import { ObjectId } from "mongodb";
import mongoose from "mongoose";

/* ArticleStaticMediaSchema will correspond to a collection in your MongoDB database. */
const ArticleStaticMediaSchema = mongoose.Schema(
    {
        ownerId: {
            type: ObjectId,
            required: [true, "please provide ownerId"],
        },
        secureUrl: {
            type: String,
            required: [true, "please provide secureUrl"],
        },
        thumbnail: { type: String },
        tags: { type: Array },
        deletedAt: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

export default mongoose.models.ArticleStaticMedia ||
    mongoose.model("ArticleStaticMedia", ArticleStaticMediaSchema);
