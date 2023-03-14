import dbConnect from "../../../lib/dbConnect";
import Articledrafts from "../../../models/Articledrafts";

export default async function handler(req, res) {
    const { method } = req;

    await dbConnect();

    switch (method) {
        case "GET":
            try {
                const articledrafts = await Articledrafts.find(
                    {}
                ); /* find all the data in our database */
                res.status(200).json({ success: true, data: articledrafts });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        case "POST":
            try {
                const articledraft = await Articledrafts.create(
                    req.body
                ); /* create a new model in the database */
                res.status(201).json({ success: true, data: articledraft });
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
