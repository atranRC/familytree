import dbConnect from "../../../lib/dbConnect";
import Articles from "../../../models/Articles";

export default async function handler(req, res) {
    const { method } = req;

    await dbConnect();

    switch (method) {
        case "GET":
            try {
                const articles = await Articles.find(
                    {}
                ); /* find all the data in our database */
                res.status(200).json({ success: true, data: articles });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        case "POST":
            try {
                const article = await Articles.create(
                    req.body
                ); /* create a new model in the database */
                res.status(201).json({ success: true, data: article });
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
