import dbConnect from "../../../../../lib/dbConnect";
import { authOptions } from "../../../auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth";
import Users from "../../../../../models/Users";

export default async function handler(req, res) {
    const {
        query: { profileId },
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
                let sessionProfileRelation = "none";
                const profile = await Users.findById(profileId);

                if (session.user.id === profileId) {
                    sessionProfileRelation = "self";
                } else if (session.user.id === profile?.owner) {
                    sessionProfileRelation = "owner";
                }
                res.status(200).json({ sessionProfileRelation, profile });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        default:
            res.status(400).json({ success: false });
            break;
    }
}
