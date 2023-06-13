import dbConnect from "../../../../lib/dbConnect";
import { ObjectId } from "mongodb";
import Wikis from "../../../../models/Wikis";

const WIKIS_PER_PAGE = 10;

export default async function handler(req, res) {
    const {
        query: { p, searchTerm },
        method,
    } = req;

    const page = p || 1;
    const dbQuery = [
        {
            $search: {
                index: "wikisIndex",
                text: {
                    query: searchTerm,
                    path: {
                        wildcard: "*",
                    },
                    fuzzy: {
                        maxExpansions: 100,
                        maxEdits: 2,
                    },
                },
            },
        },
    ];

    await dbConnect();

    switch (method) {
        case "GET":
            try {
                const skip = (page - 1) * WIKIS_PER_PAGE;
                const countPromise =
                    //Wikis.estimatedDocumentCount(dbQuery);
                    Wikis.countDocuments(dbQuery);
                const wikisPromise = Wikis.aggregate(dbQuery)
                    .limit(WIKIS_PER_PAGE)
                    .skip(skip);
                // .sort({ date: "descending" });
                const [count, wikis] = await Promise.all([
                    countPromise,
                    wikisPromise,
                ]);

                const pageCount = Math.floor(count / WIKIS_PER_PAGE) + 1;

                if (!count || !wikis) {
                    console.log("helloo");
                    return res.status(400).json({ success: false });
                }
                res.status(200).json({
                    success: true,
                    data: { pagination: { count, pageCount }, wikis },
                });
            } catch (error) {
                console.log(error);
                res.status(400).json({ success: false });
            }
            break;

        /*case "PUT" :
            try {
                const writtenStory = await Wikis.findByIdAndUpdate(
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
                const deletedWrittenStory = await Wikis.deleteOne({
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
