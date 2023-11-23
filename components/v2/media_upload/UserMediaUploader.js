import { useEffect, useRef, useState } from "react";
//import UploadWidget from "../../upload_widget/UploadWidget";
import {
    Button,
    FileInput,
    Group,
    Loader,
    Progress,
    Stack,
    Notification,
} from "@mantine/core";
//import { generateThumbUrl } from "../../utils/cloudinaryUtils";
import { generateThumbUrl } from "../../../utils/cloudinaryUtils";
import axios from "axios";
import { IconCheck, IconUpload } from "@tabler/icons";
import { useQueryClient } from "react-query";

export default function UserMediaUploader({
    uploaderId,
    profileId,
    eventOrStory,
    eventOrStoryId,
}) {
    const inputRef = useRef(null);
    const [files, setFiles] = useState([]);
    const [filesUploaded, setFilesUploaded] = useState(0);
    const [progressValue, setProgressValue] = useState(0);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const queryClient = useQueryClient();

    const handleUpload = async () => {
        setIsUploading(true);
        let fileCounter = 0;
        const signatureResponse = await axios.get(
            "/api/cloudinary/get_sign?preset=user_uploads_preset"
        );

        Array.from(files).forEach(async (element, i) => {
            const fData = new FormData();
            fData.append("file", files[i]);
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
                        //console.log(e.loaded / e.total);

                        setProgressValue(
                            Math.floor((e.loaded / e.total) * 100)
                        );
                    },
                }
            );
            const bod = {
                signature: cloudinaryResponse.data.signature,
                documentData: {
                    uploaderId: uploaderId,
                    profileId: profileId,
                    eventOrStory: eventOrStory,
                    eventOrStoryId: eventOrStoryId,
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
            const dbResponse = await axios.post("/api/user-upload-media", bod);
            //console.log(dbResponse.data.data);

            fileCounter = fileCounter + 1;
            setFilesUploaded(fileCounter);

            if (fileCounter === files.length) {
                //clear selection
                setFiles([]);
                //setFilesUploaded(0);
                //setProgressValue(0);
                //setFiles(0);
                //refetch photos
                setUploadSuccess(true);
                queryClient.invalidateQueries({
                    queryKey: ["user-uploaded-media", eventOrStoryId],
                });
                setIsUploading(false);
            }
        });

        //clear selection
        //setFiles([]);
        //refetch photos
    };

    const handleClear = () => {
        setFiles([]);
    };

    useEffect(() => {
        function reset() {
            setFiles([]);
            setFilesUploaded(0);
            setProgressValue(0);
            setUploadSuccess(false);
        }
        reset();
    }, [eventOrStoryId]);

    return (
        <Stack spacing="sm">
            <FileInput
                //ref={inputRef}
                //type="file"
                multiple
                accept="image/png,image/jpeg,image/jpg"
                value={files}
                onChange={setFiles}
                //onChange={() => setPhotos(inputRef.current.files)}
                placeholder="Click here to add photos"
                //label="Upload Photos"
                //description="Add photos related to this event"
                radius="xl"
                size="md"
                icon={<IconUpload size={14} />}
            />
            {uploadSuccess && (
                <Notification
                    icon={<IconCheck size={18} />}
                    color="teal"
                    title="Upload Successful"
                    onClose={() => setUploadSuccess(false)}
                >
                    Photos uploaded successfully
                </Notification>
            )}
            {isUploading && (
                <div>
                    {files.length > 0 && (
                        <Notification
                            loading
                            title="Uploading Photos"
                            disallowClose
                        >
                            {`Please wait while uploading ${filesUploaded} of ${files.length} photos`}
                        </Notification>
                    )}
                </div>
            )}

            <Group grow>
                <Button
                    disabled={files.length < 1 || isUploading}
                    onClick={handleUpload}
                >
                    {isUploading ? (
                        <div>
                            {files.length > 0 && (
                                <div>{`Uploaded ${filesUploaded} of ${files.length} `}</div>
                            )}
                        </div>
                    ) : (
                        <div>Upload</div>
                    )}
                </Button>
                <Button
                    color="red"
                    disabled={files.length < 1 || isUploading}
                    onClick={handleClear}
                >
                    Clear
                </Button>
            </Group>
        </Stack>
    );
}

//
