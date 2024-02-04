import { ObjectId } from "mongodb";
import mongoose from "mongoose";

/* articledraftsschema will correspond to a collection in your MongoDB database. */
const ArticledraftsSchema = mongoose.Schema(
    {
        authorId: {
            type: ObjectId,
            required: [true, "please provide authorId"],
        },
        authorName: {
            type: String,
            required: [true, "please provide collab authorName"],
        },
        articleId: {
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
            /*value: {
                type: String,
            },
            lon: {
                type: mongoose.Types.Decimal128,
            },
            lat: {
                type: mongoose.Types.Decimal128,
            },*/
            type: Object,
            required: [true, "please provide location"],
        },
        date: {
            type: Date,
            required: [true, "please provide date"],
        },
        tag: {
            //gen or his
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

export default mongoose.models.Articledrafts ||
    mongoose.model("Articledrafts", ArticledraftsSchema);
