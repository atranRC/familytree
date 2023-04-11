import dbConnect from "../../../lib/dbConnect";
import { ObjectId } from "mongodb";
import AudioStories from "../../../models/AudioStories";

const ITEMS_PER_PAGE = 10;

export default async function handler(req, res) {
    const {
        query: { id },
        method,
    } = req;

    await dbConnect();

    switch (method) {
        case "GET" /* Get a model by its ID */:
            try {
                const audioStory = await AudioStories.findById(id);
                if (!audioStory) {
                    return res.status(400).json({ success: false });
                }
                res.status(200).json({ success: true, data: audioStory });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        case "PUT" /* Edit a model by its ID */:
            try {
                const audioStory = await AudioStories.findByIdAndUpdate(
                    id,
                    req.body,
                    {
                        new: true,
                        runValidators: true,
                    }
                );
                if (!audioStory) {
                    return res.status(400).json({ success: false });
                }
                res.status(200).json({ success: true, data: audioStory });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        case "DELETE" /* Delete a model by its ID */:
            try {
                const deletedAudioStory = await AudioStories.deleteOne({
                    _id: id,
                });
                if (!deletedAudioStory) {
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
