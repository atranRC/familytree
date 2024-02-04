import { unstable_getServerSession } from "next-auth";
import dbConnect from "../../../../../lib/dbConnect";
import TreeMembersB from "../../../../../models/TreeMembersB";
import { getSessionTreeRelationUtil } from "../../../../../utils/dbUtils";
import { authOptions } from "../../../auth/[...nextauth]";

export default async function handler(req, res) {
    const {
        query: { id, treeId },
        method,
    } = req;

    const session = await unstable_getServerSession(req, res, authOptions);
    if (!session) {
        res.status(401).json({ message: "You must be logged in." });
        return;
    }

    await dbConnect();

    switch (method) {
        case "PUT":
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

                if (!(isOwner === "owner" || isCollab === "collaborator")) {
                    res.status(400).json({ success: false });
                    return;
                }
                //update tree member
                const updatedTreeMember = await TreeMembersB.findByIdAndUpdate(
                    id,
                    req.body
                );
                res.status(201).json(updatedTreeMember);
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
