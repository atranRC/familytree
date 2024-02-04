import { unstable_getServerSession } from "next-auth";
import dbConnect from "../../../../../../lib/dbConnect";
import { ObjectId } from "mongodb";
import { authOptions } from "../../../../auth/[...nextauth]";
import TreeMembersB from "../../../../../../models/TreeMembersB";
import axios from "axios";
import { getSessionProfileRelationUtil } from "../../../../../../utils/dbUtils";

export default async function handler(req, res) {
    const {
        query: { id, profileId },
        method,
    } = req;

    await dbConnect();

    const session = await unstable_getServerSession(req, res, authOptions);
    if (!session) {
        res.status(401).json({ message: "You must be logged in." });
        return;
    }

    switch (method) {
        /*        case "GET":
            try {
                res.status(200).json({ success: true, data: doc });
            } catch (error) {
                //console.log(error);
                res.status(400).json({ success: false });
            }
            break;
*/
        case "PUT":
            try {
                const sessionProfileRelation =
                    await getSessionProfileRelationUtil(session, profileId);
                if (
                    sessionProfileRelation === "self" ||
                    sessionProfileRelation === "owner"
                ) {
                    const updatedDoc = await TreeMembersB.findByIdAndUpdate(
                        id,
                        req.body,
                        {
                            new: true,
                            runValidators: true,
                        }
                    );
                    res.status(200).json(updatedDoc);
                } else {
                    res.status(400).json({ success: false });
                }
            } catch (error) {
                console.log(error);
                res.status(400).json({ success: false });
            }
            break;

        case "DELETE":
            try {
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
