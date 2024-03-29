import { ObjectId } from "mongodb";
import mongoose from "mongoose";

/* eventsSchema will correspond to a collection in your MongoDB database. */
const EventsSchema = mongoose.Schema(
    {
        userId: {
            type: ObjectId,
            required: [true, "Please provide userId."],
        },
        userName: {
            type: String,
            required: [true, "please provide userName"],
        },
        authorId: {
            type: ObjectId,
            required: [true, "please provide authorId"],
        },
        authorName: {
            type: String,
            required: [true, "please provide collab authorName"],
        },
        type: { type: String, required: [true, "please provide title"] },
        description: {
            type: String,
            required: [true, "please provide description"],
        },
        location: {
            /*value: {
                type: String,
                required: [true, "please provide name"],
            },
            lon: {
                type: mongoose.Types.Decimal128,
            },
            lat: {
                type: mongoose.Types.Decimal128,
            },*/
            type: Object,
        },
        eventDate: {
            type: Date,
            //required: [true, "please provide date"],
            default: Date.now(),
        },
        factSource: {
            type: ObjectId,
        },
        deletedAt: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

export default mongoose.models.Events || mongoose.model("Events", EventsSchema);
