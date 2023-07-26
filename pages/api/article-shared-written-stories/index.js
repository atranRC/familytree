import dbConnect from "../../../lib/dbConnect";
import ArticleSharedWrittenStories from "../../../models/ArticleSharedWrittenStories";

export default async function handler(req, res) {
    const { method } = req;

    await dbConnect();

    switch (method) {
        case "POST":
            try {
                const story = await ArticleSharedWrittenStories.create(
                    req.body
                ); /* create a new model in the database */
                res.status(201).json({ success: true, data: story });
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
