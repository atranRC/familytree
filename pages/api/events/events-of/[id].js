import dbConnect from "../../../../lib/dbConnect";
import { ObjectId } from "mongodb";
import Events from "../../../../models/Events";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";
import { getSessionProfileRelationUtil } from "../../../../utils/dbUtils";

const EVENTS_PER_PAGE = 10;

export default async function handler(req, res) {
    let {
        query: { id, searchTerm, page, pageSize },
        method,
    } = req;

    /*const page = p || 1;
    const dbQuery = { userId: id };*/

    const session = await unstable_getServerSession(req, res, authOptions);
    if (!session) {
        res.status(401).json({ message: "You must be logged in." });
        return;
    }
    const sessionProfileRelation = await getSessionProfileRelationUtil(
        session,
        id
    );
    if (
        sessionProfileRelation !== "owner" &&
        sessionProfileRelation !== "self"
    ) {
        res.status(401).json({ message: "UNAUTHORIZED" });
        return;
    }

    await dbConnect();

    switch (method) {
        case "GET":
            /*try {
                const skip = (page - 1) * EVENTS_PER_PAGE;
                const countPromise =
                    //Events.estimatedDocumentCount(dbQuery);
                    Events.countDocuments(dbQuery);
                const eventsPromise = Events.find(dbQuery)
                    .limit(EVENTS_PER_PAGE)
                    .skip(skip)
                    .sort({ eventDate: "descending" });
                const [count, events] = await Promise.all([
                    countPromise,
                    eventsPromise,
                ]);

                const pageCount = Math.floor(count / EVENTS_PER_PAGE) + 1;

                if (!count || !events) {
                    return res.status(400).json({ success: false });
                }
                res.status(200).json({
                    success: true,
                    data: { pagination: { count, pageCount }, events },
                });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;*/

            /*case "PUT" :
            try {
                const writtenStory = await Events.findByIdAndUpdate(
                    id,
                    req.body,
                    {
                        new: true,
                        runValidators: true,
                    }
                );
                if (!writtenStory) {
                    return res.status(400).json({ success: false });
                }
                res.status(200).json({ success: true, data: writtenStory });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        case "DELETE":
            try {
                const deletedWrittenStory = await Events.deleteOne({
                    _id: id,
                });
                if (!deletedWrittenStory) {
                    return res.status(400).json({ success: false });
                }
                res.status(200).json({ success: true, data: {} });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;*/

            try {
                page = parseInt(page, 10) || 1;
                pageSize = parseInt(pageSize, 10) || 10;

                const events = await Events.aggregate([
                    {
                        $facet: {
                            //metadata: [{ $count: "totalCount" }],
                            data: [
                                {
                                    $match: {
                                        userId: ObjectId(id),
                                        description: {
                                            $regex: new RegExp(searchTerm, "i"),
                                        },
                                    },
                                },
                                { $sort: { eventDate: -1 } },
                                { $skip: (page - 1) * pageSize },

                                { $limit: pageSize },
                            ],
                            count: [
                                {
                                    $match: {
                                        userId: ObjectId(id),
                                        description: {
                                            $regex: new RegExp(searchTerm, "i"),
                                        },
                                    },
                                },
                                { $count: "total" },
                            ],
                        },
                    },
                    { $unwind: "$count" },
                    {
                        $addFields: {
                            count: "$count.total",
                        },
                    },
                ]);
                res.status(200).json(events);
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
