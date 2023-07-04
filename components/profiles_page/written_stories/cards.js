import {
    Button,
    Container,
    MediaQuery,
    Paper,
    Stack,
    Textarea,
    TextInput,
    Title,
    Notification,
    Group,
    Text,
    Skeleton,
    createStyles,
    Divider,
    ActionIcon,
    Image,
    Autocomplete,
    Box,
} from "@mantine/core";
import axios from "axios";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import {
    IconAlertOctagon,
    IconAnchor,
    IconCheck,
    IconHomeCancel,
    IconPencil,
    IconPlant2,
    IconPlus,
    IconShare,
    IconTrash,
    IconX,
} from "@tabler/icons";
import LocationAutocomplete from "../../location/LocationAutocomplete";

export function AddStoryCard({
    profileUser,
    sessionUser,
    refetchStories,
    sessionProfileRelation,
}) {
    const [storyTitle, setStoryTitle] = useState("");
    const [storyTitleError, setStoryTitleError] = useState(false);
    const [storyContent, setStoryContent] = useState("");
    const [storyContentError, setStoryContentError] = useState(false);
    const [addStoryNotification, setAddStoryNotification] = useState(false);

    const [selectedLocation, setSelectedLocation] = useState();
    const [locationError, setLocationError] = useState(false);

    const { isLoading, isFetching, data, refetch, isError, error } = useQuery({
        queryKey: "post-story",
        queryFn: () => {
            return axios.post("/api/written-stories/", {
                userId: profileUser._id,
                userName: profileUser.name,
                authorId: sessionUser._id,
                authorName: sessionUser.name,
                title: storyTitle,
                content: storyContent,
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
            console.log("edited", d.data.data);
            setStoryTitle("");
            setStoryContent("");
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
        queryKey: "fetch-locations1_1",
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

    const handleAddStory = () => {
        if (storyTitle === "" || storyContent === "" || !selectedLocation) {
            storyTitle === "" && setStoryTitleError(true);
            storyContent === "" && setStoryContentError(true);
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
                    id="written-stories-1"
                />

                <Textarea
                    label="Tell us your story..."
                    autosize
                    minRows={10}
                    value={storyContent}
                    onChange={(event) =>
                        setStoryContent(event.currentTarget.value)
                    }
                    error={storyContentError && "content can&apos;t be empty"}
                    onFocus={() => {
                        setAddStoryNotification(false);
                        setStoryContentError(false);
                    }}
                    placeholder="write your story..."
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
                    onClick={handleAddStory}
                >
                    Add Story
                </Button>
            </Stack>
        </Paper>
    );
}

export function MiniStoryCard({
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
                <Text lineClamp={3}>{story.content}</Text>
                <Group>
                    <Text c="dimmed">{story.authorName}</Text>
                </Group>
            </Stack>
        </Paper>
    );
}

export function MiniStoryCardSkeleton() {
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

export function MiniAddStoryCard({ setViewMode, viewMode, setDrawerOpened }) {
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
                <IconPencil size={20} color="green" />
                <Title order={5} fw={500} c="blue">
                    Write a Story
                </Title>
            </Group>
        </Paper>
    );
}

export function StoryCard({ story, refetchStories, sessionProfileRelation }) {
    const [title, setTitle] = useState(story?.title);
    const [titleError, setTitleError] = useState(false);
    const [content, setContent] = useState(story?.content);
    const [contentError, setContentError] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editStoryNotification, setEditStoryNotification] = useState(false);
    const [deleteStoryNotification, setDeleteStoryNotification] =
        useState(false);
    const [storyDeleted, setStoryDeleted] = useState(false);

    const [selectedLocation, setSelectedLocation] = useState();
    const [locationError, setLocationError] = useState(false);
    const [showLocationInput, setShowLocationInput] = useState(
        story.location ? false : true
    );

    const { isLoading, isFetching, data, refetch, isError, error } = useQuery({
        queryKey: "edit-story",
        queryFn: () => {
            return axios.put("/api/written-stories/" + story._id, {
                title: title,
                content: content,
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
        queryKey: "delete-story",
        queryFn: () => {
            return axios.delete("/api/written-stories/" + story._id);
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
        queryKey: "fetch-locations2_2",
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
            !content ||
            content === ""
        ) {
            !selectedLocation && setLocationError(true);
            (title === "" || !title) && setTitleError(true);
            (!content || content === "") && setContentError(true);
        } else {
            refetch();
        }
    };

    const handleCancelEdit = () => {
        setTitle(story?.title);
        setContent(story?.content);
        setSelectedLocation(story?.location);
        setDeleteStoryNotification(false);
        setEditMode(false);
        setTitleError(false);
        setContentError(false);
        setLocationError(false);
    };

    const handleDeleteStory = () => {
        refetchDeleteStory();
    };

    /* const handleLocationSelect = (l) => {
        console.log(l);
        setSelectedLocation(l);
    };*/

    useEffect(() => {
        setTitle(story?.title);
        setContent(story?.content);
        setSelectedLocation(story?.location);
        setStoryDeleted(false);
        //setContentAreaValue(story.content);
        //setTitleValue(story.title);
        setEditStoryNotification(false);
        setDeleteStoryNotification(false);
        setEditMode(false);
    }, [story]);

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
        <Paper withBorder p="md" mih="100vh">
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
                            {/*<Autocomplete
                                label="Location"
                                value={locationInputValue}
                                onChange={setLocationInputValue}
                                data={fetchedLocations}
                                onItemSubmit={handleLocationSelect}
                            />*/}
                            {showLocationInput ? (
                                <div>
                                    <LocationAutocomplete
                                        selectedLocation={selectedLocation}
                                        setSelectedLocation={
                                            setSelectedLocation
                                        }
                                        locationError={locationError}
                                        setLocationError={setLocationError}
                                        id="written-stories-2"
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
                                            {story.location.value}
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
                        <Title
                            className="storyTitle"
                            align="center"
                            color="darkgreen"
                        >
                            {story?.title}
                        </Title>
                    )}
                    {!editMode && (
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
                    )}
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
                    <Text>{content}</Text>
                ) : (
                    <Textarea
                        autosize
                        minRows={10}
                        value={content}
                        onChange={(event) =>
                            setContent(event.currentTarget.value)
                        }
                        error={contentError && "please enter content"}
                        onFocus={() => setContentError(false)}
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
