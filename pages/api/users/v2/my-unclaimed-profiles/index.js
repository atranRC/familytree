import { unstable_getServerSession } from "next-auth";
import dbConnect from "../../../../../lib/dbConnect";
import { authOptions } from "../../../auth/[...nextauth]";
import Users from "../../../../../models/Users";

const PAGE_SIZE = 10;

export default async function handler(req, res) {
    let {
        query: { page, pageSize, id, searchTerm },
        method,
    } = req;

    //let { page, pageSize, method } = req.query;

    await dbConnect();

    const session = await unstable_getServerSession(req, res, authOptions);
    if (!session) {
        res.status(401).json({ message: "You must be logged in." });
        return;
    }

    switch (method) {
        case "GET":
            try {
                page = parseInt(page, 10) || 1;
                pageSize = parseInt(pageSize, 10) || 50;

                /*const unclaimedProfiles = await Users.find({
                    owner: session.user.id,
                    { $match: { owner: session.user.id } },
                });*/
                const unclaimedProfiles = await Users.aggregate([
                    {
                        $facet: {
                            //metadata: [{ $count: "totalCount" }],
                            data: [
                                {
                                    $match: {
                                        owner: session.user.id,
                                        name: {
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
                                        owner: session.user.id,
                                        name: {
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
                //console.log(unclaimedProfiles);
                res.status(200).json(unclaimedProfiles);
            } catch (error) {
                console.log(error);
                res.status(400).json({ success: false });
            }
            break;

        /*case "PUT":
            try {
                const sessionProfileRelation =
                    await getSessionProfileRelationUtil(session, profileId);
                if (
                    sessionProfileRelation === "self" ||
                    sessionProfileRelation === "owner"
                ) {
                    const updatedDoc = await TreeMembersB.findByIdAndUpdate(
                        id,
                        req.body,
                        {
                            new: true,
                            runValidators: true,
                        }
                    );
                    res.status(200).json(updatedDoc);
                } else {
                    res.status(400).json({ success: false });
                }
            } catch (error) {
                console.log(error);
                res.status(400).json({ success: false });
            }
            break;*/

        /*case "DELETE":
            try {
                const sessionProfileRelation =
                    await getSessionProfileRelationUtil(session, id);
                if (sessionProfileRelation === "owner") {
                    
                    //remove tagged treemembersb
                    //delete events, written stories, audio stories, claim requests
                    Events.

                    res.status(200).json({ success: true });
                } else {
                    res.status(400).json({ success: false });
                }
            } catch (error) {
                console.log(error);
                res.status(400).json({ success: false });
            }
            break;*/

        default:
            res.status(400).json({ success: false });
            break;
    }
}
