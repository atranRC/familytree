import dbConnect from "../../../lib/dbConnect";
import FlaggedArticles from "../../../models/FlaggedArticles";

export default async function handler(req, res) {
    const { method } = req;

    await dbConnect();

    switch (method) {
        case "GET":
            try {
                const flaggedArticles = await FlaggedArticles.find(
                    {}
                ); /* find all the data in our database */
                res.status(200).json({ success: true, data: flaggedArticles });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        case "POST":
            try {
                const flaggedArticle = await FlaggedArticles.create(
                    req.body
                ); /* create a new model in the database */
                res.status(201).json({ success: true, data: flaggedArticle });
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
