import mongoose from "mongoose";

/* usersSchema will correspond to a collection in your MongoDB database. */
const CollabsSchema = mongoose.Schema({
    userId: {
        type: String,
        required: [true, "Please provide userId."],
    },
    treeId: {
        type: String,
        required: [true, "please provide treeId"],
    },
    name: { type: String, required: [true, "please provide collab name"] },
    role: { type: String },
    deletedAt: {
        type: Date,
        default: null,
    },
});

export default mongoose.models.Collabs ||
    mongoose.model("Collabs", CollabsSchema);
