import dbConnect from "../../../../lib/dbConnect";
import { ObjectId } from "mongodb";
import Articles from "../../../../models/Articles";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

const ARTICLES_PER_PAGE = 10;

export default async function handler(req, res) {
    const {
        query: { id, p },
        method,
    } = req;

    const session = await unstable_getServerSession(req, res, authOptions);
    if (!session) {
        res.status(401).json({ message: "You must be logged in." });
        return;
    }

    const page = p || 1;
    const dbQuery = { authorId: session.user.id /* isPublished: true*/ };

    await dbConnect();

    switch (method) {
        case "GET" /* Get a model by its ID */:
            try {
                const skip = (page - 1) * ARTICLES_PER_PAGE;
                const countPromise =
                    //Articles.estimatedDocumentCount(dbQuery);
                    Articles.countDocuments(dbQuery);
                const articlesPromise = Articles.find(dbQuery)
                    .limit(ARTICLES_PER_PAGE)
                    .skip(skip)
                    .sort({ date: "descending" });
                const [count, articles] = await Promise.all([
                    countPromise,
                    articlesPromise,
                ]);

                const pageCount = Math.floor(count / ARTICLES_PER_PAGE) + 1;

                if (!count || !articles) {
                    return res.status(400).json({ success: false });
                }
                res.status(200).json({
                    success: true,
                    data: { pagination: { count, pageCount }, articles },
                });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        /*case "PUT" :
            try {
                const writtenStory = await Articles.findByIdAndUpdate(
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
                const deletedWrittenStory = await Articles.deleteOne({
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
