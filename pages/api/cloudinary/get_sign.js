import { v2 as cloudinary } from "cloudinary";
//signature reference
//https://stackoverflow.com/a/73078498
//signed upload api reference
//https://github.com/LearnWebCode/cloudinary-finished-reference/blob/main/public/client-side.js

export default async function handler(req, res) {
    try {
        const timestamp = Math.round(new Date().getTime() / 1000);
        const signature = cloudinary.utils.api_sign_request(
            {
                timestamp: timestamp,
                upload_preset: req.query.preset,
            },
            process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET
        );
        res.status(200).json({ timestamp, signature });
    } catch (error) {
        res.status(500).json({
            error: e.message,
        });
    }
}
