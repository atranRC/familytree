import dbConnect from "../../../lib/dbConnect";
import { ObjectId } from "mongodb";
import AudioStories from "../../../models/AudioStories";
import { unstable_getServerSession } from "next-auth";
import {
    getSessionEventOrStoryRelation,
    getSessionProfileRelationUtil,
} from "../../../utils/dbUtils";
import { authOptions } from "../auth/[...nextauth]";
import { v2 as cloudinary } from "cloudinary";

const ITEMS_PER_PAGE = 10;

export default async function handler(req, res) {
    const {
        query: { id },
        method,
    } = req;
    const session = await unstable_getServerSession(req, res, authOptions);
    if (!session) {
        res.status(401).json({ message: "You must be logged in." });
        return;
    }
    await dbConnect();

    cloudinary.config({
        cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
        api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
    });

    switch (method) {
        case "GET":
            try {
                const story = await AudioStories.findById(id);
                res.status(200).json(story);
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        case "PUT":
            try {
                //allow edit for author or subject only
                const sessionStoryRelation =
                    await getSessionEventOrStoryRelation(
                        session,
                        id,
                        "audio_story"
                    );

                if (
                    sessionStoryRelation.isSubject === false &&
                    sessionStoryRelation.isAuthor === false
                ) {
                    res.status(400).json({ message: "UNAUTHORIZED" });
                    return;
                }
                const story = await AudioStories.findByIdAndUpdate(
                    id,
                    req.body,
                    {
                        new: true,
                        runValidators: true,
                    }
                );
                res.status(200).json(story);
            } catch (error) {
                console.log(error);
                res.status(400).json({ success: false });
            }
            break;

        case "DELETE":
            try {
                const sessionStoryRelation =
                    await getSessionEventOrStoryRelation(
                        session,
                        id,
                        "audio_story"
                    );

                if (
                    sessionStoryRelation.isSubject === false &&
                    sessionStoryRelation.isAuthor === false
                ) {
                    res.status(400).json({ message: "UNAUTHORIZED" });
                    return;
                }

                const story = await AudioStories.findByIdAndDelete(id);
                const del = await cloudinary.uploader.destroy(
                    req.body.assetPublicId,
                    { resource_type: "video" }
                );
                console.log("asset", req.body.assetPublicId);
                console.log(del);
                res.status(200).json(story);
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
