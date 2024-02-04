import dbConnect from "../../../../lib/dbConnect";
import { ObjectId } from "mongodb";
import ArticleSharedWrittenStories from "../../../../models/ArticleSharedWrittenStories";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

const STORIES_PER_PAGE = 10;

export default async function handler(req, res) {
    const {
        query: { p },
        method,
    } = req;

    const session = await unstable_getServerSession(req, res, authOptions);
    if (!session) {
        res.status(401).json({ message: "You must be logged in." });
        return;
    }

    const page = p || 1;
    const dbQuery = { uploaderId: session.user.id };

    await dbConnect();

    //console.log(id);
    switch (method) {
        case "GET":
            try {
                const skip = (page - 1) * STORIES_PER_PAGE;
                const countPromise =
                    ArticleSharedWrittenStories.countDocuments(dbQuery);
                const docsPromise = ArticleSharedWrittenStories.find(dbQuery)
                    .limit(STORIES_PER_PAGE)
                    .skip(skip)
                    .sort({ createdAt: "descending" });
                const [count, docs] = await Promise.all([
                    countPromise,
                    docsPromise,
                ]);

                const pageCount = Math.floor(count / STORIES_PER_PAGE) + 1;

                res.status(200).json({
                    success: true,
                    data: { pagination: { count, pageCount }, docs },
                });
            } catch (error) {
                //console.log(error);
                res.status(400).json({ success: false });
            }
            break;
        default:
            res.status(400).json({ success: false });
            break;
    }
}
