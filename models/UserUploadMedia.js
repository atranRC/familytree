//ownerId
//url
//thumbnail
//tags
import { ObjectId } from "mongodb";
import mongoose from "mongoose";

/* UserUploadMediaSchema will correspond to a collection in your MongoDB database. */
const UserUploadMediaSchema = mongoose.Schema(
    {
        uploaderId: {
            type: ObjectId,
            required: [true, "please provide uploaderId"],
        },
        profileId: {
            type: ObjectId,
            required: [true, "please provide profileId"],
        },
        eventOrStory: {
            //event, writtenStory, or audioStory
            type: String,
            required: [true, "please provide eventOrStory"],
        },
        eventOrStoryId: {
            type: ObjectId,
            required: [true, "please provide eventOrStoryId"],
        },
        cloudinaryParams: {
            //https://res.cloudinary.com/dcgnu3a5s/image/upload/v1698910681/user_uploads/wrxeyfanxyn7tfebl2oa.png
            //baseUrl + cloud_name + resource_type + type + version + public_id + format
            cloud_name: {
                type: String,
                required: [true, "please provide cloud name"],
            },
            resource_type: {
                type: String,
                required: [true, "please provide resource type"],
            },
            type: {
                type: String,
                required: [true, "please provide type"],
            },
            version: {
                type: String,
                required: [true, "please provide version"],
            },
            public_id: {
                type: String,
                required: [true, "please provide public id"],
            },
            format: {
                type: String,
                required: [true, "please provide format"],
            },
            tags: { type: Array },
        },
        deletedAt: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

export default mongoose.models.UserUploadMedia ||
    mongoose.model("UserUploadMedia", UserUploadMediaSchema);
