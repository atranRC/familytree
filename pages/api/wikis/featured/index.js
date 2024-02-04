import dbConnect from "../../../../lib/dbConnect";
import Wikis from "../../../../models/Wikis";
import FeaturedWikiPages from "../../../../models/FeaturedWikiPages";

export default async function handler(req, res) {
    let {
        query: { tag },
        method,
    } = req;

    await dbConnect();

    switch (method) {
        case "GET":
            //tag: hero, martyr, public_figure, artefact, heritage
            if (!tag) {
                tag = "hero";
            }
            //console.log(tag);
            try {
                const featuredWikis = await FeaturedWikiPages.find({
                    tag: tag,
                    //ne null
                    deletedAt: {
                        $eq: null,
                    },
                })
                    .select("wikiId")
                    .sort({
                        featureDate: "descending",
                    })
                    .limit(4);

                //console.log(featuredWikis);

                if (!featuredWikis) {
                    res.status(200).json([]);
                    return;
                }

                const idArray = featuredWikis.map((wiki) => wiki.wikiId);

                const wikis = await Wikis.find({
                    _id: {
                        $in: idArray,
                    },
                });

                if (!wikis) {
                    res.status(200).json([]);
                    return;
                }

                res.status(200).json(wikis);
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        /*case "POST":
            try {
                const article = await FeaturedWikiPages.create(
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
