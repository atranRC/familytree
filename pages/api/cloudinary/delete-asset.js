import { v2 as cloudinary } from "cloudinary";
//signature reference
//https://stackoverflow.com/a/73078498
//signed upload api reference
//https://github.com/LearnWebCode/cloudinary-finished-reference/blob/main/public/client-side.js

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

export default async function handler(req, res) {
    try {
        const expectedSignature = cloudinary.utils.api_sign_request(
            {
                public_id: req.body.cloudinaryParams.public_id,
                version: req.body.cloudinaryParams.version,
            },
            process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET
        );

        if (expectedSignature === req.body.cloudinaryParams.signature) {
            await cloudinary.uploader.destroy(
                req.body.cloudinaryParams.public_id
            );
            res.status(201).json({ success: true });
        } else {
            res.status(400).json({ success: false });
        }
    } catch (error) {
        res.status(500).json({
            error: e.message,
        });
    }
}
