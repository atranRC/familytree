/**
 * update the userid fields of events, writtenStories, and audioStories with
 * userId of unclaimedProfile Id to claimerId
 *
 * leave out birth events as events has a unique compound id
 */
import { ObjectId } from "mongodb";
import dbConnect from "../../../../../lib/dbConnect";
import TreeMembersB from "../../../../../models/TreeMembersB";
import Events from "../../../../../models/Events";
import WrittenStories from "../../../../../models/WrittenStories";
import AudioStories from "../../../../../models/AudioStories";
import { unstable_getServerSession } from "next-auth";
import { getSessionProfileRelationUtil } from "../../../../../utils/dbUtils";
import { authOptions } from "../../../auth/[...nextauth]";

export default async function handler(req, res) {
    const {
        query: { unclaimedProfileId, claimerId, type },
        method,
    } = req;

    await dbConnect();

    const session = await unstable_getServerSession(req, res, authOptions);
    if (!session) {
        res.status(401).json({ message: "You must be logged in." });
        return;
    }

    console.log("stories events", unclaimedProfileId, claimerId);

    const sessionProfileRelation = await getSessionProfileRelationUtil(
        session,
        unclaimedProfileId
    );
    if (sessionProfileRelation !== "owner") {
        res.status(401).json({ message: "UNAUTHORIZED" });
        return;
    }

    switch (method) {
        case "PUT":
            try {
                if (type === "events") {
                    const events = await Events.bulkWrite([
                        {
                            updateMany: {
                                filter: {
                                    userId: ObjectId(unclaimedProfileId),
                                    type: { $ne: "birth" },
                                },
                                update: {
                                    $set: { userId: ObjectId(claimerId) },
                                },
                            },
                        },
                    ]);
                    /*if (!events.acknowledged) {
                        res.status(400).json({ success: false });
                    }*/
                    res.status(201).json(events);
                } else if (type === "writtenStories") {
                    const writtenStories = await WrittenStories.bulkWrite([
                        {
                            updateMany: {
                                filter: {
                                    userId: ObjectId(unclaimedProfileId),
                                },
                                update: {
                                    $set: { userId: ObjectId(claimerId) },
                                },
                            },
                        },
                    ]);
                    /*if (!writtenStories.acknowledged) {
                        res.status(400).json({ success: false });
                    }*/
                    res.status(201).json(writtenStories);
                } else if (type === "audioStories") {
                    const audioStories = await AudioStories.bulkWrite([
                        {
                            updateMany: {
                                filter: {
                                    userId: ObjectId(unclaimedProfileId),
                                },
                                update: {
                                    $set: { userId: ObjectId(claimerId) },
                                },
                            },
                        },
                    ]);
                    /*if (!audioStories.acknowledged) {
                        res.status(400).json({ success: false });
                    }*/
                    res.status(201).json(audioStories);
                } else {
                    res.status(400).json({ success: false });
                }
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
