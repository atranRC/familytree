import { ObjectId } from "mongodb";
import mongoose from "mongoose";

/* FlaggedWikisSchema will correspond to a collection in your MongoDB database. */
const FlaggedWikisSchema = mongoose.Schema(
    {
        wikiId: {
            type: ObjectId,
            required: [true, "please provide wikiId"],
        },
        flaggedBy: {
            type: String,
            required: [true, "please provide email"],
        },
        wikiTitle: {
            type: String,
            required: [true, "please provide wikiTitle"],
        },
        type: { type: String, required: [true, "please provide type"] },
        description: {
            type: String,
            required: [true, "please provide description"],
        },
    },
    { timestamps: true }
);

export default mongoose.models.FlaggedWikis ||
    mongoose.model("FlaggedWikis", FlaggedWikisSchema);
