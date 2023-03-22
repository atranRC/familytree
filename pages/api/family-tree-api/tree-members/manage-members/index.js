import dbConnect from "../../../../../lib/dbConnect";
import TreeMembers from "../../../../../models/TreeMembers";

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
                const treeMember = await TreeMembers.create(
                    req.body
                ); /* create a new model in the database */
                res.status(201).json({ success: true, data: treeMember });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        default:
            res.status(400).json({ success: false });
            break;
    }
}
