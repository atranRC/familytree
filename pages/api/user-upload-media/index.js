import dbConnect from "../../../lib/dbConnect";
import UserUploadMedia from "../../../models/UserUploadMedia";
import { v2 as cloudinary } from "cloudinary";
export default async function handler(req, res) {
    const { method } = req;

    await dbConnect();

    cloudinary.config({
        cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
        api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
    });

    switch (method) {
        case "POST":
            try {
                //get expected sign
                const expectedSignature = cloudinary.utils.api_sign_request(
                    {
                        public_id:
                            req.body.documentData.cloudinaryParams.public_id,
                        version: req.body.documentData.cloudinaryParams.version,
                    },
                    process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET
                );
                if (expectedSignature === req.body.signature) {
                    const media = await UserUploadMedia.create(
                        req.body.documentData
                    );
                    res.status(201).json({ success: true, data: media });
                } else {
                    res.status(400).json({ success: false });
                }
            } catch (error) {
                //console.log(error);
                res.status(400).json({ success: false });
            }
            break;
        case "DELETE":
            try {
                await UserUploadMedia.deleteMany({
                    eventOrStory: req.body.eventOrStory,
                    _id: { $in: req.body.dbIds },
                });

                await cloudinary.api.delete_resources(req.body.cloudinaryIds);

                res.status(201).json({ success: true });
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
