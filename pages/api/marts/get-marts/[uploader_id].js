import dbConnect from "../../../../lib/dbConnect";
import { ObjectId } from "mongodb";
import Marts from "../../../../models/Marts";

const PAGE_SIZE = 10;

export default async function handler(req, res) {
    const {
        query: { uploader_id, p },
        method,
    } = req;

    const page = p || 1;
    let dbQuery = { uploaderId: ObjectId(uploader_id) };

    await dbConnect();

    switch (method) {
        case "GET":
            try {
                const skip = (page - 1) * PAGE_SIZE;
                const countPromise =
                    //Marts.estimatedDocumentCount(dbQuery);
                    Marts.countDocuments(dbQuery);
                const docsPromise = Marts.find(dbQuery)
                    .limit(PAGE_SIZE)
                    .skip(skip)
                    .sort({ updatedAt: "descending" });
                const [count, docs] = await Promise.all([
                    countPromise,
                    docsPromise,
                ]);

                const pageCount = Math.floor(count / PAGE_SIZE) + 1;

                /*if (!count || !docs) {
                    return res
                        .status(200)
                        .json({ success: false, result: "NO_DATA" });
                }*/
                res.status(200).json({
                    success: true,
                    data: { pagination: { count, pageCount }, docs },
                });
                /*res.status(200).json({
                    count,
                    docs,
                });*/
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        default:
            res.status(400).json({ success: false });
            break;
    }
}
