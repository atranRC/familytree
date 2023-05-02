import dbConnect from "../../../../../lib/dbConnect";
import { ObjectId } from "mongodb";
import TreeMembersB from "../../../../../models/TreeMembersB";

export default async function handler(req, res) {
    const {
        query: { treeId, balkanId },
        method,
    } = req;

    await dbConnect();

    switch (method) {
        case "GET":
            console.log(treeId, balkanId);
            try {
                const treeMembers = await TreeMembersB.findOne({
                    treeId: treeId,
                    id: balkanId,
                });
                if (!treeMembers) {
                    return res.status(400).json({ success: false });
                }
                res.status(200).json({ success: true, data: treeMembers });
            } catch (error) {
                console.log(error);
                res.status(400).json({ success: false });
            }
            break;
        /*
        case "PUT":
            try {
                const tree = await TreeMembers.findByIdAndUpdate(id, req.body, {
                    new: true,
                    runValidators: true,
                });
                if (!tree) {
                    return res.status(400).json({ success: false });
                }
                res.status(200).json({ success: true, data: tree });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        case "DELETE" :
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
*/
        default:
            res.status(400).json({ success: false });
            break;
    }
}
