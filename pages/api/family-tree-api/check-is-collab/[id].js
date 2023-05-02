import dbConnect from "../../../../lib/dbConnect";
import { ObjectId } from "mongodb";
import Collabs from "../../../../models/Collabs";

export default async function handler(req, res) {
    const {
        query: { id, userId },
        method,
    } = req;

    await dbConnect();

    switch (method) {
        case "GET":
            try {
                /*const flaggedArticle = await FlaggedArticles.findById(id);
                if (!flaggedArticle) {
                    return res.status(400).json({ success: false });
                }*/
                Collabs.exists(
                    { treeId: id, userId: userId },
                    function (err, doc) {
                        if (err) {
                            res.status(400).json({ success: false });
                        } else {
                            console.log("Result :", doc);
                            res.status(200).json({
                                success: true,
                                data: doc,
                            });
                        }
                    }
                );
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        /*case "PUT":
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
            break;

        case "DELETE":
            try {
                const deletedArticledraft = await FlaggedArticles.deleteOne({
                    _id: id,
                });
                if (!deletedArticledraft) {
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
