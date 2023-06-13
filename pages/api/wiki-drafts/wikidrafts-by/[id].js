import dbConnect from "../../../../lib/dbConnect";
import { ObjectId } from "mongodb";
import Wikidrafts from "../../../../models/Wikidrafts";

const WIKIDRAFTS_PER_PAGE = 10;

export default async function handler(req, res) {
    const {
        query: { id, p },
        method,
    } = req;

    const page = p || 1;
    const dbQuery = { authorId: id };

    await dbConnect();

    switch (method) {
        case "GET" /* Get a model by its ID */:
            try {
                const skip = (page - 1) * WIKIDRAFTS_PER_PAGE;
                const countPromise =
                    //Wikidrafts.estimatedDocumentCount(dbQuery);
                    Wikidrafts.countDocuments(dbQuery);
                const wikidraftsPromise = Wikidrafts.find(dbQuery)
                    .limit(WIKIDRAFTS_PER_PAGE)
                    .skip(skip)
                    .sort({ date: "descending" });
                const [count, wikidrafts] = await Promise.all([
                    countPromise,
                    wikidraftsPromise,
                ]);

                const pageCount = Math.floor(count / WIKIDRAFTS_PER_PAGE) + 1;

                if (!count || !wikidrafts) {
                    return res.status(400).json({ success: false });
                }
                res.status(200).json({
                    success: true,
                    data: { pagination: { count, pageCount }, wikidrafts },
                });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        /*case "PUT" :
            try {
                const writtenStory = await Wikidrafts.findByIdAndUpdate(
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
                const deletedWrittenStory = await Wikidrafts.deleteOne({
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
