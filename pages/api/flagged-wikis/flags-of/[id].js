import dbConnect from "../../../../lib/dbConnect";
import { ObjectId } from "mongodb";
import FlaggedWikis from "../../../../models/FlaggedWikis";

const FLAGS_PER_PAGE = 10;

export default async function handler(req, res) {
    const {
        query: { id, p },
        method,
    } = req;

    const page = p || 1;
    const dbQuery = { wikiId: id };

    await dbConnect();

    switch (method) {
        case "GET" /* Get a model by its ID */:
            try {
                const skip = (page - 1) * FLAGS_PER_PAGE;
                const countPromise =
                    //FlaggedWikis.estimatedDocumentCount(dbQuery);
                    FlaggedWikis.countDocuments(dbQuery);
                const flaggedWikisPromise = FlaggedWikis.find(dbQuery)
                    .limit(FLAGS_PER_PAGE)
                    .skip(skip)
                    .sort({ createdAt: "descending" });
                const [count, flaggedWikis] = await Promise.all([
                    countPromise,
                    flaggedWikisPromise,
                ]);

                const pageCount = Math.floor(count / FLAGS_PER_PAGE) + 1;

                if (!count || !flaggedWikis) {
                    return res.status(400).json({ success: false });
                }
                res.status(200).json({
                    success: true,
                    data: { pagination: { count, pageCount }, flaggedWikis },
                });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        /*case "PUT" :
            try {
                const writtenStory = await FlaggedWikis.findByIdAndUpdate(
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
                const deletedWrittenStory = await FlaggedWikis.deleteOne({
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
