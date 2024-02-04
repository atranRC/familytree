import dbConnect from "../../../../../lib/dbConnect";
import { authOptions } from "../../../auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth";
import Users from "../../../../../models/Users";
import { getSessionTreeRelationUtil } from "../../../../../utils/dbUtils";

export default async function handler(req, res) {
    const {
        query: { treeId },
        method,
    } = req;

    await dbConnect();

    switch (method) {
        case "GET":
            try {
                const session = await unstable_getServerSession(
                    req,
                    res,
                    authOptions
                );
                if (!session) {
                    res.status(401).json({ message: "You must be logged in." });
                    return;
                }
                const ownerStatusPromise = getSessionTreeRelationUtil(
                    session,
                    treeId,
                    "owner"
                );
                const memberStatusPromise = getSessionTreeRelationUtil(
                    session,
                    treeId,
                    "member"
                );
                const collabStatusPromise = getSessionTreeRelationUtil(
                    session,
                    treeId,
                    "collaborator"
                );

                const [ownerStatus, memberStatus, collabStatus] =
                    await Promise.all([
                        ownerStatusPromise,
                        memberStatusPromise,
                        collabStatusPromise,
                    ]);

                res.status(200).json({
                    isOwner: ownerStatus === "owner",
                    isMember: memberStatus === "member",
                    isCollab: collabStatus === "collaborator",
                });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        default:
            res.status(400).json({ success: false });
            break;
    }
}
