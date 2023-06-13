import dbConnect from "../../../../lib/dbConnect";
import { ObjectId } from "mongodb";
import FlaggedWikis from "../../../../models/FlaggedWikis";

export default async function handler(req, res) {
    const {
        query: { wikiId, email },
        method,
    } = req;

    await dbConnect();

    switch (method) {
        case "GET":
            try {
                const flaggedWiki = await FlaggedWikis.findOne({
                    wikiId: ObjectId(wikiId),
                    flaggedBy: email,
                });
                if (!flaggedWiki) {
                    return res.status(200).json({ isFlaggedByUser: false });
                }
                res.status(200).json({
                    isFlaggedByUser: true,
                    data: flaggedWiki,
                });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        /*
        case "PUT":
            try {
                const flaggedWiki = await FlaggedWikis.findByIdAndUpdate(
                    id,
                    req.body,
                    {
                        new: true,
                        runValidators: true,
                    }
                );
                if (!flaggedWiki) {
                    return res.status(400).json({ success: false });
                }
                res.status(200).json({ success: true, data: flaggedWiki });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;*/

        case "DELETE":
            try {
                console.log("deleting: ", wikiId, email);
                const deletedWikiFlag = await FlaggedWikis.deleteMany({
                    wikiId: ObjectId(wikiId),
                    flaggedBy: email,
                });
                if (!deletedWikiFlag) {
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
