import { unstable_getServerSession } from "next-auth";
import dbConnect from "../../../lib/dbConnect";
import Events from "../../../models/Events";
import { authOptions } from "../auth/[...nextauth]";
import { getSessionProfileRelation } from "../../../utils/dbUtils";

export default async function handler(req, res) {
    const { method } = req;

    const session = await unstable_getServerSession(req, res, authOptions);
    if (!session) {
        res.status(401).json({ message: "You must be logged in." });
        return;
    }

    await dbConnect();

    switch (method) {
        /*case "GET":
            try {
                const events = await Events.find(
                    {}
                ); 
                res.status(200).json({ success: true, data: events });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;*/
        case "POST":
            try {
                const sessionProfileRelation = await getSessionProfileRelation(
                    session,
                    req.body.userId
                );
                if (
                    !sessionProfileRelation.isSelf &&
                    !sessionProfileRelation.isOwner &&
                    !sessionProfileRelation.isRelativeWithPost
                ) {
                    res.status(401).json({ message: "UNAUTHORIZED" });
                    return;
                }
                const event = await Events.create({
                    ...req.body,
                    authorId: session.user.id,
                    authorName: session.user.name,
                });
                res.status(201).json(event);
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
