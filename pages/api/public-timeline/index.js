import dbConnect from "../../../lib/dbConnect";
import Articles from "../../../models/Articles";

export default async function handler(req, res) {
    const { method } = req;

    await dbConnect();

    switch (method) {
        case "GET":
            console.log(req.query.gt, req.query.lt);
            try {
                const articles = await Articles.find(
                    { date: { $gte: req.query.gt, $lte: req.query.lt } },
                    "title date"
                ); /* find all the data in our database */
                res.status(200).json({ success: true, data: articles });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        default:
            res.status(400).json({ success: false });
            break;
    }
}
