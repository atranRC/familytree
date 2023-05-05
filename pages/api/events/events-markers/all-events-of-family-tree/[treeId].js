import dbConnect from "../../../../../lib/dbConnect";
import { ObjectId } from "mongodb";
import Events from "../../../../../models/Events";
import TreeMembersB from "../../../../../models/TreeMembersB";

export default async function handler(req, res) {
    const {
        query: { treeId, sort },
        method,
    } = req;

    /*const dbQuery = {
        userId: { $in: taggedUsersObjectIds },
    };*/

    const sortOption = sort === "asc" ? 1 : -1;

    await dbConnect();

    switch (method) {
        case "GET" /* Get a model by its ID */:
            try {
                const treeMembers = await TreeMembersB.find(
                    { treeId: treeId },
                    "taggedUser"
                );
                let taggedUsersIds = [];
                treeMembers.map((tm) => {
                    if (
                        tm.taggedUser &&
                        !taggedUsersIds.includes(tm.taggedUser.toString())
                    ) {
                        taggedUsersIds.push(tm.taggedUser.toString());
                    }
                });
                const taggedUsersObjectIds = taggedUsersIds.map((tui) => {
                    return ObjectId(tui);
                });

                const events = await Events.find(
                    {
                        userId: { $in: taggedUsersObjectIds },
                    },
                    "_id type userName location"
                ).sort({ eventDate: sortOption });

                /*const eventsOfTreeMembers = await Events.find({
                    userId: { $in: taggedUsersObjectIds },
                }).sort({ eventDate: sortOption });*/

                if (!events) {
                    return res.status(400).json({ success: false });
                }
                res.status(200).json({
                    success: true,
                    data: events,
                });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

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

        default:
            res.status(400).json({ success: false });
            break;
    }
}
