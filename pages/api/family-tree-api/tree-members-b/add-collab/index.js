import dbConnect from "../../../../../lib/dbConnect";
import Collabs from "../../../../../models/Collabs";
import Users from "../../../../../models/Users";

export default async function handler(req, res) {
    const { method } = req;

    await dbConnect();

    switch (method) {
        /*case "GET":
            try {
                const familyTrees = await FamilyTrees.find(
                    {}
                ); 
                res.status(200).json({ success: true, data: familyTrees });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;*/
        case "POST":
            try {
                //
                const user = await Users.findOne({ email: req.body.email });

                if (!user) {
                    return res.status(400).json({ success: false });
                }

                const collab = await Collabs.create({
                    userId: user._id.toString(),
                    treeId: req.body.treeId,
                    name: user.name,
                    role: "editor",
                });

                if (!collab) {
                    return res.status(400).json({ success: false });
                }
                res.status(200).json({ success: true, data: collab });
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
