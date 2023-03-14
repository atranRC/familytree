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
            type: String,
        },
        date: {
            type: Date,
            required: [true, "please provide date"],
        },
    },
    { timestamps: true }
);

export default mongoose.models.Articledrafts ||
    mongoose.model("Articledrafts", ArticledraftsSchema);
