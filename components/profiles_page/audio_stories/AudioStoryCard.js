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
//import { AudioRecorder, useAudioRecorder } from "react-audio-voice-recorder";
import { useQuery } from "react-query";

export default function AudioStoryCard({
    story,
    refetchStories,
    sessionProfileRelation,
}) {
    const [descriptionAreaValue, setDescriptionAreaValue] = useState("");
    const [titleValue, setTitleValue] = useState("");
    const [audioValue, setAudioValue] = useState(null);
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
        function refetchaudiostoryFun() {
            refetchAudioStory();
        }
        setAudioValue(null);
        refetchaudiostoryFun();
        setStoryDeleted(false);
        setDescriptionAreaValue(story.description);
        setTitleValue(story.title);
        setLocationInputValue("");
        setDeleteStoryNotification(false);
        setEditMode(false);
    }, [story]);

    useEffect(() => {
        function refetchLocationsFun() {
            refetchLocations();
        }
        if (locationInputValue !== "") {
            refetchLocationsFun();
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
                        {audioValue && (
                            <audio controls preload="none">
                                <source src={audioValue} type="audio/webm" />
                                <source src={audioValue} type="audio/ogg" />
                                Your browser does not support the audio element.
                            </audio>
                        )}
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
