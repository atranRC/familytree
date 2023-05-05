import dbConnect from "../../../../lib/dbConnect";
import { ObjectId } from "mongodb";
import WrittenStories from "../../../../models/WrittenStories";
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
                    //WrittenStories.estimatedDocumentCount(dbQuery);
                    WrittenStories.countDocuments({
                        userId: { $in: taggedUsersObjectIds },
                    });
                const writtenStoriesPromise = WrittenStories.find({
                    userId: { $in: taggedUsersObjectIds },
                })
                    .limit(STORIES_PER_PAGE)
                    .skip(skip)
                    .sort({ updatedAt: sortOption });

                /*const writtenStoriesOfTreeMembers = await WrittenStories.find({
                    userId: { $in: taggedUsersObjectIds },
                }).sort({ eventDate: sortOption });*/

                const [count, writtenStories] = await Promise.all([
                    countPromise,
                    writtenStoriesPromise,
                ]);

                const pageCount = Math.floor(count / STORIES_PER_PAGE) + 1;

                /*if (!count || !writtenStories) {
                    console.log("wstories", writtenStories);
                    return res.status(400).json({ success: false });
                }*/

                res.status(200).json({
                    success: true,
                    data: { pagination: { count, pageCount }, writtenStories },
                });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        /*case "PUT" :
            try {
                const writtenStory = await WrittenStories.findByIdAndUpdate(
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
                const deletedWrittenStory = await WrittenStories.deleteOne({
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
