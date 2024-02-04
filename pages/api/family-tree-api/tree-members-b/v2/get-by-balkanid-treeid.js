import { unstable_getServerSession } from "next-auth";
import dbConnect from "../../../../../lib/dbConnect";
import TreeMembersB from "../../../../../models/TreeMembersB";
import { authOptions } from "../../../auth/[...nextauth]";

export default async function handler(req, res) {
    const {
        query: { treeId, balkanId },
        method,
    } = req;

    await dbConnect();

    const session = await unstable_getServerSession(req, res, authOptions);
    if (!session) {
        res.status(401).json({ message: "You must be logged in." });
        return;
    }

    switch (method) {
        case "GET":
            try {
                const treeMember = await TreeMembersB.findOne({
                    treeId: treeId,
                    id: balkanId,
                });
                res.status(200).json(treeMember);
            } catch (error) {
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
