import dbConnect from "../../../../lib/dbConnect";
import { ObjectId } from "mongodb";

const STORIES_PER_PAGE = 10;

export default async function handler(req, res) {
    const {
        query: { id, p },
        method,
    } = req;

    const page = p || 1;
    const dbQuery = { authorId: id };

    await dbConnect();

    switch (method) {
        case "GET":
            try {
                const skip = (page - 1) * STORIES_PER_PAGE;
                const countPromise =
                    ArticleSharedWrittenStories.countDocuments(dbQuery);
                const storiesPromise = ArticleSharedWrittenStories.find(dbQuery)
                    .limit(STORIES_PER_PAGE)
                    .skip(skip)
                    .sort({ date: "descending" });
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
        default:
            res.status(400).json({ success: false });
            break;
    }
}
