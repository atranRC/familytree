import { ObjectId } from "mongodb";
import dbConnect from "../../../../../lib/dbConnect";
import Collabs from "../../../../../models/Collabs";

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
                const collabsObjectId = req.body.collabsToDelete.map((c) => {
                    return ObjectId(c);
                });
                const deletedCollabs = await Collabs.deleteMany({
                    _id: { $in: collabsObjectId },
                });

                if (!deletedCollabs.acknowledged) {
                    return res.status(400).json({ success: false });
                }
                res.status(200).json({ success: true, data: deletedCollabs });
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
