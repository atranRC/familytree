import { ObjectId } from "mongodb";
import dbConnect from "../../../../../lib/dbConnect";
import Collabs from "../../../../../models/Collabs";

export default async function handler(req, res) {
    const {
        query: { treeId },
        method,
    } = req;

    await dbConnect();

    switch (method) {
        case "GET":
            try {
                const collabs = await Collabs.find({ treeId: treeId });
                if (!collabs) {
                    return res.status(400).json({ success: false });
                }
                res.status(200).json({ success: true, data: collabs });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        /* case "PUT" :
            try {
                const tree = await FamilyTrees.findOneAndUpdate(
                    { _id: ObjectId(id) },
                    {
                        $push: {
                            collaborators: { $each: req.body.new_collabs },
                        },
                    },
                    {
                        new: true,
                        runValidators: true,
                    }
                );
                if (!tree) {
                    return res.status(400).json({ success: false });
                }
                res.status(200).json({ success: true, data: tree });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        case "DELETE":
            try {
                const deletedPet = await Pet.deleteOne({ _id: id });
                if (!deletedPet) {
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
