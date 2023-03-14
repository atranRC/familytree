import dbConnect from "../../../../lib/dbConnect";
import FamilyTrees from "../../../../models/FamilyTrees";
import { ObjectId } from "mongodb";
import Users from "../../../../models/Users";
import Collabs from "../../../../models/Collabs";

export default async function handler(req, res) {
    const {
        query: { id },
        method,
    } = req;

    await dbConnect();

    switch (method) {
        case "GET" /* get all users that are collaborators*/:
            try {
                const collabs = await Collabs.find({ treeId: id });
                if (!collabs) {
                    return res.status(400).json({ success: false });
                }
                res.status(200).json({ success: true, data: collabs });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        case "PUT" /* Edit a model by its ID */:
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

        case "DELETE" /* Delete a model by its ID */:
            try {
                const deletedPet = await Pet.deleteOne({ _id: id });
                if (!deletedPet) {
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
