import dbConnect from "../../../lib/dbConnect";
import Wikis from "../../../models/Wikis";

export default async function handler(req, res) {
    const { method } = req;

    await dbConnect();

    switch (method) {
        case "GET":
            try {
                const wikis = await Wikis.find(
                    {}
                ); /* find all the data in our database */
                res.status(200).json({ success: true, data: wikis });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        case "POST":
            try {
                const wiki = await Wikis.create(
                    req.body
                ); /* create a new model in the database */
                res.status(201).json({ success: true, data: wiki });
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
