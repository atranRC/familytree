import moment from "moment";
import dbConnect from "../../../lib/dbConnect";
import Articles from "../../../models/Articles";

export default async function handler(req, res) {
    const { method } = req;

    await dbConnect();

    let eventTag = "gen";
    if (req.query.tag && req.query.tag === "his") {
        eventTag = "his";
    }

    switch (method) {
        case "GET":
            //console.log(req.query.gt, req.query.lt, req.query.tag);
            try {
                /*const articles = await Articles.find(
                    {
                        date: { $gte: req.query.gt, $lte: req.query.lt },
                        tag: eventTag,
                        isPublished: true,
                    },
                    "title date"
                ); 
                res.status(200).json({ success: true, data: articles });*/
                const articles = await Articles.find(
                    {
                        date: { $gte: req.query.gt, $lte: req.query.lt },
                        tag: eventTag,
                        isPublished: true,
                    },
                    "title date"
                );
                const timelineItems = articles.map((article) => {
                    return {
                        id: article._id.toString(),
                        content: article.title,
                        //start: article.date.toString().split("T")[0],
                        start: moment(article.date).format("YYYY-MM-DD"),
                    };
                });
                //console.log(timelineItems);
                res.status(200).json(timelineItems);
            } catch (error) {
                //console.log(error);
                res.status(400).json({ success: false });
            }
            break;

        default:
            res.status(400).json({ success: false });
            break;
    }
}
