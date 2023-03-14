import dbConnect from "../../../../lib/dbConnect";
import { ObjectId } from "mongodb";

import WrittenStories from "../../../../models/WrittenStories";

const STORIES_PER_PAGE = 10;

export default async function handler(req, res) {
    const {
        query: { id, p },
        method,
    } = req;

    const page = p || 1;
    const dbQuery = { userId: id };

    await dbConnect();

    switch (method) {
        case "GET" /* Get a model by its ID */:
            try {
                const skip = (page - 1) * STORIES_PER_PAGE;
                const countPromise =
                    //WrittenStories.estimatedDocumentCount(dbQuery);
                    WrittenStories.countDocuments(dbQuery);
                const storiesPromise = WrittenStories.find(dbQuery)
                    .limit(STORIES_PER_PAGE)
                    .skip(skip)
                    .sort({ createdAt: "descending" });
                const [count, stories] = await Promise.all([
                    countPromise,
                    storiesPromise,
                ]);

                const pageCount = Math.floor(count / STORIES_PER_PAGE) + 1;

                if (!count || !stories) {
                    return res.status(400).json({ success: false });
                }
                res.status(200).json({
                    success: true,
                    data: { pagination: { count, pageCount }, stories },
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
