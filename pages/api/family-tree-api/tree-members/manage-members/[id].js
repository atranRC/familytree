import dbConnect from "../../../../../lib/dbConnect";
import FamilyTrees from "../../../../../models/FamilyTrees";
import { ObjectId } from "mongodb";
import TreeMembers from "../../../../../models/TreeMembers";
export default async function handler(req, res) {
    const {
        query: { id },
        method,
    } = req;

    await dbConnect();

    switch (method) {
        case "GET" /* get all users that are collaborators*/:
            try {
                const treeMember = await TreeMembers.findById(id);
                if (!treeMember) {
                    return res.status(400).json({ success: false });
                }
                res.status(200).json({ success: true, data: treeMember });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        case "PUT" /* Edit a model by its ID */:
            try {
                const treeMember = await TreeMembers.findByIdAndUpdate(
                    id,
                    req.body,
                    {
                        new: true,
                        runValidators: true,
                    }
                );
                if (!treeMember) {
                    return res.status(400).json({ success: false });
                }
                res.status(200).json({ success: true, data: treeMember });
            } catch (error) {
                console.log(error);
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
