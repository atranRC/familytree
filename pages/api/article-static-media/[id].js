import dbConnect from "../../../lib/dbConnect";
import { ObjectId } from "mongodb";
import ArticleStaticMedia from "../../../models/ArticleStaticMedia";

export default async function handler(req, res) {
    const {
        query: { id },
        method,
    } = req;

    await dbConnect();

    switch (method) {
        case "GET" /* Get a model by its ID */:
            try {
                const media = await ArticleStaticMedia.findById(id);
                if (!media) {
                    return res.status(400).json({ success: false });
                }
                res.status(200).json({ success: true, data: media });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        case "PUT" /* Edit a model by its ID */:
            try {
                const media = await ArticleStaticMedia.findByIdAndUpdate(
                    id,
                    req.body,
                    {
                        new: true,
                        runValidators: true,
                    }
                );
                if (!media) {
                    return res.status(400).json({ success: false });
                }
                res.status(200).json({ success: true, data: media });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        case "DELETE" /* Delete a model by its ID */:
            try {
                const deletedMedia = await ArticleStaticMedia.deleteOne({
                    _id: id,
                });
                if (!deletedMedia) {
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
