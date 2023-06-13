import dbConnect from "../../../../lib/dbConnect";
import FeaturedTimelineArticles from "../../../../models/FeaturedTimelineArticles";
import moment from "moment";

export default async function handler(req, res) {
    const {
        query: { tagName },
        method,
    } = req;

    await dbConnect();

    switch (method) {
        case "GET":
            try {
                const articles = await FeaturedTimelineArticles.find({
                    featureDate: {
                        $gte: moment().subtract(1, "w"),
                        $lte: moment().endOf("day"),
                    },
                    tag: tagName,
                }).sort({
                    featureDate: "descending",
                }); /* find all the data in our database */
                let resArray = articles;
                /*if (articles.length < 1) {
                    //set default articles here
                    if (tagName === "his") {
                        resArray = [
                            {
                                //_id: "64770bf6b07298379f6b3ef2",
                                articleId: "6487773dc9005f7b93bef988",
                                featureDate: "2023-05-28T00:00:00.000+00:00",
                                tag: "his",
                            },
                            {
                                //_id: "64770bf6b07298379f6b3ef2",
                                articleId: "648778eec9005f7b93bef997",
                                featureDate: "2023-05-28T00:00:00.000+00:00",
                                tag: "his",
                            },
                            {
                                //_id: "64770bf6b07298379f6b3ef2",
                                articleId: "64877b82c9005f7b93bef9a6",
                                featureDate: "2023-05-28T00:00:00.000+00:00",
                                tag: "his",
                            },
                            {
                                //_id: "64770bf6b07298379f6b3ef2",
                                articleId: "64877ce4c9005f7b93bef9b2",
                                featureDate: "2023-05-28T00:00:00.000+00:00",
                                tag: "his",
                            },
                        ];
                    } else {
                        resArray = [
                            {
                                //_id: "64770bf6b07298379f6b3ef2",
                                articleId: "6487773dc9005f7b93bef988",
                                featureDate: "2023-05-28T00:00:00.000+00:00",
                                tag: "his",
                            },
                            {
                                //_id: "64770bf6b07298379f6b3ef2",
                                articleId: "648778eec9005f7b93bef997",
                                featureDate: "2023-05-28T00:00:00.000+00:00",
                                tag: "his",
                            },
                            {
                                //_id: "64770bf6b07298379f6b3ef2",
                                articleId: "64877b82c9005f7b93bef9a6",
                                featureDate: "2023-05-28T00:00:00.000+00:00",
                                tag: "his",
                            },
                            {
                                //_id: "64770bf6b07298379f6b3ef2",
                                articleId: "64877ce4c9005f7b93bef9b2",
                                featureDate: "2023-05-28T00:00:00.000+00:00",
                                tag: "his",
                            },
                        ];
                    }
                }*/

                if (articles.length < 4) {
                    const additionalEvents = [
                        {
                            //_id: "64770bf6b07298379f6b3ef2",
                            articleId: "6487773dc9005f7b93bef988",
                            featureDate: "2023-05-28T00:00:00.000+00:00",
                            tag: "his",
                        },
                        {
                            //_id: "64770bf6b07298379f6b3ef2",
                            articleId: "648778eec9005f7b93bef997",
                            featureDate: "2023-05-28T00:00:00.000+00:00",
                            tag: "his",
                        },
                        {
                            //_id: "64770bf6b07298379f6b3ef2",
                            articleId: "64877b82c9005f7b93bef9a6",
                            featureDate: "2023-05-28T00:00:00.000+00:00",
                            tag: "his",
                        },
                        {
                            //_id: "64770bf6b07298379f6b3ef2",
                            articleId: "64877ce4c9005f7b93bef9b2",
                            featureDate: "2023-05-28T00:00:00.000+00:00",
                            tag: "his",
                        },
                    ];

                    resArray = resArray.concat(additionalEvents);
                }

                res.status(200).json({ success: true, data: resArray });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        case "POST":
            try {
                const article = await FeaturedTimelineArticles.create(
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
