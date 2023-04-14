import { ObjectId } from "mongodb";
import dbConnect from "../../../../lib/dbConnect";
import AudioStories from "../../../../models/AudioStories";
import Events from "../../../../models/Events";
import TreeMembers from "../../../../models/TreeMembers";
import WrittenStories from "../../../../models/WrittenStories";
export default async function handler(req, res) {
    const { method } = req;

    await dbConnect();

    switch (method) {
        case "GET":
            try {
                const famtrees = await TreeMembers.find(
                    {}
                ); /* find all the data in our database */
                res.status(200).json({ success: true, data: famtrees });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        case "PUT":
            try {
                /*const filterIdName = {
                    id: req.body.filterIdName.id,
                };
                const newDataIdName = {
                    $set: {
                        id: req.body.newDataIdName.id,
                        name: req.body.newDataIdName.name,
                    },
                };
                const filterParent = {
                    parent_id: req.body.filterParent.parent_id,
                };
                const newDataParent = {
                    $set: {
                        parent_id: req.body.newDataParent.parent_id,
                    },
                };
                console.log(
                    filterIdName,
                    newDataIdName,
                    filterParent,
                    newDataParent
                );
                const res1 = await TreeMembers.updateMany(
                    filterIdName,
                    newDataIdName
                );*/
                const eventsPromise = Events.updateMany(
                    { userId: ObjectId(req.body.unclaimedUserId) },
                    { $set: { userId: req.body.claimerUserId } }
                );
                const writtenStoriesPromise = WrittenStories.updateMany(
                    { userId: ObjectId(req.body.unclaimedUserId) },
                    { $set: { userId: req.body.claimerUserId } }
                );
                const audioStoriesPromise = AudioStories.updateMany(
                    { userId: ObjectId(req.body.unclaimedUserId) },
                    { $set: { userId: req.body.claimerUserId } }
                );
                const [eventsResult, writtenStoriesResult, audioStoriesResult] =
                    await Promise.all([
                        eventsPromise,
                        writtenStoriesPromise,
                        audioStoriesPromise,
                    ]);
                res.status(200).json({
                    success: true,
                    data: {
                        events: eventsResult,
                        writtenstories: writtenStoriesResult,
                        audioStories: audioStoriesResult,
                    },
                });
                //events
                //written stories
                //voice notes
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
