import dbConnect from "../../../../lib/dbConnect";
import { ObjectId } from "mongodb";
import TreeMembersB from "../../../../models/TreeMembersB";
import { getSession } from "next-auth/react";
//import Users from "../../../../models/Users";
//import TreeMembers from "../../../../models/TreeMembers";

export default async function handler(req, res) {
    const { method } = req;

    await dbConnect();
    const session = await getSession({ req });

    switch (method) {
        case "POST" /* Get a model by its ID */:
            try {
                //console.log("bodss", req.body);
                const oidArray = req.body.map((id) => {
                    return ObjectId(id);
                });
                const familyTrees = await TreeMembersB.updateMany(
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
