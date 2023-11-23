export function getThumbUrl(cloudinaryParams) {
    //https://res.cloudinary.com/<cloud_name>/<asset_type>/<delivery_type>/<transformations>/<version>/<public_id>.<extension>
    const transformations = "c_scale,w_150";
    return `${process.env.NEXT_PUBLIC_CLOUDINARY_BASE_URL}/${cloudinaryParams.cloud_name}/${cloudinaryParams.resource_type}/${cloudinaryParams.type}/${transformations}/${cloudinaryParams.public_id}.${cloudinaryParams.format}`;
}

export function getSecUrl(cloudinaryParams) {
    //https://res.cloudinary.com/dcgnu3a5s/image/upload/v1698910681/user_uploads/wrxeyfanxyn7tfebl2oa.png
    //baseUrl + cloud_name + resource_type + type + version + public_id + format
    return `${process.env.NEXT_PUBLIC_CLOUDINARY_BASE_URL}/${cloudinaryParams.cloud_name}/${cloudinaryParams.resource_type}/${cloudinaryParams.type}/v${cloudinaryParams.version}/${cloudinaryParams.public_id}.${cloudinaryParams.format}`;
}

export function getDefVectorSecUrl(sex) {
    /*const femaleVector = {
        //https://res.cloudinary.com/dcgnu3a5s/image/upload/v1700153535/marts/male_vector.jpg
        cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        resource_type: "image",
        type: "upload",
        version: "1700153535",
        public_id: "marts/female_vector",
        format: "jpg",
        tags: [],
    };*/
    const f =
        "https://res.cloudinary.com/dcgnu3a5s/image/upload/v1700153535/marts/female_vector.jpg";
    const m =
        "https://res.cloudinary.com/dcgnu3a5s/image/upload/v1700153535/marts/male_vector.jpg";

    /*const maleVector = {
        //https://res.cloudinary.com/dcgnu3a5s/image/upload/v1700153535/marts/male_vector.jpg
        cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        resource_type: "image",
        type: "upload",
        version: "1700153535",
        public_id: "marts/male_vector",
        format: "jpg",
        tags: [],
    };*/
    return sex === "female" ? f : m;
}
