import dbConnect from "../../../lib/dbConnect";
import { ObjectId } from "mongodb";
import Wikis from "../../../models/Wikis";

export default async function handler(req, res) {
    const {
        query: { id },
        method,
    } = req;

    await dbConnect();

    switch (method) {
        case "GET" /* Get a model by its ID */:
            try {
                const wiki = await Wikis.findById(id);
                if (!wiki) {
                    return res.status(400).json({ success: false });
                }
                res.status(200).json({ success: true, data: wiki });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        case "PUT" /* Edit a model by its ID */:
            try {
                const wiki = await Wikis.findByIdAndUpdate(id, req.body, {
                    new: true,
                    runValidators: true,
                });
                if (!wiki) {
                    return res.status(400).json({ success: false });
                }
                res.status(200).json({ success: true, data: wiki });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        case "DELETE" /* Delete a model by its ID */:
            try {
                const deletedWiki = await Wikis.deleteOne({
                    _id: id,
                });
                if (!deletedWiki) {
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
