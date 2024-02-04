import { unstable_getServerSession } from "next-auth";
import dbConnect from "../../../lib/dbConnect";
import AudioStories from "../../../models/AudioStories";
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
                const story = await AudioStories.create({
                    ...req.body,
                    authorId: session.user.id,
                    authorName: session.user.name,
                });
                res.status(201).json(story);
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
