import { ObjectId } from "mongodb";
import dbConnect from "../../../../../lib/dbConnect";
import TreeMembersB from "../../../../../models/TreeMembersB";
import { getSessionProfileRelationUtil } from "../../../../../utils/dbUtils";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]";
export default async function handler(req, res) {
    const {
        query: { unclaimedProfileId, claimerId },
        method,
    } = req;

    await dbConnect();

    const session = await unstable_getServerSession(req, res, authOptions);
    if (!session) {
        res.status(401).json({ message: "You must be logged in." });
        return;
    }

    console.log("tree migr", unclaimedProfileId, claimerId);

    const sessionProfileRelation = await getSessionProfileRelationUtil(
        session,
        unclaimedProfileId
    );
    if (sessionProfileRelation !== "owner") {
        res.status(401).json({ message: "UNAUTHORIZED" });
        return;
    }

    switch (method) {
        case "PUT":
            try {
                /*update taggedUser fields of TreeMembersB docs with
                    taggedUser field of unclaimedProfileId
                */

                const treeMembers = await TreeMembersB.bulkWrite([
                    {
                        updateMany: {
                            filter: {
                                taggedUser: ObjectId(unclaimedProfileId),
                            },
                            update: {
                                $set: { taggedUser: ObjectId(claimerId) },
                            },
                        },
                    },
                ]);
                /*if (!treeMembers.acknowledged) {
                    res.status(400).json({ success: false });
                }*/
                res.status(201).json(treeMembers);
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
