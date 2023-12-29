import { unstable_getServerSession } from "next-auth";
import dbConnect from "../../../../lib/dbConnect";
import { authOptions } from "../../auth/[...nextauth]";
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

    switch (method) {
        case "POST":
            try {
                const claimRequest = await ClaimRequests.create(req.body);
                //console.log(unclaimedProfiles);
                res.status(200).json(claimRequest);
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
