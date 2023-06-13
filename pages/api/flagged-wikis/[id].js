import dbConnect from "../../../lib/dbConnect";
import { ObjectId } from "mongodb";
import FlaggedWikis from "../../../models/FlaggedWikis";

export default async function handler(req, res) {
    const {
        query: { id },
        method,
    } = req;

    await dbConnect();

    switch (method) {
        case "GET":
            try {
                const flaggedWiki = await FlaggedWikis.findById(id);
                if (!flaggedWiki) {
                    return res.status(400).json({ success: false });
                }
                res.status(200).json({ success: true, data: flaggedWiki });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        case "PUT":
            try {
                const flaggedWiki = await FlaggedWikis.findByIdAndUpdate(
                    id,
                    req.body,
                    {
                        new: true,
                        runValidators: true,
                    }
                );
                if (!flaggedWiki) {
                    return res.status(400).json({ success: false });
                }
                res.status(200).json({ success: true, data: flaggedWiki });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        case "DELETE":
            try {
                const deletedWikidraft = await FlaggedWikis.deleteOne({
                    _id: id,
                });
                if (!deletedWikidraft) {
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
