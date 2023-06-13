import dbConnect from "../../../lib/dbConnect";
import Wikidrafts from "../../../models/Wikidrafts";

export default async function handler(req, res) {
    const { method } = req;

    await dbConnect();

    switch (method) {
        case "GET":
            try {
                const wikidrafts = await Wikidrafts.find(
                    {}
                ); /* find all the data in our database */
                res.status(200).json({ success: true, data: wikidrafts });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        case "POST":
            try {
                const wikidraft = await Wikidrafts.create(
                    req.body
                ); /* create a new model in the database */
                res.status(201).json({ success: true, data: wikidraft });
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
