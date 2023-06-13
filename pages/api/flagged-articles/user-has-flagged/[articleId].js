import dbConnect from "../../../../lib/dbConnect";
import { ObjectId } from "mongodb";
import FlaggedArticles from "../../../../models/FlaggedArticles";

export default async function handler(req, res) {
    const {
        query: { articleId, email },
        method,
    } = req;

    await dbConnect();

    switch (method) {
        case "GET":
            try {
                const flaggedArticle = await FlaggedArticles.findOne({
                    articleId: ObjectId(articleId),
                    flaggedBy: email,
                });
                if (!flaggedArticle) {
                    return res.status(200).json({ isFlaggedByUser: false });
                }
                res.status(200).json({
                    isFlaggedByUser: true,
                    data: flaggedArticle,
                });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        /*
        case "PUT":
            try {
                const flaggedArticle = await FlaggedArticles.findByIdAndUpdate(
                    id,
                    req.body,
                    {
                        new: true,
                        runValidators: true,
                    }
                );
                if (!flaggedArticle) {
                    return res.status(400).json({ success: false });
                }
                res.status(200).json({ success: true, data: flaggedArticle });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;*/

        case "DELETE":
            try {
                console.log("deleting: ", articleId, email);
                const deletedArticleFlag = await FlaggedArticles.deleteMany({
                    articleId: ObjectId(articleId),
                    flaggedBy: email,
                });
                if (!deletedArticleFlag) {
                    return res.status(400).json({ success: false });
                }
                res.status(200).json({ success: true, data: {} });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        default:
            res.status(400).json({ success: false });
            break;
    }
}
