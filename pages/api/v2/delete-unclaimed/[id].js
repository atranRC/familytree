import { unstable_getServerSession } from "next-auth";
import dbConnect from "../../../../lib/dbConnect";
import Users from "../../../../models/Users";
import { authOptions } from "../../auth/[...nextauth]";
import Events from "../../../../models/Events";
import { getSessionProfileRelationUtil } from "../../../../utils/dbUtils";
import WrittenStories from "../../../../models/WrittenStories";
import AudioStories from "../../../../models/AudioStories";
import TreeMembersB from "../../../../models/TreeMembersB";
import { ObjectId } from "mongodb";

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
        case "DELETE":
            try {
                const sessionProfileRelation =
                    await getSessionProfileRelationUtil(session, id);
                if (sessionProfileRelation !== "owner") {
                    res.status(401).json({ message: "UNAUTHORIZED" });
                    return;
                }
                //delete user
                const userPromise = Users.findByIdAndDelete(id);

                //flag events
                const eventsPromise = Events.bulkWrite([
                    {
                        updateMany: {
                            filter: {
                                userId: ObjectId(id),
                            },
                            update: {
                                $set: { deletedAt: Date.now() },
                            },
                        },
                    },
                ]);
                //flag written stories
                const writtenStoriesPromise = WrittenStories.bulkWrite([
                    {
                        updateMany: {
                            filter: {
                                userId: ObjectId(id),
                            },
                            update: {
                                $set: { deletedAt: Date.now() },
                            },
                        },
                    },
                ]);
                //flag audio stories
                const audioStoriesPromise = AudioStories.bulkWrite([
                    {
                        updateMany: {
                            filter: {
                                userId: ObjectId(id),
                            },
                            update: {
                                $set: { deletedAt: Date.now() },
                            },
                        },
                    },
                ]);
                //flag treemembersb
                const membershipsPromise = TreeMembersB.bulkWrite([
                    {
                        updateMany: {
                            filter: {
                                taggedUser: ObjectId(id),
                            },
                            update: {
                                $set: { taggedUser: null },
                            },
                        },
                    },
                ]);

                const [
                    user,
                    events,
                    writtenStories,
                    audioStories,
                    memberships,
                ] = await Promise.all([
                    userPromise,
                    eventsPromise,
                    writtenStoriesPromise,
                    audioStoriesPromise,
                    membershipsPromise,
                ]);
                res.status(200).json({
                    events,
                    writtenStories,
                    audioStories,
                    memberships,
                });
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
