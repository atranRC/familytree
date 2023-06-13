import dbConnect from "../../../lib/dbConnect";
import FlaggedWikis from "../../../models/FlaggedWikis";

export default async function handler(req, res) {
    const { method } = req;

    await dbConnect();

    switch (method) {
        case "GET":
            try {
                const flaggedWikis = await FlaggedWikis.find(
                    {}
                ); /* find all the data in our database */
                res.status(200).json({ success: true, data: flaggedWikis });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        case "POST":
            try {
                const flaggedWiki = await FlaggedWikis.create(
                    req.body
                ); /* create a new model in the database */
                res.status(201).json({ success: true, data: flaggedWiki });
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
