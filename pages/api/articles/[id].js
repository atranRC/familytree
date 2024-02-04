import dbConnect from "../../../lib/dbConnect";
import { ObjectId } from "mongodb";
import Articles from "../../../models/Articles";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
    const {
        query: { id },
        method,
    } = req;

    const session = await unstable_getServerSession(req, res, authOptions);
    if (!session) {
        res.status(401).json({ message: "You must be logged in." });
        return;
    }

    await dbConnect();

    switch (method) {
        case "GET" /* Get a model by its ID */:
            try {
                const article = await Articles.findById(id);
                if (!article) {
                    return res.status(400).json({ success: false });
                }
                res.status(200).json({ success: true, data: article });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        case "PUT" /* Edit a model by its ID */:
            try {
                const article = await Articles.findByIdAndUpdate(id, req.body, {
                    new: true,
                    runValidators: true,
                });
                if (!article) {
                    return res.status(400).json({ success: false });
                }
                res.status(200).json({ success: true, data: article });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        case "DELETE" /* Delete a model by its ID */:
            try {
                const deletedArticle = await Articles.deleteOne({
                    _id: id,
                });
                if (!deletedArticle) {
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
