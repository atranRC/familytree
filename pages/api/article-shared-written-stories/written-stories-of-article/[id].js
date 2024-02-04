import dbConnect from "../../../../lib/dbConnect";
import { ObjectId } from "mongodb";
import ArticleSharedWrittenStories from "../../../../models/ArticleSharedWrittenStories";

const STORIES_PER_PAGE = 10;

export default async function handler(req, res) {
    const {
        query: { id, p },
        method,
    } = req;

    const page = p || 1;
    const dbQuery = { articleId: id };

    await dbConnect();

    //console.log(id);
    switch (method) {
        case "GET":
            try {
                const skip = (page - 1) * STORIES_PER_PAGE;
                const countPromise =
                    ArticleSharedWrittenStories.countDocuments(dbQuery);
                const storiesPromise = ArticleSharedWrittenStories.find(dbQuery)
                    .limit(STORIES_PER_PAGE)
                    .skip(skip)
                    .sort({ createdAt: "descending" });
                const [count, stories] = await Promise.all([
                    countPromise,
                    storiesPromise,
                ]);

                const pageCount = Math.floor(count / STORIES_PER_PAGE) + 1;

                /*if (!count || !stories) {
                    return res.status(200).json({ success: false });
                }*/
                let storiesDocs = [];
                if (count > 0) {
                    stories.map((s) => {
                        let uName = s.userName;
                        if (s.isAnnon) {
                            uName = "Annonymous";
                        }
                        storiesDocs.push({
                            _id: s._id,
                            articleId: s.articleId,
                            profileId: s.profileId,
                            writtenStoryId: s.writtenStoryId,
                            userName: uName,
                            title: s.title,
                            content: s.content,
                            isAnnon: s.isAnnon,
                        });
                    });
                }
                res.status(200).json({
                    data: { pagination: { count, pageCount }, storiesDocs },
                });
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
