import dbConnect from "../../../../../lib/dbConnect";
import { ObjectId } from "mongodb";
import AudioStories from "../../../../../models/AudioStories";
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

                const audioStories = await AudioStories.find(
                    {
                        userId: { $in: taggedUsersObjectIds },
                    },
                    "_id title audioUrl userName location"
                ).sort({ eventDate: sortOption });

                if (!audioStories) {
                    return res.status(400).json({ success: false });
                }
                res.status(200).json({
                    success: true,
                    data: audioStories,
                });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        /*case "PUT" :
            try {
                const audioStory = await AudioStories.findByIdAndUpdate(
                    id,
                    req.body,
                    {
                        new: true,
                        runValidators: true,
                    }
                );
                if (!audioStory) {
                    return res.status(400).json({ success: false });
                }
                res.status(200).json({ success: true, data: audioStory });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        case "DELETE":
            try {
                const deletedaudioStory = await AudioStories.deleteOne({
                    _id: id,
                });
                if (!deletedaudioStory) {
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
