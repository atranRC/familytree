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
    Select,
    Avatar,
    Autocomplete,
    Box,
} from "@mantine/core";
import axios from "axios";
import { forwardRef, useEffect, useState } from "react";
import { useQuery } from "react-query";
import {
    IconAlertOctagon,
    IconAnchor,
    IconCalendarEvent,
    IconCheck,
    IconHomeCancel,
    IconLocation,
    IconPencil,
    IconPlant2,
    IconPlus,
    IconShare,
    IconTrash,
    IconX,
} from "@tabler/icons";
import {
    events_list,
    get_auto_title,
    get_event_label,
} from "../../../lib/static_lists";
//import { citiesData } from "../../../pages/demo/auth-demo/cities";
import { DatePicker } from "@mantine/dates";
import LocationAutocomplete from "../../location/LocationAutocomplete";

export function AddEventCard({
    profileUser,
    sessionUser,
    refetchEvents,
    sessionProfileRelation,
}) {
    const get_auto_title2 = (eventType, profileName, location, date) => {
        return get_auto_title(eventType, profileName, location, date);
    };

    const [eventType, setEventType] = useState("");
    const [eventTypeError, setEventTypeError] = useState(false);
    const [eventDescription, setEventDescription] = useState("");
    const [eventDescError, setEventDescError] = useState(false);
    const [addEventNotification, setAddEventNotification] = useState(false);
    const [eventDate, setEventDate] = useState("");
    const [eventDateError, setEventDateError] = useState(false);

    const [selectedLocation, setSelectedLocation] = useState();
    const [locationError, setLocationError] = useState(false);

    const { isLoading, isFetching, data, refetch, isError, error } = useQuery({
        queryKey: "post-event",
        queryFn: () => {
            return axios.post("/api/events/", {
                userId: profileUser._id,
                userName: profileUser.name,
                authorId: sessionUser._id,
                authorName: sessionUser.name,
                type: eventType,
                description: eventDescription,
                location: {
                    value: selectedLocation.value,
                    lon: selectedLocation.lon
                        ? selectedLocation.lon
                        : "39.476826",
                    lat: selectedLocation.lat
                        ? selectedLocation.lat
                        : "13.496664",
                },
                eventDate: eventDate,
                factSource: null,
            });
        },
        enabled: false,
        onSuccess: (d) => {
            console.log("event created", d.data.data);
            setEventType("");
            setEventDescription("");
            setAddEventNotification(true);
            refetchEvents();
        },
    });

    /* const {
        isLoading: isLoadingLocations,
        isFetching: isFetchingLocations,
        data: dataLocations,
        refetch: refetchLocations,
        isError: isErrorLocations,
        error: errorLocations,
    } = useQuery({
        queryKey: "fetch-locations1",
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

    const handleAddEvent = () => {
        if (
            eventType === "" ||
            eventDescription === "" ||
            eventDate === "" ||
            !selectedLocation
        ) {
            eventType === "" && setEventTypeError(true);
            eventDescription === "" && setEventDescError(true);
            eventDate === "" && setEventDateError(true);
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
                    Do you have an event to add about {profileUser.name}?
                </Title>
                <Divider />
                <Select
                    label="What's the occasion?"
                    value={eventType}
                    onChange={setEventType}
                    data={events_list}
                    error={eventTypeError && "event can&apos;t be empty"}
                    onFocus={() => {
                        setAddEventNotification(false);
                        setEventTypeError(false);
                    }}
                />
                <Textarea
                    label="Description"
                    autosize
                    minRows={5}
                    value={eventDescription}
                    onChange={(event) =>
                        setEventDescription(event.currentTarget.value)
                    }
                    error={eventDescError && "description can&apos;t be empty"}
                    onFocus={() => {
                        setAddEventNotification(false);
                        setEventDescError(false);
                    }}
                    placeholder="Tell us about the event..."
                />
                {/*<div>{JSON.stringify(selectedLocation)}</div>
                <Autocomplete
                    label="Locationzz"
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
                    id="events-1"
                />

                <DatePicker
                    placeholder="Pick date of the event"
                    label="Date"
                    icon={<IconCalendarEvent size={19} />}
                    value={eventDate}
                    onChange={setEventDate}
                    error={eventDateError && "date can&apos;t be empty"}
                    onFocus={() => {
                        setAddEventNotification(false);
                        setEventDateError(false);
                    }}
                />
                {addEventNotification && (
                    <Notification
                        icon={<IconCheck size={18} />}
                        color="teal"
                        title="Event Added!"
                        onClose={() => setAddEventNotification(false)}
                    >
                        Event has been added to {profileUser.name}&apos;s wall!
                    </Notification>
                )}
                <Button
                    variant="filled"
                    radius="xl"
                    loading={isLoading || isFetching}
                    onClick={handleAddEvent}
                >
                    Add Event
                </Button>
            </Stack>
        </Paper>
    );
}

export function MiniEventCard({
    event,
    profileName,
    setDrawerOpened,
    selectedEvent,
    setSelectedEvent,
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
                selectedEvent &&
                viewMode !== "add" &&
                event._id.toString() === selectedEvent._id.toString()
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
    /*const get_auto_title2 = (eventType, profileName, location, date) => {
        return get_auto_title(eventType, profileName, location, date);
    };*/
    return (
        <Paper
            className={classes.card}
            withBorder
            p="md"
            onClick={() => {
                setViewMode("view");
                setSelectedEvent(event);
                setDrawerOpened(true);
            }}
        >
            <Stack spacing={2}>
                <Text size="sm" c="dimmed">
                    {get_auto_title(
                        event.type,
                        profileName,
                        event.location.value,
                        event.eventDate.toString().split("T")[0]
                    )}
                </Text>
                <Group>
                    <Text size="sm">{event.authorName}</Text>
                    <Divider orientation="vertical" />
                    <Text size="sm">
                        {event.eventDate.toString().split("T")[0]}
                    </Text>
                </Group>
            </Stack>
        </Paper>
    );
}

export function MiniEventCardSkeleton() {
    return (
        <Paper withBorder p="md">
            <Group grow>
                <Skeleton height={20} circle mb="xl" width={20} />
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
            </Group>
        </Paper>
    );
}

export function MiniAddEventCard({ setViewMode, viewMode, setDrawerOpened }) {
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
                    Add an Event
                </Title>
            </Group>
        </Paper>
    );
}

export function EventCard({
    event,
    refetchEvents,
    profileUser,
    sessionProfileRelation,
}) {
    /*authorName: sessionUser.name,
                type,
                description,
                location,
                eventDate,
                factSource,*/

    const [editMode, setEditMode] = useState(false);
    const [editEventNotification, setEditEventNotification] = useState(false);
    const [deleteEventNotification, setDeleteEventNotification] =
        useState(false);
    const [eventDeleted, setEventDeleted] = useState(false);

    const [eventType, setEventType] = useState(event?.type);
    const [eventTypeError, setEventTypeError] = useState(false);
    const [eventDate, setEventDate] = useState(event?.eventDate);
    const [eventDateError, setEventDateError] = useState(false);
    const [description, setDescription] = useState(event?.description);
    const [descriptionError, setDescriptionError] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState();
    const [locationError, setLocationError] = useState(false);
    const [showLocationInput, setShowLocationInput] = useState(
        event.location ? false : true
    );
    const [showDateInput, setShowDateInput] = useState(
        event?.eventDate ? false : true
    );

    const { isLoading, isFetching, data, refetch, isError, error } = useQuery({
        queryKey: "edit-event",
        queryFn: () => {
            return axios.put("/api/events/" + event._id, {
                type: eventType,
                description: description,
                location: selectedLocation,
                eventDate: eventDate,
            });
        },
        enabled: false,
        onSuccess: (d) => {
            console.log("edited", d.data.data);
            setEditMode(false);
            setEditEventNotification(true);
            refetchEvents();
        },
    });

    const {
        isLoading: isLoadingDeleteEvent,
        isFetching: isFetchingDeleteEvent,
        refetch: refetchDeleteEvent,
    } = useQuery({
        queryKey: "delete-event",
        queryFn: () => {
            return axios.delete("/api/events/" + event._id);
        },
        enabled: false,
        onSuccess: (d) => {
            console.log("deleted", d.data.data);
            setEditMode(false);
            setEventDeleted(true);
            refetchEvents();
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
        queryKey: "fetch-locations2",
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
            eventType === "" ||
            !eventType ||
            !eventDate ||
            eventDate === "" ||
            !description ||
            description === ""
        ) {
            !selectedLocation && setLocationError(true);
            (eventType === "" || !eventType) && setEventTypeError(true);
            (!description || description === "") && setDescriptionError(true);
            (!eventDate || eventDate === "") && setEventDateError(true);
        } else {
            refetch();
        }
    };

    const handleCancelEdit = () => {
        setEventType(event?.type);
        setEventDateError(false);
        setEventDate(event?.eventDate);
        setEventDateError(false);
        setDescription(event?.description);
        setDescriptionError(false);
        setLocationError(false);
        setEventDeleted(false);
        setShowDateInput(false);
        setShowLocationInput(false);
        //setEventDescriptionValue(event.description);
        //setEventTypeValue(event.type);
        //setLocationValue(event.location.value);
        //setEventDateValue(event.eventDate);
        setDeleteEventNotification(false);
        setEditMode(false);
    };

    const handleDeleteEvent = () => {
        refetchDeleteEvent();
    };

    /*const handleLocationSelect = (l) => {
        console.log(l);
        setSelectedLocation(l);
    };*/

    useEffect(() => {
        setEventType(event?.type);
        setEventDateError(false);
        setEventDate(event?.eventDate);
        setEventDateError(false);
        setDescription(event?.description);
        setDescriptionError(false);
        setEventDeleted(false);
        setLocationError(false);
        setShowDateInput(false);
        setShowLocationInput(false);
        setEditEventNotification(false);
        //setEventDescriptionValue(event.description);
        //setEventTypeValue(event.type);
        //setLocationValue(event.location.value);
        //setEventDateValue(event.eventDate);
        setDeleteEventNotification(false);
        setEditMode(false);
    }, [event]);

    /*useEffect(() => {
        function refetchLocationsFun() {
            refetchLocations();
        }
        if (locationInputValue !== "") {
            refetchLocationsFun();
        }
    }, [locationInputValue, refetchLocations]);*/

    if (eventDeleted) {
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
                        alt="event deleted"
                    />
                    <Title order={2} fw={500} color="dimmed">
                        Event Deleted!
                    </Title>
                </Stack>
            </Paper>
        );
    }
    return (
        <>
            <Stack>
                <Paper withBorder p="md">
                    <Stack>
                        {editMode ? (
                            <Select
                                label="What's the occasion?"
                                value={eventType}
                                onChange={setEventType}
                                data={events_list}
                                error={
                                    eventTypeError && "please choose event type"
                                }
                                onFocus={() => setEventTypeError(false)}
                            />
                        ) : (
                            <Stack>
                                <Title
                                    className="storyTitle"
                                    align="center"
                                    color="darkgreen"
                                >
                                    {get_event_label(eventType)}
                                </Title>

                                <Title
                                    className="autoTitle"
                                    align="center"
                                    color="gray"
                                    order={3}
                                >
                                    {get_auto_title(
                                        eventType,
                                        profileUser.name,
                                        event?.location?.value,
                                        eventDate?.toString().split("T")[0]
                                    )}
                                </Title>
                            </Stack>
                        )}

                        {deleteEventNotification && (
                            <Notification
                                icon={<IconAlertOctagon size={18} />}
                                color="red"
                                title="Delete event?"
                                onClose={() =>
                                    setDeleteEventNotification(false)
                                }
                            >
                                <Group>
                                    <Button
                                        size="sm"
                                        color="red"
                                        compact
                                        loading={
                                            isLoadingDeleteEvent ||
                                            isFetchingDeleteEvent
                                        }
                                        onClick={handleDeleteEvent}
                                    >
                                        Delete{" "}
                                    </Button>
                                    <Button
                                        size="sm"
                                        compact
                                        onClick={() => {
                                            setDeleteEventNotification(false);
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
                                                    setDeleteEventNotification(
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
                        {editEventNotification && (
                            <Notification
                                icon={<IconCheck size={18} />}
                                color="teal"
                                title="Story updated!"
                                onClose={() => setEditEventNotification(false)}
                            >
                                Event has been edited!
                            </Notification>
                        )}
                    </Stack>
                </Paper>
                <Paper withBorder p="md">
                    <Stack>
                        {editMode ? (
                            <Textarea
                                autosize
                                minRows={5}
                                value={description}
                                onChange={(event) =>
                                    setDescription(event.currentTarget.value)
                                }
                                error={
                                    descriptionError &&
                                    "please enter description"
                                }
                                onFocus={() => setDescriptionError(false)}
                            />
                        ) : (
                            <Text>{description}</Text>
                        )}
                        <Text c="dimmed" fs="italic" td="underline">
                            {event.authorName}
                        </Text>
                    </Stack>
                </Paper>
                <Paper withBorder p="md">
                    {editMode ? (
                        <Stack>
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
                                        id="events-2"
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
                                                    event?.location
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
                                            {event?.location?.value}
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
                            {/*<DatePicker
                                placeholder="Pick date of the event"
                                label="Date"
                                icon={<IconCalendarEvent size={19} />}
                                value={eventDateValue}
                                onChange={setEventDateValue}
                            />*/}
                            {showDateInput ? (
                                <div>
                                    <DatePicker
                                        placeholder="Pick date of the event"
                                        label="Date"
                                        icon={<IconCalendarEvent size={19} />}
                                        value={eventDate}
                                        onChange={setEventDate}
                                        error={
                                            eventDateError &&
                                            "please enter date"
                                        }
                                        onFocus={() => setEventDateError(false)}
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
                                                setEventDate(event?.eventDate);
                                                setShowDateInput(false);
                                            }}
                                        >
                                            Click here
                                        </Text>{" "}
                                        to keep previous date
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
                                        Date previously set to{" "}
                                        <Text span c="teal.7">
                                            {
                                                event?.eventDate
                                                    ?.toString()
                                                    .split("T")[0]
                                            }
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
                                            onClick={() => {
                                                setEventDate(null);
                                                setShowDateInput(true);
                                            }}
                                        >
                                            Click here
                                        </Text>
                                        <Text span> to edit</Text>
                                    </Text>
                                </Box>
                            )}
                        </Stack>
                    ) : (
                        <Stack spacing="xs">
                            <Text>
                                This event happened in:{" "}
                                <Text span c="darkgreen" fw={700}>
                                    {event?.location?.value}
                                </Text>
                                <Text c="dimmed" fs="italic">
                                    {event?.eventDate?.toString().split("T")[0]}
                                </Text>
                            </Text>
                        </Stack>
                    )}
                </Paper>
            </Stack>
            {/*<Paper withBorder p="md" mih="100vh">
                <Stack justify="center">
                    <Stack spacing={1} justify="center" align="center">
                        {editMode ? (
                            <TextInput
                                value={eventTypeValue}
                                onChange={(event) =>
                                    setEventTypeValue(event.currentTarget.value)
                                }
                                size="xl"
                            />
                        ) : (
                            <Title
                                className="storyTitle"
                                align="center"
                                color="darkgreen"
                            >
                                {eventTypeValue}
                            </Title>
                        )}
                        <Group>
                            <Title order={6} color="dimmed" fw={450}>
                                {story.authorName}
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
                                    <ActionIcon
                                        color="dark"
                                        radius="xl"
                                        variant="default"
                                        onClick={handleSaveEdit}
                                        loading={isLoading || isFetching}
                                    >
                                        <IconCheck size={20} color="green" />
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
                                            setDeleteStoryNotification(false);
                                            setEditMode(false);
                                        }}
                                    >
                                        <IconX size={20} color="blue" />
                                    </ActionIcon>
                                </>
                            ) : (
                                <>
                                    <ActionIcon
                                        color="dark"
                                        radius="xl"
                                        variant="default"
                                        onClick={() => setEditMode(true)}
                                    >
                                        <IconPencil size={20} color="green" />
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
                        <Text>{contentAreaValue}</Text>
                    ) : (
                        <Textarea
                            autosize
                            minRows={10}
                            value={contentAreaValue}
                            onChange={(event) =>
                                setContentAreaValue(event.currentTarget.value)
                            }
                        />
                    )}
                    <Divider
                        label={<IconAnchor color="green" />}
                        labelPosition="center"
                    />
                </Stack>
            </Paper>*/}
        </>
    );
}
