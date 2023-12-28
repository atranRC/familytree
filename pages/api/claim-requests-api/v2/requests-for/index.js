import dbConnect from "../../../../../lib/dbConnect";
import { authOptions } from "../../../auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth";
import { getSessionProfileRelationUtil } from "../../../../../utils/dbUtils";
import ClaimRequests from "../../../../../models/ClaimRequests";

export default async function handler(req, res) {
    let {
        query: { page, pageSize, profileId },
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
        profileId
    );
    if (sessionProfileRelation !== "owner") {
        res.status(401).json({ message: "UNAUTHORIZED" });
        return;
    }

    switch (method) {
        case "GET":
            try {
                page = parseInt(page, 10) || 1;
                pageSize = parseInt(pageSize, 10) || 50;
                //
                const claimRequests = await ClaimRequests.aggregate([
                    {
                        $facet: {
                            metadata: [{ $count: "totalCount" }],
                            data: [
                                { $match: { targetId: profileId } },
                                { $skip: (page - 1) * pageSize },
                                { $limit: pageSize },
                            ],
                        },
                    },
                ]);
                res.status(200).json(claimRequests);
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        default:
            res.status(400).json({ success: false });
            break;
    }
}
