import { ObjectId } from "mongodb";
import mongoose from "mongoose";

/* usersSchema will correspond to a collection in your MongoDB database. */
const MartsSchema = mongoose.Schema(
    {
        uploaderId: {
            type: ObjectId,
            required: [true, "please provide uploaderId"],
        },

        firstName: {
            type: String,
            required: [true, "please provide firstName"],
        },
        middleName: {
            type: String,
        },
        lastName: {
            type: String,
        },

        sex: {
            type: String,
            required: [true, "please provide lastName"],
        },

        born: {
            type: Date,
        },
        died: {
            type: Date,
        },
        birthplace: {
            value: {
                type: String,
            },
            lon: {
                type: mongoose.Types.Decimal128,
            },
            lat: {
                type: mongoose.Types.Decimal128,
            },
        },
        deathplace: {
            value: {
                type: String,
            },
            lon: {
                type: mongoose.Types.Decimal128,
            },
            lat: {
                type: mongoose.Types.Decimal128,
            },
        },
        shortBio: {
            type: String,
        },
        wikiLink: {
            type: String,
        },
        cloudinaryParams: {
            //https://res.cloudinary.com/dcgnu3a5s/image/upload/v1698910681/user_uploads/wrxeyfanxyn7tfebl2oa.png
            //baseUrl + cloud_name + resource_type + type + version + public_id + format
            /*cloud_name: {
            type: String,
        },
        resource_type: {
            type: String,
        },
        type: {
            type: String,
        },
        version: {
            type: String,
        },
        public_id: {
            type: String,
        },
        format: {
            type: String,
        },
        tags: { type: Array },
        signature: {
            type: String,
        },*/
            type: Object,
        },
        deletedAt: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

export default mongoose.models.Marts || mongoose.model("Marts", MartsSchema);
