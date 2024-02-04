import { unstable_getServerSession } from "next-auth";
import dbConnect from "../../../../../lib/dbConnect";
import TreeMembersB from "../../../../../models/TreeMembersB";
import Users from "../../../../../models/Users";
import { getSessionTreeRelationUtil } from "../../../../../utils/dbUtils";

import { authOptions } from "../../../auth/[...nextauth]";

export default async function handler(req, res) {
    const {
        query: { treeMemberId, treeId },
        method,
    } = req;

    const session = await unstable_getServerSession(req, res, authOptions);
    if (!session) {
        res.status(401).json({ message: "You must be logged in." });
        return;
    }

    await dbConnect();

    switch (method) {
        case "POST":
            try {
                //check if session is owner or collaborator
                const isOwnerPromise = getSessionTreeRelationUtil(
                    session,
                    treeId, //treeId
                    "owner"
                );
                const isCollabPromise = getSessionTreeRelationUtil(
                    session,
                    treeId, //treeId
                    "collaborator"
                );
                const [isOwner, isCollab] = await Promise.all([
                    isOwnerPromise,
                    isCollabPromise,
                ]);

                console.log("relation", isOwner, isCollab);

                if (!(isOwner === "owner" || isCollab === "collaborator")) {
                    res.status(400).json({ success: false });
                    return;
                }

                //create unclaimed profile
                const newUnclaimedProfile = await Users.create({
                    ...req.body,
                    owner: session.user.id,
                });
                //update tree member
                const updatedTreeMember = await TreeMembersB.findByIdAndUpdate(
                    treeMemberId,
                    { taggedUser: newUnclaimedProfile._id }
                );
                res.status(201).json({
                    updatedTreeMember,
                    newUnclaimedProfile,
                });
            } catch (error) {
                console.log(error);
                res.status(400).json({ success: false });
            }
            break;
        default:
            res.status(400).json({ success: false });
            break;
    }
}
