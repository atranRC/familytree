import { ObjectId } from "mongodb";
import mongoose from "mongoose";

/* FlaggedArticlesSchema will correspond to a collection in your MongoDB database. */
const FlaggedArticlesSchema = mongoose.Schema(
    {
        articleId: {
            type: ObjectId,
            required: [true, "please provide articleId"],
        },
        articleTitle: {
            type: String,
            required: [true, "please provide articleTitle"],
        },
        type: { type: String, required: [true, "please provide type"] },
        description: {
            type: String,
            required: [true, "please provide description"],
        },
    },
    { timestamps: true }
);

export default mongoose.models.FlaggedArticles ||
    mongoose.model("FlaggedArticles", FlaggedArticlesSchema);
