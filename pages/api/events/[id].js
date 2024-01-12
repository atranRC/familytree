import dbConnect from "../../../lib/dbConnect";
import { ObjectId } from "mongodb";
import Events from "../../../models/Events";
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
                const event = await Events.findById(id);
                res.status(200).json(event);
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        case "PUT":
            try {
                //allow edit for author or subject only
                const sessionEventRelation =
                    await getSessionEventOrStoryRelation(session, id, "event");

                if (
                    sessionEventRelation.isSubject === false &&
                    sessionEventRelation.isAuthor === false
                ) {
                    res.status(400).json({ message: "UNAUTHORIZED" });
                    return;
                }
                const event = await Events.findByIdAndUpdate(id, req.body, {
                    new: true,
                    runValidators: true,
                });
                res.status(200).json(event);
            } catch (error) {
                console.log(error);
                res.status(400).json({ success: false });
            }
            break;

        case "DELETE":
            try {
                const sessionEventRelation =
                    await getSessionEventOrStoryRelation(session, id, "event");

                if (
                    sessionEventRelation.isSubject === false &&
                    sessionEventRelation.isAuthor === false
                ) {
                    res.status(400).json({ message: "UNAUTHORIZED" });
                    return;
                }

                const event = await Events.findByIdAndDelete(id);

                res.status(200).json(event);
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        default:
            res.status(400).json({ success: false });
            break;
    }
}
