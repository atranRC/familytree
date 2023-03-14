import dbConnect from "../../../../lib/dbConnect";
import { ObjectId } from "mongodb";
import Articledrafts from "../../../../models/Articledrafts";

const ARTICLEDRAFTS_PER_PAGE = 10;

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
                const skip = (page - 1) * ARTICLEDRAFTS_PER_PAGE;
                const countPromise =
                    //Articledrafts.estimatedDocumentCount(dbQuery);
                    Articledrafts.countDocuments(dbQuery);
                const articledraftsPromise = Articledrafts.find(dbQuery)
                    .limit(ARTICLEDRAFTS_PER_PAGE)
                    .skip(skip)
                    .sort({ date: "descending" });
                const [count, articledrafts] = await Promise.all([
                    countPromise,
                    articledraftsPromise,
                ]);

                const pageCount =
                    Math.floor(count / ARTICLEDRAFTS_PER_PAGE) + 1;

                if (!count || !articledrafts) {
                    return res.status(400).json({ success: false });
                }
                res.status(200).json({
                    success: true,
                    data: { pagination: { count, pageCount }, articledrafts },
                });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        /*case "PUT" :
            try {
                const writtenStory = await Articledrafts.findByIdAndUpdate(
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
                const deletedWrittenStory = await Articledrafts.deleteOne({
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
