import dbConnect from "../../../../lib/dbConnect";
import Articles from "../../../../models/Articles";
import FeaturedTimelineArticles from "../../../../models/FeaturedTimelineArticles";
import moment from "moment";

export default async function handler(req, res) {
    let {
        query: { type },
        method,
    } = req;

    await dbConnect();

    switch (method) {
        case "GET":
            if (!type) {
                type = "gen";
            }
            try {
                const featuredArticles = await FeaturedTimelineArticles.find({
                    tag: type,
                    //ne null
                    deletedAt: {
                        $eq: null,
                    },
                })
                    .select("articleId")
                    .sort({
                        featureDate: "descending",
                    });

                //console.log(featuredArticles);

                if (!featuredArticles) {
                    res.status(200).json([]);
                    return;
                }

                const idArray = featuredArticles.map(
                    (article) => article.articleId
                );

                const articles = await Articles.find({
                    _id: {
                        $in: idArray.slice(0, 4),
                    },
                });

                if (!articles) {
                    res.status(200).json([]);
                    return;
                }

                res.status(200).json(articles);
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        /*case "POST":
            try {
                const article = await FeaturedTimelineArticles.create(
                    req.body
                ); 
                res.status(201).json({ success: true, data: article });
            } catch (error) {
                console.log(error);
                res.status(400).json({ success: false });
            }
            break;*/
        default:
            res.status(400).json({ success: false });
            break;
    }
}
