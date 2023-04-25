import dbConnect from "../../../../../lib/dbConnect";
import { ObjectId } from "mongodb";
import TreeMembersB from "../../../../../models/TreeMembersB";

export default async function handler(req, res) {
    const {
        query: { id },
        method,
    } = req;

    await dbConnect();

    switch (method) {
        case "GET":
            try {
                const treeMembers = await TreeMembersB.find({ treeId: id });
                if (!treeMembers) {
                    return res.status(400).json({ success: false });
                }
                res.status(200).json({ success: true, data: treeMembers });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        /* case "PUT" :
            try {
                const writtenStory = await WrittenStories.findByIdAndUpdate(
                    id,
                    req.body,
                    {
                        new: true,
                        runValidators: true,
                    }
                );
                if (!writtenStory) {
                    return res.status(400).json({ success: false });
                }
                res.status(200).json({ success: true, data: writtenStory });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        case "DELETE" :
            try {
                const deletedWrittenStory = await WrittenStories.deleteOne({
                    _id: id,
                });
                if (!deletedWrittenStory) {
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
