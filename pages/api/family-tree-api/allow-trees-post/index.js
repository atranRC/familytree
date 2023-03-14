import dbConnect from "../../../../lib/dbConnect";
import { ObjectId } from "mongodb";
import TreeMembers from "../../../../models/TreeMembers";
//import Users from "../../../../models/Users";
//import TreeMembers from "../../../../models/TreeMembers";

export default async function handler(req, res) {
    const { method } = req;

    await dbConnect();

    switch (method) {
        case "POST" /* Get a model by its ID */:
            try {
                console.log("bodss", req.body);
                const oidArray = req.body.map((id) => {
                    return ObjectId(id);
                });
                const familyTrees = await TreeMembers.updateMany(
                    {
                        _id: { $in: oidArray },
                    },
                    { $set: { canPost: true } }
                );
                console.log("famtrrr", familyTrees);
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
