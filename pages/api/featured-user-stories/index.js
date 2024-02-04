import dbConnect from "../../../lib/dbConnect";
import ArticleSharedWrittenStories from "../../../models/ArticleSharedWrittenStories";
import FeaturedUserStories from "../../../models/FeaturedUserStories";

export default async function handler(req, res) {
    let {
        query: {},
        method,
    } = req;

    await dbConnect();

    switch (method) {
        case "GET":
            try {
                /*await FeaturedUserStories.insertMany([
                    {
                        articleSharedStoryId: "656386f8c7431b2e94e34dc8",
                        featureDate: Date.now(),
                    },
                    {
                        articleSharedStoryId: "656386fec7431b2e94e34dcd",
                        featureDate: Date.now(),
                    },
                    {
                        articleSharedStoryId: "65638704c7431b2e94e34dd2",
                        featureDate: Date.now(),
                    },
                    {
                        articleSharedStoryId: "65638e08c7431b2e94e34f92",
                        featureDate: Date.now(),
                    },
                ]);*/
                const featuredStories = await FeaturedUserStories.find({
                    //ne null
                    deletedAt: {
                        $eq: null,
                    },
                })
                    .select("articleSharedStoryId")
                    .sort({
                        featureDate: "descending",
                    });

                //console.log(featuredStories);

                if (!featuredStories) {
                    res.status(200).json([]);
                    return;
                }

                const idArray = featuredStories.map(
                    (story) => story.articleSharedStoryId
                );

                const sharedStories = await ArticleSharedWrittenStories.find({
                    _id: {
                        $in: idArray.slice(0, 4),
                    },
                });

                if (!sharedStories) {
                    res.status(200).json([]);
                    return;
                }

                res.status(200).json(sharedStories);
            } catch (error) {
                console.log(error);
                res.status(400).json({ success: false });
            }
            break;
        /*case "POST":
            try {
                const story = await FeaturedTimelineArticles.create(
                    req.body
                ); 
                res.status(201).json({ success: true, data: story });
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
