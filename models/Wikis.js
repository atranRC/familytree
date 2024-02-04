import { ObjectId } from "mongodb";
import mongoose from "mongoose";

/* WikisSchema will correspond to a collection in your MongoDB database. */
const WikisSchema = mongoose.Schema(
    {
        authorId: {
            type: ObjectId,
            required: [true, "please provide authorId"],
        },
        authorName: {
            type: String,
            required: [true, "please provide authorName"],
        },
        draftId: {
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
        isPublished: {
            type: Boolean,
            required: [true, "please provide isPublished"],
        },
        tag: {
            //hero/martyr/public_figure/artefact/history
            type: String,
            required: [true, "please provide tag"],
        },
        coverImage: {
            type: String,
        },
        deletedAt: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

export default mongoose.models.Wikis || mongoose.model("Wikis", WikisSchema);
