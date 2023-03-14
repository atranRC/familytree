import mongoose from "mongoose";

/* usersSchema will correspond to a collection in your MongoDB database. */
const TreeMembersSchema = mongoose.Schema({
    treeId: {
        type: String,
        required: [true, "Please provide treeId."],
    },
    id: {
        type: String,
        required: [true, "please provide userId"],
    },
    name: { type: String, required: [true, "please provide collab name"] },
    parent_id: { type: String },
    attributes: { type: Object },
    canPost: { type: Boolean },
});

export default mongoose.models.TreeMembers ||
    mongoose.model("TreeMembers", TreeMembersSchema);
