import {
    Autocomplete,
    Button,
    Divider,
    Paper,
    Stack,
    TextInput,
    Title,
    Notification,
    ActionIcon,
} from "@mantine/core";
import { IconCheck, IconMicrophone, IconPlayerStop } from "@tabler/icons";
import axios from "axios";
import { useEffect, useState } from "react";
//import { AudioRecorder, useAudioRecorder } from "react-audio-voice-recorder";
import { useQuery } from "react-query";
//import { ReactMic } from "react-mic";
import { useReactMediaRecorder } from "react-media-recorder-2";
import LocationAutocomplete from "../../location/LocationAutocomplete";

export default function AddAudioStoryCard({
    profileUser,
    sessionUser,
    refetchStories,
    sessionProfileRelation,
}) {
    //const recorderControls = useAudioRecorder();
    //const [audioBlob, setAudioBlob] = useState();
    const [audioBase64, setAudioBase64] = useState();

    const [storyTitle, setStoryTitle] = useState("");
    const [storyTitleError, setStoryTitleError] = useState(false);
    const [description, setDescription] = useState("");
    const [storyContentError, setStoryContentError] = useState(false);
    const [addStoryNotification, setAddStoryNotification] = useState(false);

    const [locationInputValue, setLocationInputValue] = useState("");
    const [fetchedLocations, setFetchedLocations] = useState([]);

    const [selectedLocation, setSelectedLocation] = useState();
    const [locationError, setLocationError] = useState(false);

    const [record, setRecord] = useState(false);

    /*const startRecording = () => {
        setRecord(true);
    };

    const stopRecording = () => {
        setRecord(false);
    };*/

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

    const { isLoading, isFetching, data, refetch, isError, error } = useQuery({
        queryKey: "post-audio-story",
        queryFn: () => {
            return axios.post("/api/audio-stories", {
                data: audioBase64,
                userId: profileUser._id,
                userName: profileUser.name,
                authorId: sessionUser._id,
                authorName: sessionUser.name,
                title: storyTitle,
                description: description,
                location: {
                    value: selectedLocation.value,
                    lon: selectedLocation.lon
                        ? selectedLocation.lon
                        : "39.476826",
                    lat: selectedLocation.lat
                        ? selectedLocation.lat
                        : "13.496664",
                },
            });
        },
        enabled: false,
        onSuccess: (d) => {
            //console.log("edited", d.data.data);
            setStoryTitle("");
            setDescription("");
            setAudioBase64(null);
            setAddStoryNotification(true);
            refetchStories();
        },
    });

    /*const {
        isLoading: isLoadingLocations,
        isFetching: isFetchingLocations,
        data: dataLocations,
        refetch: refetchLocations,
        isError: isErrorLocations,
        error: errorLocations,
    } = useQuery({
        queryKey: "fetch_locations_audio_stories_card",
        queryFn: () => {
            return axios.get(
                `https://nominatim.openstreetmap.org/search?q=${locationInputValue}&format=json`
            );
        },
        enabled: false,
        onSuccess: (d) => {
            const cit = d.data.map((d) => {
                return {
                    value: d.display_name,
                    lat: d.lat,
                    lon: d.lon,
                };
            });
            setFetchedLocations(cit);
        },
    });*/

    /*
    const handleUpload = async () => {
        const file = await blobToBase64(audioBlob);
        axios
            .post("/api/audio-stories", { data: file })
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                console.log(error);
            });
        console.log(file);
    };
*/

    /*const handleLocationSelect = (l) => {
        console.log(l);
        setSelectedLocation(l);
    };*/

    /*useEffect(() => {
        function refetchLocationsFun() {
            refetchLocations();
        }
        if (locationInputValue !== "") {
            refetchLocationsFun();
        }
    }, [locationInputValue, refetchLocations]);*/

    /*const convertFile = async (blob) => {
        console.log(blob);
        const s = await blobToBase64(blob);
        return s;
    };

    useEffect(() => {
        if (audioBlob) {
            const aud = convertFile(audioBlob);
            console.log("hhh", aud);
            setAudioBase64(aud);
        }
    }, [audioBlob]);*/

    const handleAddStory = () => {
        if (storyTitle === "" || !selectedLocation) {
            storyTitle === "" && setStoryTitleError(true);
            !selectedLocation && setLocationError(true);
        } else {
            refetch();
        }
    };

    if (sessionProfileRelation === "none") {
        return <div>RESTRICTED</div>;
    }

    return (
        <Paper withBorder p="md">
            <Stack spacing="sm">
                <Title order={4} fw={500} align="center">
                    Do you have a story about {profileUser.name}?
                </Title>
                <Divider />
                <TextInput
                    label="What's the story about?"
                    value={storyTitle}
                    onChange={(e) => setStoryTitle(e.target.value)}
                    error={storyTitleError && "title can&apos;t be empty"}
                    onFocus={() => {
                        setAddStoryNotification(false);
                        setStoryTitleError(false);
                    }}
                    placeholder="enter title"
                />
                <TextInput
                    label="A brief description of your story?"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="enter description"
                />
                <Divider />

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

                    {mediaBlobUrl && (
                        <audio src={mediaBlobUrl} controls autoPlay />
                    )}
                </Stack>

                {/*<ReactMic
                    record={record}
                    onStop={addAudioElement}
                    strokeColor="#000000"
                    backgroundColor="#FF4081"
                />
                <button onClick={startRecording} type="button">
                    Start
                </button>
                <button onClick={stopRecording} type="button">
                    Stop
                </button>*/}

                <Divider />
                {/*<Autocomplete
                    label="Where did this story happen"
                    value={locationInputValue}
                    onChange={setLocationInputValue}
                    data={fetchedLocations}
                    onItemSubmit={handleLocationSelect}
                    error={locationError}
                    onFocus={() => {
                        setLocationError(false);
                    }}
                />*/}
                <LocationAutocomplete
                    selectedLocation={selectedLocation}
                    setSelectedLocation={setSelectedLocation}
                    locationError={locationError}
                    setLocationError={setLocationError}
                    id="add-audio-story"
                />
                {addStoryNotification && (
                    <Notification
                        icon={<IconCheck size={18} />}
                        color="teal"
                        title="Story posted!"
                        onClose={() => setAddStoryNotification(false)}
                    >
                        Your story has been added to {profileUser.name}&apos;s
                        wall!
                    </Notification>
                )}
                <Button
                    variant="filled"
                    radius="xl"
                    loading={isLoading || isFetching}
                    disabled={!audioBase64}
                    onClick={handleAddStory}
                >
                    Add Story
                </Button>
            </Stack>
        </Paper>
    );
}
