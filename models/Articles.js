import { ObjectId } from "mongodb";
import mongoose from "mongoose";

/* ArticlesSchema will correspond to a collection in your MongoDB database. */
const ArticlesSchema = mongoose.Schema(
    {
        authorId: {
            type: ObjectId,
            required: [true, "please provide authorId"],
        },
        authorName: {
            type: String,
            required: [true, "please provide collab authorName"],
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
        location: {
            value: {
                type: String,
            },
            lon: {
                type: mongoose.Types.Decimal128,
            },
            lat: {
                type: mongoose.Types.Decimal128,
            },
        },
        date: {
            type: Date,
            required: [true, "please provide date"],
        },
        isPublished: {
            type: Boolean,
            required: [true, "please provide isPublished"],
        },
        tag: {
            //gen or his
            type: String,
            required: [true, "please provide tag"],
        },
        coverImage: {
            type: String,
        },
    },
    { timestamps: true }
);

export default mongoose.models.Articles ||
    mongoose.model("Articles", ArticlesSchema);
