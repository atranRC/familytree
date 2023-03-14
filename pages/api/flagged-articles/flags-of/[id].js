import dbConnect from "../../../../lib/dbConnect";
import { ObjectId } from "mongodb";
import FlaggedArticles from "../../../../models/FlaggedArticles";

const FLAGS_PER_PAGE = 10;

export default async function handler(req, res) {
    const {
        query: { id, p },
        method,
    } = req;

    const page = p || 1;
    const dbQuery = { articleId: id };

    await dbConnect();

    switch (method) {
        case "GET" /* Get a model by its ID */:
            try {
                const skip = (page - 1) * FLAGS_PER_PAGE;
                const countPromise =
                    //FlaggedArticles.estimatedDocumentCount(dbQuery);
                    FlaggedArticles.countDocuments(dbQuery);
                const flaggedArticlesPromise = FlaggedArticles.find(dbQuery)
                    .limit(FLAGS_PER_PAGE)
                    .skip(skip)
                    .sort({ createdAt: "descending" });
                const [count, flaggedArticles] = await Promise.all([
                    countPromise,
                    flaggedArticlesPromise,
                ]);

                const pageCount = Math.floor(count / FLAGS_PER_PAGE) + 1;

                if (!count || !flaggedArticles) {
                    return res.status(400).json({ success: false });
                }
                res.status(200).json({
                    success: true,
                    data: { pagination: { count, pageCount }, flaggedArticles },
                });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        /*case "PUT" :
            try {
                const writtenStory = await FlaggedArticles.findByIdAndUpdate(
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
                const deletedWrittenStory = await FlaggedArticles.deleteOne({
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
