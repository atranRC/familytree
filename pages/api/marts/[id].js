import dbConnect from "../../../lib/dbConnect";
import { ObjectId } from "mongodb";
import { v2 as cloudinary } from "cloudinary";
import Marts from "../../../models/Marts";

export default async function handler(req, res) {
    const {
        query: { id },
        method,
    } = req;

    await dbConnect();

    cloudinary.config({
        cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
        api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
    });

    switch (method) {
        case "GET":
            try {
                const doc = await Marts.findById(id);
                /*if (!doc) {
                    return res.status(400).json({ success: false });
                }*/
                res.status(200).json({ success: true, data: doc });
            } catch (error) {
                //console.log(error);
                res.status(400).json({ success: false });
            }
            break;

        case "PUT" /* Edit a model by its ID */:
            try {
                if (req.body.documentData.cloudinaryParams) {
                    const expectedSignature = cloudinary.utils.api_sign_request(
                        {
                            public_id:
                                req.body.documentData.cloudinaryParams
                                    .public_id,
                            version:
                                req.body.documentData.cloudinaryParams.version,
                        },
                        process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET
                    );
                    if (expectedSignature === req.body.signature) {
                        const doc = await Marts.findByIdAndUpdate(
                            id,
                            req.body.documentData,
                            {
                                new: true,
                                runValidators: true,
                            }
                        );
                        res.status(201).json({ success: true, data: doc });
                    } else {
                        res.status(400).json({ success: false });
                    }
                } else {
                    if (req.body.photoRemoved) {
                        const expectedSignature =
                            cloudinary.utils.api_sign_request(
                                {
                                    public_id:
                                        req.body.cloudinaryParams.public_id,
                                    version: req.body.cloudinaryParams.version,
                                },
                                process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET
                            );

                        if (
                            expectedSignature ===
                            req.body.cloudinaryParams.signature
                        ) {
                            await cloudinary.uploader.destroy(
                                req.body.cloudinaryParams.public_id
                            );
                        } else {
                            res.status(400).json({ success: false });
                        }
                    }
                    const doc = await Marts.findByIdAndUpdate(
                        id,
                        req.body.documentData,
                        {
                            new: true,
                            runValidators: true,
                        }
                    );
                    if (!doc) {
                        return res.status(400).json({ success: false });
                    }
                    res.status(200).json({ success: true, data: doc });
                }
            } catch (error) {
                console.log(error);
                res.status(400).json({ success: false });
            }
            break;

        case "DELETE" /* Delete a model by its ID */:
            try {
                //console.log(req.body);
                if (req.body.cloudinaryParams) {
                    const expectedSignature = cloudinary.utils.api_sign_request(
                        {
                            public_id: req.body.cloudinaryParams.public_id,
                            version: req.body.cloudinaryParams.version,
                        },
                        process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET
                    );
                    if (
                        expectedSignature ===
                        req.body.cloudinaryParams.signature
                    ) {
                        await cloudinary.uploader.destroy(
                            req.body.cloudinaryParams.public_id
                        );
                        await Marts.findByIdAndDelete(id);
                        res.status(201).json({ success: true });
                    } else {
                        res.status(400).json({ success: false });
                    }
                } else {
                    await Marts.findByIdAndDelete(id);
                    res.status(201).json({ success: true });
                }
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
