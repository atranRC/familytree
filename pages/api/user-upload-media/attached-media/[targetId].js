import dbConnect from "../../../../lib/dbConnect";
import { ObjectId } from "mongodb";
import UserUploadMedia from "../../../../models/UserUploadMedia";

const MEDIA_PER_PAGE = 10;

export default async function handler(req, res) {
    const {
        query: { targetId, p, eventOrStory },
        method,
    } = req;

    const page = p || 1;
    const dbQuery = {
        eventOrStoryId: targetId,
        eventOrStory: eventOrStory,
    };

    await dbConnect();

    switch (method) {
        case "GET":
            try {
                const skip = (page - 1) * MEDIA_PER_PAGE;
                const countPromise =
                    //UserUploadMedia.estimatedDocumentCount(dbQuery);
                    UserUploadMedia.countDocuments(dbQuery);
                const mediaPromise = UserUploadMedia.find(dbQuery)
                    .limit(MEDIA_PER_PAGE)
                    .skip(skip)
                    .sort({ updatedAt: "descending" });
                const [count, media] = await Promise.all([
                    countPromise,
                    mediaPromise,
                ]);

                const pageCount = Math.floor(count / MEDIA_PER_PAGE) + 1;

                if (!count || !media) {
                    return res
                        .status(200)
                        .json({ success: false, result: "NO_DATA" });
                }
                res.status(200).json({
                    success: true,
                    data: { pagination: { count, pageCount }, media },
                });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        default:
            res.status(400).json({ success: false });
            break;
    }
}
