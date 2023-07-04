import dbConnect from "../../../../lib/dbConnect";
import FamilyTrees from "../../../../models/FamilyTrees";
import { ObjectId } from "mongodb";
//import Users from "../../../../models/Users";
//import TreeMembers from "../../../../models/TreeMembers";

export default async function handler(req, res) {
    const { method } = req;

    await dbConnect();

    switch (method) {
        case "POST" /* Get a model by its ID */:
            try {
                const oidArray = req.body.map((id) => {
                    return ObjectId(id);
                });
                const familyTrees = await FamilyTrees.find({
                    _id: { $in: oidArray },
                });
                if (!familyTrees) {
                    return res.status(400).json({ success: false });
                }
                res.status(200).json({ success: true, data: familyTrees });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        default:
            res.status(400).json({ success: false });
            break;
    }
}
