import { ObjectId } from "mongodb";
import mongoose from "mongoose";

/* usersSchema will correspond to a collection in your MongoDB database. */
const TreeMembersBSchema = mongoose.Schema(
    {
        treeId: {
            type: String,
            required: [true, "Please provide treeId."],
        },
        treeName: {
            type: String,
        },
        id: {
            type: String,
            required: [true, "please provide userId"],
        },
        nodeInfo: {
            type: Object,
        },
        taggedUser: {
            type: ObjectId,
        },
        canPost: { type: Boolean },
    },
    { timestamps: true }
);

export default mongoose.models.TreeMembersB ||
    mongoose.model("TreeMembersB", TreeMembersBSchema);
