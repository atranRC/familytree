import { unstable_getServerSession } from "next-auth";
import dbConnect from "../../../../lib/dbConnect";

import { authOptions } from "../../auth/[...nextauth]";
import { getSessionProfileRelationUtil } from "../../../../utils/dbUtils";
import ClaimRequests from "../../../../models/ClaimRequests";

export default async function handler(req, res) {
    let {
        query: { id, unclaimedProfileId },
        method,
    } = req;

    await dbConnect();

    const session = await unstable_getServerSession(req, res, authOptions);
    if (!session) {
        res.status(401).json({ message: "You must be logged in." });
        return;
    }

    const sessionProfileRelation = await getSessionProfileRelationUtil(
        session,
        unclaimedProfileId
    );
    if (sessionProfileRelation !== "owner") {
        res.status(401).json({ message: "UNAUTHORIZED" });
        return;
    }

    switch (method) {
        case "GET":
            try {
                const claimRequest = await ClaimRequests.findById(id);
                //console.log(unclaimedProfiles);
                res.status(200).json(claimRequest);
            } catch (error) {
                //console.log(error);
                res.status(400).json({ success: false });
            }
            break;
        case "PUT":
            try {
                const claimRequest = await ClaimRequests.findByIdAndUpdate(
                    id,
                    req.body,
                    {
                        new: true,
                        runValidators: true,
                    }
                );
                //console.log(unclaimedProfiles);
                res.status(200).json(claimRequest);
            } catch (error) {
                //console.log(error);
                res.status(400).json({ success: false });
            }
            break;
        default:
            res.status(400).json({ success: false });
            break;
    }
}
