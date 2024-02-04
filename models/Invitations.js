import { ObjectId } from "mongodb";
import mongoose from "mongoose";

/* usersSchema will correspond to a collection in your MongoDB database. */
const InvitationsSchema = mongoose.Schema(
    {
        inviterId: {
            type: ObjectId,
            required: [true, "please provide inviterId"],
        },
        inviterName: {
            type: String,
            required: [true, "please provide inviterName"],
        },
        inviteeEmail: {
            type: String,
            required: [true, "please provide inviteeEmail"],
        },
        invitationType: {
            type: String, //member or collab
            required: [true, "please provide invitationType"],
        },
        treeId: {
            type: ObjectId,
            required: [true, "please provide treeId"],
        },
        treeMemberDocumentId: {
            type: ObjectId,
        },
        treeName: {
            type: String,
            required: [true, "please provide treeName"],
        },
        status: {
            type: String,
            default: "pending",
            required: [true, "please provide invitationType"],
        },
        deletedAt: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

export default mongoose.models.Invitations ||
    mongoose.model("Invitations", InvitationsSchema);
