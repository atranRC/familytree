import dbConnect from "../../../../lib/dbConnect";
import { ObjectId } from "mongodb";
import AudioStories from "../../../../models/AudioStories";
import TreeMembersB from "../../../../models/TreeMembersB";

const STORIES_PER_PAGE = 10;

export default async function handler(req, res) {
    const {
        query: { treeId, p, sort },
        method,
    } = req;

    const page = p || 1;
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

                const skip = (page - 1) * STORIES_PER_PAGE;
                const countPromise =
                    //AudioStories.estimatedDocumentCount(dbQuery);
                    AudioStories.countDocuments({
                        userId: { $in: taggedUsersObjectIds },
                    });
                const audioStoriesPromise = AudioStories.find({
                    userId: { $in: taggedUsersObjectIds },
                })
                    .limit(STORIES_PER_PAGE)
                    .skip(skip)
                    .sort({ updatedAt: sortOption });

                /*const audioStoriesOfTreeMembers = await AudioStories.find({
                    userId: { $in: taggedUsersObjectIds },
                }).sort({ eventDate: sortOption });*/

                const [count, audioStories] = await Promise.all([
                    countPromise,
                    audioStoriesPromise,
                ]);

                const pageCount = Math.floor(count / STORIES_PER_PAGE) + 1;

                /*if (!count || !audioStories) {
                    return res.status(400).json({ success: false });
                }*/
                res.status(200).json({
                    success: true,
                    data: { pagination: { count, pageCount }, audioStories },
                });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        /*case "PUT" :
            try {
                const writtenStory = await AudioStories.findByIdAndUpdate(
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
                const deletedWrittenStory = await AudioStories.deleteOne({
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
