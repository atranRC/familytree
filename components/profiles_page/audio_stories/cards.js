import {
    ActionIcon,
    Autocomplete,
    Button,
    Divider,
    Group,
    Paper,
    Skeleton,
    Stack,
    Text,
    TextInput,
    Textarea,
    Title,
    createStyles,
    Notification,
    Image,
} from "@mantine/core";
import {
    IconAlertOctagon,
    IconAnchor,
    IconCheck,
    IconMicrophone,
    IconPencil,
    IconPlant2,
    IconShare,
    IconTrash,
    IconX,
} from "@tabler/icons";
import axios from "axios";
import { useEffect, useState } from "react";
import { AudioRecorder, useAudioRecorder } from "react-audio-voice-recorder";
import { useQuery } from "react-query";

export function AddAudioStoryCard({
    profileUser,
    sessionUser,
    refetchStories,
    sessionProfileRelation,
}) {
    const recorderControls = useAudioRecorder();
    const [audioBlob, setAudioBlob] = useState();
    const [audioBase64, setAudioBase64] = useState();

    const [storyTitle, setStoryTitle] = useState("");
    const [storyTitleError, setStoryTitleError] = useState(false);
    const [description, setDescription] = useState("");
    const [storyContentError, setStoryContentError] = useState(false);
    const [addStoryNotification, setAddStoryNotification] = useState(false);
    const [locationError, setLocationError] = useState(false);

    const [locationInputValue, setLocationInputValue] = useState("");
    const [selectedLocation, setSelectedLocation] = useState({});
    const [fetchedLocations, setFetchedLocations] = useState([]);

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

    const addAudioElement = async (blob) => {
        const url = URL.createObjectURL(blob);
        //const audio = document.createElement("audio");
        //audio.src = url;
        //audio.controls = true;
        //setAudioBlob(blob);
        const b64Blob = await blobToBase64(url);
        console.log(b64Blob);
        setAudioBase64(b64Blob);
        //document.body.appendChild(audio);
    };

    const { isLoading, isFetching, data, refetch, isError, error } = useQuery({
        queryKey: "post-audio-story",
        queryFn: () => {
            return axios.post("/api/audio-stories", {
                data: audioBase64,
                userId: profileUser._id,
                authorId: sessionUser._id,
                authorName: sessionUser.name,
                title: storyTitle,
                description: description,
                location: {
                    value: locationInputValue,
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
            console.log("edited", d.data.data);
            setStoryTitle("");
            setDescription("");
            setAudioBase64(null);
            setAddStoryNotification(true);
            refetchStories();
        },
    });

    const {
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
    });

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

    const handleLocationSelect = (l) => {
        console.log(l);
        setSelectedLocation(l);
    };

    useEffect(() => {
        if (locationInputValue !== "") {
            refetchLocations();
        }
    }, [locationInputValue]);

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
        if (storyTitle === "") {
            storyTitle === "" && setStoryTitleError(true);
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
                <AudioRecorder
                    onRecordingComplete={(blob) => addAudioElement(blob)}
                    recorderControls={recorderControls}
                />
                <Divider />
                <Autocomplete
                    label="Where did this story happen"
                    value={locationInputValue}
                    onChange={setLocationInputValue}
                    data={fetchedLocations}
                    onItemSubmit={handleLocationSelect}
                    error={locationError}
                    onFocus={() => {
                        setLocationError(false);
                    }}
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

export function MiniAudioStoryCard({
    story,
    setDrawerOpened,
    selectedStory,
    setSelectedStory,
    setViewMode,
    viewMode,
}) {
    const useStyles = createStyles((theme) => ({
        treeLink: {
            textDecoration: "none",
            "&:hover": {
                //border: "1px solid",
                textDecoration: "underline",
                transition: "0.5s",
            },
        },
        card: {
            cursor: "pointer",
            border:
                selectedStory &&
                viewMode !== "add" &&
                story._id.toString() === selectedStory._id.toString()
                    ? "1px solid"
                    : "",
            "&:hover": {
                border: "1px solid",
                textDecoration: "underline",
                transition: "0.5s",
            },
        },
    }));
    const { classes } = useStyles();
    return (
        <Paper
            className={classes.card}
            withBorder
            p="md"
            onClick={() => {
                setViewMode("view");
                setSelectedStory(story);
                setDrawerOpened(true);
            }}
        >
            <Stack spacing={2}>
                <Title order={5} fw={500} c="blue">
                    {story.title}
                </Title>
                <Group>
                    <Text c="dimmed">{story.authorName}</Text>
                </Group>
            </Stack>
        </Paper>
    );
}

export function MiniAudioStoryCardSkeleton() {
    return (
        <Paper withBorder p="md">
            <Stack spacing={2}>
                <Skeleton height={8} radius="xl" />
                <Skeleton height={8} mt={6} radius="xl" />
                <Skeleton height={8} mt={6} radius="xl" />
                <Skeleton height={8} mt={6} width="70%" radius="xl" />
                <Group>
                    <Skeleton height={8} mt={6} width="30%" radius="xl" />
                    <Skeleton height={8} mt={6} width="30%" radius="xl" />
                </Group>
            </Stack>
        </Paper>
    );
}

export function MiniAddAudioStoryCard({
    setViewMode,
    viewMode,
    setDrawerOpened,
}) {
    const useStyles = createStyles((theme) => ({
        card: {
            cursor: "pointer",
            border: viewMode === "add" && "1px solid",
            "&:hover": {
                border: "1px solid",
                textDecoration: "underline",
                transition: "0.5s",
            },
        },
    }));
    const { classes } = useStyles();
    return (
        <Paper
            withBorder
            p="md"
            className={classes.card}
            onClick={() => {
                setDrawerOpened(true);

                setViewMode("add");
            }}
        >
            <Group>
                <IconMicrophone size={20} color="green" />
                <Title order={5} fw={500} c="blue">
                    Record a story
                </Title>
            </Group>
        </Paper>
    );
}

export function AudioStoryCard({
    story,
    refetchStories,
    sessionProfileRelation,
}) {
    const [descriptionAreaValue, setDescriptionAreaValue] = useState("");
    const [titleValue, setTitleValue] = useState("");
    const [editMode, setEditMode] = useState(false);
    const [editStoryNotification, setEditStoryNotification] = useState(false);
    const [deleteStoryNotification, setDeleteStoryNotification] =
        useState(false);
    const [storyDeleted, setStoryDeleted] = useState(false);
    const [locationValue, setLocationValue] = useState("");

    const [locationInputValue, setLocationInputValue] = useState("");
    const [locationInputValueError, setLocationInputValueError] =
        useState(false);
    const [selectedLocation, setSelectedLocation] = useState({});
    const [fetchedLocations, setFetchedLocations] = useState([]);

    const { isLoading, isFetching, data, refetch, isError, error } = useQuery({
        queryKey: "edit_audio_story",
        queryFn: () => {
            return axios.put("/api/audio-stories/" + story._id, {
                title: titleValue,
                description: descriptionAreaValue,
                location: {
                    value: locationInputValue,
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
            console.log("edited", d.data.data);
            setEditMode(false);
            setEditStoryNotification(true);
            refetchStories();
        },
    });

    const {
        isLoading: isLoadingDeleteStory,
        isFetching: isFetchingDeleteStory,
        refetch: refetchDeleteStory,
    } = useQuery({
        queryKey: "delete-audio-story",
        queryFn: () => {
            return axios.delete("/api/audio-stories/" + story._id);
        },
        enabled: false,
        onSuccess: (d) => {
            console.log("edited", d.data.data);
            setEditMode(false);
            setStoryDeleted(true);
            refetchStories();
        },
    });

    const {
        isLoading: isLoadingLocations,
        isFetching: isFetchingLocations,
        data: dataLocations,
        refetch: refetchLocations,
        isError: isErrorLocations,
        error: errorLocations,
    } = useQuery({
        queryKey: "fetch-locations-audio",
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
    });

    const handleSaveEdit = () => {
        if (
            !selectedLocation.value ||
            !selectedLocation.lon ||
            !selectedLocation.lat
        ) {
            setLocationInputValueError(true);
        } else {
            refetch();
        }
    };

    const handleDeleteStory = () => {
        refetchDeleteStory();
    };

    const handleLocationSelect = (l) => {
        console.log(l);
        setSelectedLocation(l);
    };

    useEffect(() => {
        setStoryDeleted(false);
        setDescriptionAreaValue(story.description);
        setTitleValue(story.title);
        setLocationInputValue("");
        setDeleteStoryNotification(false);
        setEditMode(false);
    }, [story]);

    useEffect(() => {
        if (locationInputValue !== "") {
            refetchLocations();
        }
    }, [locationInputValue]);

    if (storyDeleted) {
        return (
            <Paper withBorder p="md" bg="#f7f9fc">
                <Stack align="center" justify="center" spacing={0}>
                    <Image
                        style={{
                            width: 200,
                            marginLeft: "auto",
                            marginRight: "auto",
                        }}
                        radius="xs"
                        src="https://img.freepik.com/free-vector/illustration-trash-bin-icon_53876-5598.jpg"
                        alt="story deleted"
                    />
                    <Title order={2} fw={500} color="dimmed">
                        Story Deleted!
                    </Title>
                </Stack>
            </Paper>
        );
    }

    return (
        <Paper withBorder p="md" mih="100vh">
            <Stack justify="center">
                <Stack spacing={1} justify="center" align="center">
                    {editMode ? (
                        <Stack>
                            <TextInput
                                value={titleValue}
                                onChange={(event) =>
                                    setTitleValue(event.currentTarget.value)
                                }
                                size="xl"
                            />
                            <Autocomplete
                                label="Location"
                                value={locationInputValue}
                                onChange={setLocationInputValue}
                                data={fetchedLocations}
                                onItemSubmit={handleLocationSelect}
                                error={locationInputValueError}
                                onFocus={() =>
                                    setLocationInputValueError(false)
                                }
                            />
                        </Stack>
                    ) : (
                        <Title
                            className="storyTitle"
                            align="center"
                            color="darkgreen"
                        >
                            {titleValue}
                        </Title>
                    )}
                    <Group>
                        <Title order={6} color="dimmed" fw={450}>
                            {story.authorName}
                        </Title>
                        <Divider orientation="vertical" />
                        <Title order={6} color="dimmed" fw={450}>
                            {story.location.value}
                        </Title>

                        <Divider orientation="vertical" />
                        <Title order={6} color="dimmed" fw={450}>
                            {story.createdAt.split("T")[0]}
                        </Title>
                    </Group>
                    {deleteStoryNotification && (
                        <Notification
                            icon={<IconAlertOctagon size={18} />}
                            color="red"
                            title="Delete Story?"
                            onClose={() => setDeleteStoryNotification(false)}
                        >
                            <Group>
                                <Button
                                    size="sm"
                                    color="red"
                                    compact
                                    loading={
                                        isLoadingDeleteStory ||
                                        isFetchingDeleteStory
                                    }
                                    onClick={handleDeleteStory}
                                >
                                    Delete{" "}
                                </Button>
                                <Button
                                    size="sm"
                                    compact
                                    onClick={() => {
                                        setDeleteStoryNotification(false);
                                        setEditMode(false);
                                    }}
                                >
                                    Cancel{" "}
                                </Button>
                            </Group>
                        </Notification>
                    )}
                    <Group mt="sm" spacing="xs">
                        {editMode ? (
                            <>
                                {(sessionProfileRelation === "self" ||
                                    sessionProfileRelation === "owner") && (
                                    <>
                                        <ActionIcon
                                            color="dark"
                                            radius="xl"
                                            variant="default"
                                            onClick={handleSaveEdit}
                                            loading={isLoading || isFetching}
                                        >
                                            <IconCheck
                                                size={20}
                                                color="green"
                                            />
                                        </ActionIcon>
                                        <ActionIcon
                                            color="dark"
                                            radius="xl"
                                            variant="default"
                                            onClick={() =>
                                                setDeleteStoryNotification(true)
                                            }
                                        >
                                            <IconTrash size={20} color="red" />
                                        </ActionIcon>
                                        <ActionIcon
                                            color="dark"
                                            radius="xl"
                                            variant="default"
                                            onClick={() => {
                                                setDeleteStoryNotification(
                                                    false
                                                );
                                                setEditMode(false);
                                            }}
                                        >
                                            <IconX size={20} color="blue" />
                                        </ActionIcon>
                                    </>
                                )}
                            </>
                        ) : (
                            <>
                                {(sessionProfileRelation === "self" ||
                                    sessionProfileRelation === "owner") && (
                                    <>
                                        <ActionIcon
                                            color="dark"
                                            radius="xl"
                                            variant="default"
                                            onClick={() => setEditMode(true)}
                                        >
                                            <IconPencil
                                                size={20}
                                                color="green"
                                            />
                                        </ActionIcon>
                                        <ActionIcon
                                            color="dark"
                                            radius="xl"
                                            variant="default"
                                        >
                                            <IconShare size={20} color="teal" />
                                        </ActionIcon>
                                    </>
                                )}
                            </>
                        )}
                    </Group>
                    {editStoryNotification && (
                        <Notification
                            icon={<IconCheck size={18} />}
                            color="teal"
                            title="Story updated!"
                            onClose={() => setEditStoryNotification(false)}
                        >
                            Story has been edited!
                        </Notification>
                    )}
                </Stack>

                <Divider
                    label={<IconPlant2 color="green" />}
                    labelPosition="center"
                />
                {!editMode ? (
                    <Stack>
                        <audio controls>
                            <source src={story.audioUrl} type="audio/ogg" />
                            <source src={story.audioUrl} type="audio/mpeg" />
                            Your browser does not support the audio element.
                        </audio>
                        <Text>{descriptionAreaValue}</Text>
                    </Stack>
                ) : (
                    <Textarea
                        autosize
                        minRows={10}
                        value={descriptionAreaValue}
                        onChange={(event) =>
                            setDescriptionAreaValue(event.currentTarget.value)
                        }
                    />
                )}
                <Divider
                    label={<IconAnchor color="green" />}
                    labelPosition="center"
                />
            </Stack>
        </Paper>
    );
}
