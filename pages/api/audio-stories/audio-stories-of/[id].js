import dbConnect from "../../../../lib/dbConnect";
import { ObjectId } from "mongodb";
import AudioStories from "../../../../models/AudioStories";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";
import { getSessionProfileRelationUtil } from "../../../../utils/dbUtils";

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
    /*const sessionProfileRelation = await getSessionProfileRelationUtil(
        session,
        id
    );
    if (
        sessionProfileRelation !== "owner" &&
        sessionProfileRelation !== "self"
    ) {
        res.status(401).json({ message: "UNAUTHORIZED" });
        return;
    }*/

    await dbConnect();

    switch (method) {
        case "GET":
            try {
                page = parseInt(page, 10) || 1;
                pageSize = parseInt(pageSize, 10) || 10;

                const stories = await AudioStories.aggregate([
                    {
                        $facet: {
                            //metadata: [{ $count: "totalCount" }],
                            data: [
                                {
                                    $match: {
                                        userId: ObjectId(id),
                                        title: {
                                            $regex: new RegExp(searchTerm, "i"),
                                        },
                                    },
                                },
                                { $sort: { updatedAt: -1 } },
                                { $skip: (page - 1) * pageSize },
                                { $limit: pageSize },
                            ],
                            count: [
                                {
                                    $match: {
                                        userId: ObjectId(id),
                                        title: {
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
                res.status(200).json(stories);
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
