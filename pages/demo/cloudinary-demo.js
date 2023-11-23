import { useRef, useState } from "react";
//import UploadWidget from "../../components/upload_widget/UploadWidget";
import { Button, Image } from "@mantine/core";
import { generateThumbUrl } from "../../utils/cloudinaryUtils";
import axios from "axios";
import UserMediaUploader from "../../components/v2/media_upload/UserMediaUploader";

export default function CloudinaryDemoPage() {
    const [url, updateUrl] = useState();
    const [error, updateError] = useState();

    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [showUploaded, setShowUploaded] = useState(false);

    const inputRef = useRef(null);
    const [photos, setPhotos] = useState(null);

    function handleOnUpload(error, result, widget) {
        //https://res.cloudinary.com/dcgnu3a5s/image/upload/v1695713877/user_uploads/d0rv6nnisa4pafy6vsqk.jpg
        //https://res.cloudinary.com/dcgnu3a5s/image/upload/c_scale,w_150/v1695713498/user_uploads/ksuauxiicamzwngpgxr4.jpg

        if (error) {
            updateError(error);
            widget.close({
                quiet: true,
            });
            return;
        }
        if (result) {
            console.log(result);
            console.log("url is", generateThumbUrl(result?.info));

            const bod = {
                uploaderId: "645b8d59840158d8e7e27fe7",
                profileId: "645b8d59840158d8e7e27fe7",
                uploaderId: "645b8d59840158d8e7e27fe7",
                eventOrStory: "event",
                eventOrStoryId: "645b8d59840158d8e7e27fe7",
                secureUrl: result?.info.secure_url,
                thumbnailUrl: generateThumbUrl(result?.info),
                tags: ["tag1", "tag2"],
            };

            axios
                .post("/api/user-upload-media/", bod)
                .then((response) => console.log("database updated", response))
                .catch((error) => {
                    console.error("There was an error!");
                });
        } else {
            console.log("did no upload");
        }

        /*if (result?.info?.secure_url) {
            console.log("heres the secure url", result);

            const bod = {
                ownerId: uploaderId,
                secureUrl: result.info.secure_url,
                thumbnail: result.info.thumbnail_url,
                tags: ["tag1", "tag2"],
            };

            axios
                .post("/api/article-static-media/", bod)
                .then(
                    (response) =>
                        console.log(
                            "success"
                        ) 
                )
                .catch((error) => {
                    
                    console.error("There was an error!");
                });
        }*/
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("here", inputRef.current.files[0]);
    };

    const handleBut = async () => {
        const signatureResponse = await axios.get(
            "/api/cloudinary/get_sign?preset=user_uploads_preset"
        );
        console.log(signatureResponse);
        console.log("sig resssss");

        Array.from(inputRef.current.files).forEach(async (element, i) => {
            //console.log(element);
            console.log("index", i);

            const fData = new FormData();
            fData.append("file", inputRef.current.files[i]);
            fData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY);
            fData.append("signature", signatureResponse.data.signature);
            fData.append("timestamp", signatureResponse.data.timestamp);
            fData.append("upload_preset", "user_uploads_preset");

            const cloudinaryResponse = await axios.post(
                `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
                fData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                    onUploadProgress: function (e) {
                        console.log(e.loaded / e.total);
                    },
                }
            );
            console.log(cloudinaryResponse.data);
            const bod = {
                signature: cloudinaryResponse.data.signature,
                documentData: {
                    uploaderId: "645b8d59840158d8e7e27fe7",
                    profileId: "645b8d59840158d8e7e27fe7",
                    eventOrStory: "event",
                    eventOrStoryId: "645b8d59840158d8e7e27fe7",
                    cloudinaryParams: {
                        cloud_name:
                            process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
                        resource_type: cloudinaryResponse.data.resource_type,
                        type: cloudinaryResponse.data.type,
                        version: cloudinaryResponse.data.version,
                        public_id: cloudinaryResponse.data.public_id,
                        format: cloudinaryResponse.data.format,
                        tags: cloudinaryResponse.data.tags,
                    },
                },
            };
            console.log(bod);
            const dbResponse = await axios.post("/api/user-upload-media", bod);
            console.log(dbResponse.data.data);
        });
    };
    return (
        <div>
            {/*<UploadWidget onUpload={handleOnUpload} folder="user_uploads">
                {({ open }) => {
                    function handleOnClick(e) {
                        e.preventDefault();
                        open();
                    }
                    return (
                        <Button onClick={handleOnClick}>Upload Media</Button>
                    );
                }}
            </UploadWidget>*/}
            {/*<UserMediaUploader
                uploaderId="645b8d59840158d8e7e27fe7"
                profileId="645b8d59840158d8e7e27fe7"
                eventOrStory="writtenStory"
                eventOrStoryId="645b8d59840158d8e7e27fe7"
            />*/}
            <form>
                <input
                    ref={inputRef}
                    type="file"
                    multiple
                    onChange={() => setPhotos(inputRef.current.files)}
                />
            </form>
            {photos && (
                <Image
                    src={URL.createObjectURL(photos[0])}
                    height={300}
                    width={240}
                />
            )}
            <button onClick={handleBut}>but</button>
        </div>
    );
}
