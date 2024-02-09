import {
    ActionIcon,
    Button,
    Group,
    RingProgress,
    Select,
    Stack,
    TextInput,
    Textarea,
    Title,
} from "@mantine/core";
import {
    IconBoxAlignTop,
    IconChevronLeft,
    IconCircleCheck,
    IconDeviceFloppy,
    IconMicrophone,
    IconPencil,
    IconPlayerStop,
} from "@tabler/icons";
import LocationAutocompleteV2 from "../../location/location_autocomplete/LocationAutoCompleteV2";
import { useRouter } from "next/router";
import { AudioStoriesQueryContext } from "../../page_comps/audio_stories/AudioStoriesPageComp";
import { useContext, useState } from "react";
import { useForm } from "@mantine/form";
import { useStyles } from "./AddAudioStoryStyles";
import { useMutation } from "react-query";
import axios from "axios";
import { useReactMediaRecorder } from "react-media-recorder-2";
import {
    ProfilePageNotificationContext,
    ProfilePageProfileContext,
} from "../../../../contexts/profilePageContexts";
import { useSession } from "next-auth/react";

export default function AddAudioStory({ onViewModeChange = () => {} }) {
    const { data: session } = useSession();
    const router = useRouter();

    const audioStoriesQueryRefetchContext = useContext(
        AudioStoriesQueryContext
    );
    const profileQueryContext = useContext(ProfilePageProfileContext);
    const profilePageNotification = useContext(ProfilePageNotificationContext);

    const [progressValue, setProgressValue] = useState(0);
    const [audioBase64, setAudioBase64] = useState();

    const [locationError, setLocationError] = useState(false);
    const blobToBase64 = (url) => {
        return new Promise(async (resolve, _) => {
            // do a request to the blob uri
            const response = await fetch(url);

            // response has a method called .blob() to get the blob file
            const blob = await response.blob();

            // instantiate a file reader
            const fileReader = new FileReader();

            // read the file
            fileReader.readAsDataURL(blob);

            fileReader.onloadend = function () {
                resolve(fileReader.result); // Here is the base64 string
            };
        });
    };

    const addAudioElement = async (blobUrl, blob) => {
        //const url = URL.createObjectURL(blob);
        //const audio = document.createElement("audio");
        //audio.src = url;
        //audio.controls = true;
        //setAudioBlob(blob);
        const b64Blob = await blobToBase64(blobUrl);
        //console.log(b64Blob);
        setAudioBase64(b64Blob);
        //document.body.appendChild(audio);
    };

    const { status, startRecording, stopRecording, mediaBlobUrl } =
        useReactMediaRecorder({
            video: false,
            onStop: (blobUrl, blob) => addAudioElement(blobUrl, blob),
        });

    const form = useForm({
        initialValues: {
            userId: profileQueryContext._id,
            userName: profileQueryContext.name,
            title: "",
            description: "",
            location: null,
        },

        validate: {
            title: (value) =>
                value < 2 || value.length > 40 ? "Invalid title" : null,
            description: (value) =>
                value.length > 500 ? "Invalid description" : null,
        },
    });
    const { classes } = useStyles({
        isValid:
            !!form.values.title &&
            !!form.values.description &&
            !!form.values.location &&
            !!audioBase64,
    });

    const createNotification = useMutation({
        mutationFn: (id) => {
            return axios.post(`/api/v2/notifications`, {
                targetUserId: profileQueryContext._id,
                targetUserName: profileQueryContext.name,
                message: `${session.user.name} posted an Audio Story to your profile`,
                url: `/profiles/${profileQueryContext._id}/audio-stories?contentId=${id}`,
            });
        },
        onSuccess: (res) => {},
        onError: () => {
            profilePageNotification[1]("Error sending notification");
        },
    });

    //{JSON.stringify(form.values)}
    const addStoryMutation = useMutation({
        mutationFn: (cloudinaryResParams) => {
            return axios.post(`/api/audio-stories/`, {
                ...form.values,
                cloudinaryParams: cloudinaryResParams,
            });
        },
        onSuccess: (res) => {
            if (
                profileQueryContext.owner === "self" &&
                profileQueryContext._id.toString() !== session.user.id
            ) {
                /*console.log(
                    "notification",
                    profileQueryContext.owner,
                    profileQueryContext._id,
                    session.user.id
                );*/
                createNotification.mutate(res.data._id.toString());
            }
            profilePageNotification[0]("Story added successfully");
            form.reset();
            setAudioBase64();
            audioStoriesQueryRefetchContext();
            router.push(
                {
                    //...router,
                    query: {
                        ...router.query,
                        contentId: res.data._id.toString(),
                    },
                },
                undefined,
                { shallow: true }
            );
            onViewModeChange("view");
        },
        onError: () => {
            profilePageNotification[1]("Error adding story");
        },
    });

    const uploadAudioMutation = useMutation({
        mutationFn: async () => {
            const signatureResponse = await axios.get(
                "/api/cloudinary/get_sign?preset=audio_stories_upload_preset"
            );

            const fData = new FormData();
            fData.append("file", audioBase64);
            fData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY);
            fData.append("signature", signatureResponse.data.signature);
            fData.append("timestamp", signatureResponse.data.timestamp);
            fData.append("upload_preset", "audio_stories_upload_preset");

            return axios.post(
                `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload`,
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
        },
        onSuccess: (res) => {
            console.log(res.data?.url);
            addStoryMutation.mutate({
                cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
                resource_type: res.data.resource_type,
                type: res.data.type,
                version: res.data.version,
                public_id: res.data.public_id,
                format: res.data.format,
                tags: res.data.tags,
            });
        },
        onError: () => {
            profilePageNotification[1]("Error adding story");
        },
    });

    return (
        <div className={classes.cont}>
            <Stack spacing={3}>
                <Title order={3} align="center" color="dimmed">
                    What&apos;s this story about?
                </Title>

                <TextInput
                    icon={<IconBoxAlignTop />}
                    radius="1.5em"
                    {...form.getInputProps("title")}
                />
            </Stack>
            <Stack spacing={3}>
                <Title order={3} align="center" color="dimmed">
                    {`Tell your story about ${profileQueryContext.name}`}
                </Title>
                <Textarea
                    autosize
                    minRows={6}
                    maxRows={15}
                    icon={<IconPencil />}
                    radius="1.5em"
                    {...form.getInputProps("description")}
                />
            </Stack>
            <Group grow align="flex-start">
                <Stack spacing={3}>
                    <Title order={3} align="center" color="dimmed">
                        Where did this story happen?
                    </Title>
                    <LocationAutocompleteV2
                        defaultValue={form.values["location"]?.value || ""}
                        setSelectedLocation={(locObj) =>
                            form.setFieldValue("location", locObj)
                        }
                        locationError={locationError}
                        setLocationError={setLocationError}
                        label=""
                        desc=""
                        id="audio_story_add_location"
                    />
                </Stack>
            </Group>
            {uploadAudioMutation.isLoading ? (
                <Stack align="center">
                    <RingProgress
                        size={100}
                        thickness={10}
                        roundCaps
                        sections={[{ value: progressValue, color: "cyan" }]}
                        label={`${progressValue}%`}
                    />
                </Stack>
            ) : (
                <Stack align="center">
                    <p>{status}</p>
                    {(status === "idle" || status === "stopped") && (
                        <ActionIcon
                            color="teal"
                            size="xl"
                            radius="xl"
                            variant="light"
                            onClick={startRecording}
                        >
                            <IconMicrophone size="2.125rem" />
                        </ActionIcon>
                    )}
                    {status === "recording" && (
                        <ActionIcon
                            color="red"
                            size="xl"
                            radius="xl"
                            variant="light"
                            onClick={stopRecording}
                        >
                            <IconPlayerStop size="2.125rem" />
                        </ActionIcon>
                    )}

                    {mediaBlobUrl && <audio src={mediaBlobUrl} controls />}
                </Stack>
            )}

            <Button
                radius="1.5em"
                color="green"
                leftIcon={<IconDeviceFloppy />}
                /*onClick={() => addStoryMutation.mutate()}
                    loading={addStoryMutation.isLoading}
                    disabled={
                        !(
                            !!form.values.title &&
                            !!form.values.description &&
                            !!form.values.location
                        )
                    }*/
                loading={
                    uploadAudioMutation.isLoading || addStoryMutation.isLoading
                }
                onClick={() => uploadAudioMutation.mutate()}
                disabled={
                    !(
                        !!form.values.title &&
                        !!form.values.description &&
                        !!form.values.location &&
                        !!audioBase64
                    )
                }
            >
                Add Story
            </Button>
        </div>
    );
}
