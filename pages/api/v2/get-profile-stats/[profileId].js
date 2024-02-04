import { unstable_getServerSession } from "next-auth";
import dbConnect from "../../../../lib/dbConnect";
import WrittenStories from "../../../../models/WrittenStories";
import Events from "../../../../models/Events";
import AudioStories from "../../../../models/AudioStories";
import TreeMembersB from "../../../../models/TreeMembersB";
import { authOptions } from "../../auth/[...nextauth]";

export default async function handler(req, res) {
    const {
        query: { profileId },
        method,
    } = req;

    const session = await unstable_getServerSession(req, res, authOptions);
    if (!session) {
        res.status(401).json({ message: "You must be logged in." });
        return;
    }

    await dbConnect();

    switch (method) {
        case "GET":
            try {
                const eventsPromise = Events.countDocuments({
                    userId: profileId,
                });
                const writtenStoriesPromise = WrittenStories.countDocuments({
                    userId: profileId,
                });
                const audioStoriesPromise = AudioStories.countDocuments({
                    userId: profileId,
                });
                const treesPromise = TreeMembersB.countDocuments({
                    taggedUser: profileId,
                });

                const [
                    eventsCount,
                    writtenStoriesCount,
                    audioStoriesCount,
                    treesCount,
                ] = await Promise.all([
                    eventsPromise,
                    writtenStoriesPromise,
                    audioStoriesPromise,
                    treesPromise,
                ]);
                res.status(201).json({
                    eventsCount,
                    writtenStoriesCount,
                    audioStoriesCount,
                    treesCount,
                });
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
