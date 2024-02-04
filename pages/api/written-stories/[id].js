import dbConnect from "../../../lib/dbConnect";
import { ObjectId } from "mongodb";
import WrittenStories from "../../../models/WrittenStories";
import { unstable_getServerSession } from "next-auth";
import {
    getSessionEventOrStoryRelation,
    getSessionProfileRelationUtil,
} from "../../../utils/dbUtils";
import { authOptions } from "../auth/[...nextauth]";

const ITEMS_PER_PAGE = 10;

export default async function handler(req, res) {
    const {
        query: { id },
        method,
    } = req;
    const session = await unstable_getServerSession(req, res, authOptions);
    if (!session) {
        res.status(401).json({ message: "You must be logged in." });
        return;
    }
    await dbConnect();

    switch (method) {
        case "GET":
            try {
                const story = await WrittenStories.findById(id);
                res.status(200).json(story);
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        case "PUT":
            try {
                //allow edit for author or subject only
                const sessionStoryRelation =
                    await getSessionEventOrStoryRelation(
                        session,
                        id,
                        "written_story"
                    );

                if (
                    sessionStoryRelation.isSubject === false &&
                    sessionStoryRelation.isAuthor === false
                ) {
                    res.status(400).json({ message: "UNAUTHORIZED" });
                    return;
                }
                const story = await WrittenStories.findByIdAndUpdate(
                    id,
                    req.body,
                    {
                        new: true,
                        runValidators: true,
                    }
                );
                res.status(200).json(story);
            } catch (error) {
                console.log(error);
                res.status(400).json({ success: false });
            }
            break;

        case "DELETE":
            try {
                const sessionStoryRelation =
                    await getSessionEventOrStoryRelation(
                        session,
                        id,
                        "written_story"
                    );

                if (
                    sessionStoryRelation.isSubject === false &&
                    sessionStoryRelation.isAuthor === false
                ) {
                    res.status(400).json({ message: "UNAUTHORIZED" });
                    return;
                }

                const story = await WrittenStories.findByIdAndDelete(id);

                res.status(200).json(story);
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
