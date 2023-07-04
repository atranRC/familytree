import dbConnect from "../../../../lib/dbConnect";
import { ObjectId } from "mongodb";
import TreeMembersB from "../../../../models/TreeMembersB";

export default async function handler(req, res) {
    const {
        query: { id },
        method,
    } = req;

    await dbConnect();

    switch (method) {
        /*case "GET" :
            try {
                const collabs = await Collabs.find({ treeId: id });
                if (!collabs) {
                    return res.status(400).json({ success: false });
                }
                res.status(200).json({ success: true, data: collabs });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;*/

        /*case "PUT" :
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
            break;*/

        case "DELETE" /* Delete a model by its ID */:
            try {
                const removedAllowedTree = await TreeMembersB.findOneAndUpdate(
                    { _id: ObjectId(id) },
                    { canPost: false },
                    { new: true }
                );
                if (!removedAllowedTree) {
                    return res.status(400).json({ success: false });
                }
                res.status(200).json({
                    success: true,
                    data: removedAllowedTree,
                });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        default:
            res.status(400).json({ success: false });
            break;
    }
}
