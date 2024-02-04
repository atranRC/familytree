import { ObjectId } from "mongodb";
import dbConnect from "../../../../../lib/dbConnect";
import Events from "../../../../../models/Events";
import WrittenStories from "../../../../../models/WrittenStories";
import AudioStories from "../../../../../models/AudioStories";

export default async function handler(req, res) {
    const {
        query: { type, profileId },
        method,
    } = req;

    await dbConnect();

    switch (method) {
        case "GET":
            try {
                if (type === "events") {
                    const events = await Events.find(
                        { userId: ObjectId(profileId) },
                        "_id description location"
                    );
                    res.status(200).json(events);
                    return;
                }

                if (type === "writtenStories") {
                    const stories = await WrittenStories.find(
                        { userId: ObjectId(profileId) },
                        "_id content location"
                    );
                    res.status(200).json(stories);
                    return;
                }

                if (type === "audioStories") {
                    const stories = await AudioStories.find(
                        { userId: ObjectId(profileId) },
                        "_id description location"
                    );
                    res.status(200).json(stories);
                    return;
                }

                res.status(400).json({ success: false });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        /*case "POST":
            try {
                const event = await Events.create(
                    req.body
                ); 
                res.status(201).json({ success: true, data: event });
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
