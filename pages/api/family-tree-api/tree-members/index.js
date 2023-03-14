import dbConnect from "../../../../lib/dbConnect";
import FamilyTrees from "../../../../models/FamilyTrees";
import TreeMembers from "../../../../models/TreeMembers";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
    const { method } = req;

    await dbConnect();

    switch (method) {
        case "GET":
            try {
                const treeMembers = await TreeMembers.find(
                    {}
                ); /* find all the data in our database */
                res.status(200).json({ success: true, data: treeMembers });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        case "POST":
            try {
                const treeMembers = await TreeMembers.create(
                    req.body
                ); /* create a new model in the database */
                res.status(201).json({ success: true, data: treeMembers });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        case "DELETE":
            try {
                console.log("hxxx", req.body);

                const oids = req.body.map((i) => {
                    return ObjectId(i);
                });
                const deletedMembers = await TreeMembers.deleteMany({
                    _id: { $in: oids },
                });
                if (!deletedMembers) {
                    return res.status(400).json({ success: false });
                }
                res.status(200).json({ success: true, data: {} });
            } catch (error) {
                console.log(error);
                res.status(400).json({ success: false });
            }
            break;
        default:
            res.status(400).json({ success: false });
            break;
    }
}
