import dbConnect from "../../../../../lib/dbConnect";
import { authOptions } from "../../../auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth";
import TreeMembersB from "../../../../../models/TreeMembersB";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
    const {
        query: { taggedUser },
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
                const trees = await TreeMembersB.find({
                    taggedUser: ObjectId(taggedUser),
                });
                res.status(200).json(trees);
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        default:
            res.status(400).json({ success: false });
            break;
    }
}
