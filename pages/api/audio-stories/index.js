import dbConnect from "../../../lib/dbConnect";
import AudioStories from "../../../models/AudioStories";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req, res) {
    const { method } = req;

    await dbConnect();
    //https://dev.to/jamesqquick/cloudinary-image-upload-with-nodejs-4mad
    switch (method) {
        /*case "GET":
            try {
                const AudioStories = await AudioStories.find(
                    {}
                );
                res.status(200).json({ success: true, data: AudioStories });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;*/
        case "POST":
            try {
                const uploadResponse = await cloudinary.uploader.upload(
                    "data:audio/ogg;base64," + req.body.data.split(",").at(-1),
                    { resource_type: "auto", folder: "/audio_stories" }
                );
                console.log(uploadResponse);

                if (!uploadResponse) {
                    res.status(400).json({ success: false });
                }
                /* create a new model in the database */
                //console.log(req.body);
                //console.log(req.body.data);
                //const fileStr = req.body.data;
                //const f = Base64.encode(JSON.stringify(req.body.data));
                /*const encoded = btoa(
                    JSON.stringify(req.body.data.replace(/(\r\n|\n|\r)/gm, ""))
                );*/
                const audioStory = await AudioStories.create({
                    userId: req.body.userId,
                    userName: req.body.userName,
                    authorId: req.body.authorId,
                    authorName: req.body.authorName,
                    title: req.body.title,
                    description: req.body.description,
                    audioUrl: uploadResponse.secure_url,
                    location: {
                        value: req.body.location.value,
                        lon: req.body.location.lon,
                        lat: req.body.location.lat,
                    },
                });
                res.status(201).json({ success: true, data: audioStory });
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
