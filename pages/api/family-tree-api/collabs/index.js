import dbConnect from "../../../../lib/dbConnect";
import FamilyTrees from "../../../../models/FamilyTrees";
import Collabs from "../../../../models/Collabs";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
    const { method } = req;

    await dbConnect();

    switch (method) {
        case "GET":
            try {
                const collabs = await Collabs.find(
                    {}
                ); /* find all the data in our database */
                res.status(200).json({ success: true, data: collabs });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        case "POST":
            try {
                const collabs = await Collabs.create(
                    req.body
                ); /* create a new model in the database */
                res.status(201).json({ success: true, data: collabs });
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
                const deletedCollabs = await Collabs.deleteMany({
                    _id: { $in: oids },
                });
                if (!deletedCollabs) {
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
