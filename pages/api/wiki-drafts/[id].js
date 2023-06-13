import dbConnect from "../../../lib/dbConnect";
import { ObjectId } from "mongodb";
import Wikidrafts from "../../../models/Wikidrafts";

export default async function handler(req, res) {
    const {
        query: { id },
        method,
    } = req;

    await dbConnect();

    switch (method) {
        case "GET" /* Get a model by its ID */:
            try {
                const wikidraft = await Wikidrafts.findById(id);
                if (!wikidraft) {
                    return res.status(400).json({ success: false });
                }
                res.status(200).json({ success: true, data: wikidraft });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        case "PUT" /* Edit a model by its ID */:
            try {
                const wikidraft = await Wikidrafts.findByIdAndUpdate(
                    id,
                    req.body,
                    {
                        new: true,
                        runValidators: true,
                    }
                );
                if (!wikidraft) {
                    return res.status(400).json({ success: false });
                }
                res.status(200).json({ success: true, data: wikidraft });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        case "DELETE" /* Delete a model by its ID */:
            try {
                const deletedWikidraft = await Wikidrafts.deleteOne({
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
