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
    Box,
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
//import { AudioRecorder, useAudioRecorder } from "react-audio-voice-recorder";
import { useQuery } from "react-query";
import LocationAutocomplete from "../../location/LocationAutocomplete";
import EventOrStoryMediaViewer from "../../v2/media_viewers/EventOrStoryMediaViewer";

export default function AudioStoryCard({
    profileUser,
    sessionUser,
    story,
    refetchStories,
    sessionProfileRelation,
}) {
    //const [descriptionAreaValue, setDescriptionAreaValue] = useState("");
    //const [titleValue, setTitleValue] = useState("");
    const [audioValue, setAudioValue] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [editStoryNotification, setEditStoryNotification] = useState(false);
    const [deleteStoryNotification, setDeleteStoryNotification] =
        useState(false);
    const [storyDeleted, setStoryDeleted] = useState(false);

    /*const [locationInputValue, setLocationInputValue] = useState("");
    const [locationInputValueError, setLocationInputValueError] =
        useState(false);
    const [fetchedLocations, setFetchedLocations] = useState([]);*/
    const [title, setTitle] = useState(story?.title);
    const [titleError, setTitleError] = useState(false);
    const [description, setDescription] = useState(story?.description);
    const [descriptionError, setDescriptionError] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState();
    const [locationError, setLocationError] = useState(false);
    const [showLocationInput, setShowLocationInput] = useState(
        story.location ? false : true
    );

    const {
        isLoading: isLoadingAudioStory,
        isFetching: isFetchingAudioStory,
        data: dataAudioStory,
        refetch: refetchAudioStory,
        isError: isErrorAudioStory,
        error: errorAudioStory,
    } = useQuery({
        queryKey: "fetch_audio_story",
        queryFn: () => {
            return axios.get("/api/audio-stories/" + story._id);
        },
        enabled: false,
        onSuccess: (d) => {
            setAudioValue(d.data.data.audioUrl);
            console.log("fetched new audio url", d.data.data.audioUrl);
        },
    });

    const { isLoading, isFetching, data, refetch, isError, error } = useQuery({
        queryKey: "edit_audio_story",
        queryFn: () => {
            return axios.put("/api/audio-stories/" + story._id, {
                title: title,
                description: description,
                location: selectedLocation,
            });
        },
        enabled: false,
        onSuccess: (d) => {
            //console.log("edited", d.data.data);
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

    /*const {
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
    });*/

    const handleSaveEdit = () => {
        if (
            !selectedLocation ||
            title === "" ||
            !title ||
            !description ||
            description === ""
        ) {
            !selectedLocation && setLocationError(true);
            (title === "" || !title) && setTitleError(true);
            (!description || description === "") && setDescriptionError(true);
        } else {
            refetch();
        }
    };

    const handleCancelEdit = () => {
        setTitle(story?.title);
        setDescription(story?.description);
        setSelectedLocation(story?.location);
        setDeleteStoryNotification(false);
        setEditMode(false);
        setTitleError(false);
        setDescriptionError(false);
        setLocationError(false);
        setShowLocationInput(false);
    };

    const handleDeleteStory = () => {
        refetchDeleteStory();
    };

    /*const handleLocationSelect = (l) => {
        console.log(l);
        setSelectedLocation(l);
    };*/

    useEffect(() => {
        function refetchaudiostoryFun() {
            refetchAudioStory();
        }
        setTitle(story?.title);
        setDescription(story?.description);
        setSelectedLocation(story?.location);

        setAudioValue(null);
        refetchaudiostoryFun();
        setStoryDeleted(false);

        setDeleteStoryNotification(false);
        setEditStoryNotification(false);
        setEditMode(false);

        setTitleError(false);
        setDescriptionError(false);
        setLocationError(false);
        setShowLocationInput(false);
    }, [story, refetchAudioStory]);

    /*useEffect(() => {
        function refetchLocationsFun() {
            refetchLocations();
        }
        if (locationInputValue !== "") {
            refetchLocationsFun();
        }
    }, [locationInputValue, refetchLocations]);*/

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
        <Stack>
            <Paper withBorder p="md">
                <Stack justify="center">
                    <Stack spacing={1}>
                        {editMode ? (
                            <Stack>
                                <TextInput
                                    value={title}
                                    label="Title"
                                    onChange={(event) =>
                                        setTitle(event.currentTarget.value)
                                    }
                                    error={titleError && "please enter title"}
                                    onFocus={() => setTitleError(false)}
                                    //size="xl"
                                />
                                {showLocationInput ? (
                                    <div>
                                        <LocationAutocomplete
                                            selectedLocation={selectedLocation}
                                            setSelectedLocation={
                                                setSelectedLocation
                                            }
                                            locationError={locationError}
                                            setLocationError={setLocationError}
                                            id="audio-story-card"
                                        />
                                        <Text c="dimmed">
                                            <Text
                                                span
                                                c="blue.7"
                                                sx={{
                                                    "&:hover": {
                                                        cursor: "pointer",
                                                    },
                                                }}
                                                underline
                                                italic
                                                onClick={() => {
                                                    setSelectedLocation(
                                                        story.location
                                                    );
                                                    setShowLocationInput(false);
                                                }}
                                            >
                                                Click here
                                            </Text>{" "}
                                            to keep previous location
                                        </Text>
                                    </div>
                                ) : (
                                    <Box
                                        sx={{
                                            border: "1px solid lightgrey",
                                            borderRadius: "5px",
                                            padding: "10px",
                                        }}
                                    >
                                        <Text c="dimmed">
                                            Location previously set to{" "}
                                            <Text span c="teal.7">
                                                {story.location?.value}
                                                {" - "}
                                            </Text>
                                            <Text
                                                span
                                                c="blue.7"
                                                sx={{
                                                    "&:hover": {
                                                        cursor: "pointer",
                                                    },
                                                }}
                                                underline
                                                italic
                                                onClick={() =>
                                                    setShowLocationInput(true)
                                                }
                                            >
                                                Click here
                                            </Text>
                                            <Text span> to edit</Text>
                                        </Text>
                                    </Box>
                                )}
                            </Stack>
                        ) : (
                            <Stack align="center" spacing="sm">
                                <Title
                                    className="storyTitle"
                                    align="center"
                                    color="darkgreen"
                                >
                                    {title}
                                </Title>
                                <Group>
                                    <Title order={6} color="dimmed" fw={450}>
                                        {story?.authorName}
                                    </Title>
                                    <Divider orientation="vertical" />
                                    <Title order={6} color="dimmed" fw={450}>
                                        {story?.location?.value}
                                    </Title>

                                    <Divider orientation="vertical" />
                                    <Title order={6} color="dimmed" fw={450}>
                                        {story?.createdAt?.split("T")[0]}
                                    </Title>
                                </Group>
                            </Stack>
                        )}

                        {deleteStoryNotification && (
                            <Notification
                                icon={<IconAlertOctagon size={18} />}
                                color="red"
                                title="Delete Story?"
                                onClose={() =>
                                    setDeleteStoryNotification(false)
                                }
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
                                                loading={
                                                    isLoading || isFetching
                                                }
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
                                                    setDeleteStoryNotification(
                                                        true
                                                    )
                                                }
                                            >
                                                <IconTrash
                                                    size={20}
                                                    color="red"
                                                />
                                            </ActionIcon>
                                            <ActionIcon
                                                color="dark"
                                                radius="xl"
                                                variant="default"
                                                onClick={handleCancelEdit}
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
                                                onClick={() =>
                                                    setEditMode(true)
                                                }
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
                                                <IconShare
                                                    size={20}
                                                    color="teal"
                                                />
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
                        <Stack align="center" justify="center">
                            {audioValue && (
                                <audio controls preload="none">
                                    <source
                                        src={audioValue}
                                        type="audio/webm"
                                    />
                                    <source src={audioValue} type="audio/ogg" />
                                    Your browser does not support the audio
                                    element.
                                </audio>
                            )}
                            <Text>{description}</Text>
                        </Stack>
                    ) : (
                        <Textarea
                            autosize
                            minRows={10}
                            value={description}
                            onChange={(event) =>
                                setDescription(event.currentTarget.value)
                            }
                            error={
                                descriptionError && "please enter description"
                            }
                            onFocus={() => setDescriptionError(false)}
                        />
                    )}

                    <Divider
                        label={<IconAnchor color="green" />}
                        labelPosition="center"
                    />
                </Stack>
            </Paper>
            <Paper withBorder p="md">
                {!editMode && (
                    <EventOrStoryMediaViewer
                        sessionProfileRelation={sessionProfileRelation}
                        profileUser={profileUser}
                        sessionUser={sessionUser}
                        eventOrStoryId={story._id}
                        eventOrStory="audioStory"
                    />
                )}
            </Paper>
        </Stack>
    );
}
