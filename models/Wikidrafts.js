import { ObjectId } from "mongodb";
import mongoose from "mongoose";

/* Wikidraftsschema will correspond to a collection in your MongoDB database. */
const WikidraftsSchema = mongoose.Schema(
    {
        authorId: {
            type: ObjectId,
            required: [true, "please provide authorId"],
        },
        authorName: {
            type: String,
            required: [true, "please provide authorName"],
        },
        wikiId: {
            type: ObjectId,
        },
        title: { type: String, required: [true, "please provide title"] },
        description: {
            type: String,
            required: [true, "please provide description"],
        },
        content: {
            type: String,
            required: [true, "please provide description"],
        },

        tag: {
            //hero/martyr/public_figure/artefact/history
            type: String,
            required: [true, "please provide tag"],
        },
        coverImage: {
            type: String,
        },
    },
    { timestamps: true }
);

export default mongoose.models.Wikidrafts ||
    mongoose.model("Wikidrafts", WikidraftsSchema);
