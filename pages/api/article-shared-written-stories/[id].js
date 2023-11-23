import dbConnect from "../../../lib/dbConnect";
import { ObjectId } from "mongodb";
import ArticleSharedWrittenStories from "../../../models/ArticleSharedWrittenStories";

export default async function handler(req, res) {
    const {
        query: { id },
        method,
    } = req;

    await dbConnect();

    switch (method) {
        case "GET" /* Get a model by its ID */:
            try {
                const story = await ArticleSharedWrittenStories.findById(id);
                if (!story) {
                    return res.status(400).json({ success: false });
                }
                let storyDoc = story;
                if (story.isAnnon) {
                    storyDoc = {
                        articleId: story.articleId,
                        profileId: story.profileId,
                        writtenStoryId: story.writtenStoryId,
                        userName: "Annonymous",
                        title: story.title,
                        content: story.content,
                        isAnnon: story.isAnnon,
                    };
                }
                res.status(200).json({ success: true, data: storyDoc });
            } catch (error) {
                //console.log(error);
                res.status(400).json({ success: false });
            }
            break;

        case "PUT" /* Edit a model by its ID */:
            try {
                const story =
                    await ArticleSharedWrittenStories.findByIdAndUpdate(
                        id,
                        req.body,
                        {
                            new: true,
                            runValidators: true,
                        }
                    );
                if (!story) {
                    return res.status(400).json({ success: false });
                }
                res.status(200).json({ success: true, data: story });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        case "DELETE" /* Delete a model by its ID */:
            try {
                const deletedStoryArticle =
                    await ArticleSharedWrittenStories.findByIdAndDelete(id);
                if (!deletedStoryArticle) {
                    return res.status(400).json({ success: false });
                }
                res.status(200).json({ success: true, data: {} });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        default:
            res.status(400).json({ success: false });
            break;
    }
}
