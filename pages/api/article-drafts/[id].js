import dbConnect from "../../../lib/dbConnect";
import { ObjectId } from "mongodb";
import Articledrafts from "../../../models/Articledrafts";

export default async function handler(req, res) {
    const {
        query: { id },
        method,
    } = req;

    await dbConnect();

    switch (method) {
        case "GET" /* Get a model by its ID */:
            try {
                const articledraft = await Articledrafts.findById(id);
                if (!articledraft) {
                    return res.status(400).json({ success: false });
                }
                res.status(200).json({ success: true, data: articledraft });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        case "PUT" /* Edit a model by its ID */:
            try {
                const articledraft = await Articledrafts.findByIdAndUpdate(
                    id,
                    req.body,
                    {
                        new: true,
                        runValidators: true,
                    }
                );
                if (!articledraft) {
                    return res.status(400).json({ success: false });
                }
                res.status(200).json({ success: true, data: articledraft });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        case "DELETE" /* Delete a model by its ID */:
            try {
                const deletedArticledraft = await Articledrafts.deleteOne({
                    _id: id,
                });
                if (!deletedArticledraft) {
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
