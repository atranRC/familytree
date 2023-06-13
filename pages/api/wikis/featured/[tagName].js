import dbConnect from "../../../../lib/dbConnect";
import FeaturedWikiPages from "../../../../models/FeaturedWikiPages";
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
                const wikis = await FeaturedWikiPages.find({
                    featureDate: {
                        $gte: moment().subtract(1, "w"),
                        $lte: moment().endOf("day"),
                    },
                    tag: tagName,
                }).sort({
                    featureDate: "descending",
                }); /* find all the data in our database */
                let resArray = wikis;
                if (wikis.length < 1) {
                    //set default wikis here
                    //hero/martyr/public_figure/artefact/history
                    if (tagName === "hero") {
                        resArray = [
                            {
                                //_id: "64770bf6b07298379f6b3ef2",
                                wikiId: "64678b5491119c1378ddff12",
                                featureDate: "2023-05-28T00:00:00.000+00:00",
                                tag: tagName,
                            },
                        ];
                    }

                    if (tagName === "martyr") {
                        resArray = [
                            {
                                //_id: "64770bf6b07298379f6b3ef2",
                                wikiId: "64772192cd174b0bab987602",
                                featureDate: "2023-05-28T00:00:00.000+00:00",
                                tag: tagName,
                            },
                        ];
                    }

                    if (tagName === "public_figure") {
                        resArray = [
                            {
                                //_id: "64770bf6b07298379f6b3ef2",
                                wikiId: "647721efcd174b0bab98761e",
                                featureDate: "2023-05-28T00:00:00.000+00:00",
                                tag: tagName,
                            },
                        ];
                    }

                    if (tagName === "artefact") {
                        resArray = [
                            {
                                //_id: "64770bf6b07298379f6b3ef2",
                                wikiId: "64772220cd174b0bab98762a",
                                featureDate: "2023-05-28T00:00:00.000+00:00",
                                tag: tagName,
                            },
                        ];
                    }

                    if (tagName === "heritage") {
                        resArray = [
                            {
                                //_id: "64770bf6b07298379f6b3ef2",
                                wikiId: "6477223dcd174b0bab987636",
                                featureDate: "2023-05-28T00:00:00.000+00:00",
                                tag: tagName,
                            },
                        ];
                    }
                }
                res.status(200).json({ success: true, data: resArray });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        /*case "POST":
            try {
                const wiki = await FeaturedWikiPages.create(
                    req.body
                ); 
                res.status(201).json({ success: true, data: wiki });
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
