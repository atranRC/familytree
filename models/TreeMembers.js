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
    sex: { type: String },
    parent_id: { type: String },
    attributes: { type: Object },
    mothers_name: { type: String },
    fathers_name: { type: String },
    spouse: { type: String },
    canPost: { type: Boolean },
});

export default mongoose.models.TreeMembers ||
    mongoose.model("TreeMembers", TreeMembersSchema);
