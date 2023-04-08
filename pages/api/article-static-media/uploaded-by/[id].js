import dbConnect from "../../../../lib/dbConnect";
import { ObjectId } from "mongodb";
import ArticleStaticMedia from "../../../../models/ArticleStaticMedia";

const MEDIA_PER_PAGE = 10;

export default async function handler(req, res) {
    const {
        query: { id, p },
        method,
    } = req;

    const page = p || 1;
    const dbQuery = { ownerId: id /* isPublished: true*/ };

    await dbConnect();

    switch (method) {
        case "GET" /* Get a model by its ID */:
            try {
                const skip = (page - 1) * MEDIA_PER_PAGE;
                const countPromise =
                    //ArticleStaticMedia.estimatedDocumentCount(dbQuery);
                    ArticleStaticMedia.countDocuments(dbQuery);
                const mediaPromise = ArticleStaticMedia.find(dbQuery)
                    .limit(MEDIA_PER_PAGE)
                    .skip(skip)
                    .sort({ updatedAt: "descending" });
                const [count, media] = await Promise.all([
                    countPromise,
                    mediaPromise,
                ]);

                const pageCount = Math.floor(count / MEDIA_PER_PAGE) + 1;

                if (!count || !media) {
                    return res.status(400).json({ success: false });
                }
                res.status(200).json({
                    success: true,
                    data: { pagination: { count, pageCount }, media },
                });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        default:
            res.status(400).json({ success: false });
            break;
    }
}
