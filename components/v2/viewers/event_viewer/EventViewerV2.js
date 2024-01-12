import {
    ActionIcon,
    Box,
    Button,
    Divider,
    Group,
    Menu,
    Modal,
    Paper,
    Stack,
    Text,
    Title,
} from "@mantine/core";
import { useStyles } from "./EventViewerV2Styles";
import dynamic from "next/dynamic";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { get_auto_title, get_event_label } from "../../../../lib/static_lists";
import {
    IconAnchor,
    IconPencil,
    IconPlant2,
    IconSeeding,
    IconSettings,
    IconTrash,
} from "@tabler/icons";
import { useRouter } from "next/router";
import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "axios";
import moment from "moment";
import EventOrStoryMediaViewer from "../../media_viewers/EventOrStoryMediaViewer";
import { useSession } from "next-auth/react";
import { getEventStoryMapMarker } from "../../../../utils/utils";
import { useContext, useEffect, useState } from "react";
import EventEditor from "../../editors/event_editor.js/EventEditor";
import { EventsQueryContext } from "../../page_comps/events/EventsPageComp";
import { ProfilePageNotificationContext } from "../../../../pages/profiles/[id]/[view]";

const Map = dynamic(() => import("../../../places_page/Map"), {
    ssr: false,
});

const markers = [
    {
        id: "643e8724eb9e38526fd0ead7",
        type: "event",
        geoloc: ["8.5410261", "39.2705461"],
        popup: "some celebration",
    },
    /*  {
        id: "644295fc8f836f969f8531e5",
        type: "event",
        geoloc: ["13.4966644", "39.4768259"],
        popup: "birth",
    },
   
    {
        id: "658137771936afccdbd3446d",
        type: "event",
        geoloc: ["13.4966644", "39.4768259"],
        popup: "Birthday",
    },
    {
        id: "658137bc1936afccdbd34479",
        type: "event",
        geoloc: ["13.4966644", "39.4768259"],
        popup: "Birthday",
    },*/
];

export default function EventViewerV2({ event }) {
    const eventsQueryRefetchContext = useContext(EventsQueryContext);
    const profilePageNotification = useContext(ProfilePageNotificationContext);
    const router = useRouter();
    const { data: session, status } = useSession();
    const { classes } = useStyles();
    const position = [51.505, -0.09];
    const [mode, setMode] = useState("view"); //view or edit
    const queryClient = useQueryClient();
    const [modalOpen, setModalOpen] = useState(false);

    const eventQuery = useQuery({
        queryKey: ["get-event", router.query["contentId"]],
        refetchOnWindowFocus: false,
        enabled: !!router.query["contentId"],
        queryFn: () => {
            return axios.get(`/api/events/${router.query["contentId"]}`);
        },
        onSuccess: (res) => {
            //console.log("single event result", res.data);
        },
    });

    const deleteEventMutation = useMutation({
        mutationFn: (bod) => {
            return axios.delete(`/api/events/${router.query["contentId"]}`);
        },
        onSuccess: (res) => {
            profilePageNotification[0]("Event deleted");
            eventsQueryRefetchContext();
            setModalOpen(false);
            router.push(
                {
                    //...router,
                    query: {
                        ...router.query,
                        contentId: "",
                    },
                },
                undefined,
                { shallow: true }
            );
        },
        onError: () => {
            profilePageNotification[1]("Error deleting event");
        },
    });

    useEffect(() => {
        if (eventQuery.data) {
            setMode("view");
        }
    }, [eventQuery.data]);

    if (!router.query["contentId"])
        return <div>please select an event to view</div>;

    if (eventQuery.isLoading || status === "loading")
        return <div>Loading...</div>;

    if (mode === "edit")
        return (
            <EventEditor
                event={eventQuery?.data?.data}
                onSaveSuccess={() => {
                    eventQuery.refetch();
                    profilePageNotification[0]("Event updated");
                    /*queryClient.invalidateQueries({
                        queryKey: ["get-profile-events"],
                    });*/
                    eventsQueryRefetchContext();
                }}
                onSaveError={() => {
                    profilePageNotification[1]("Error updating event");
                }}
                onReturn={() => setMode("view")}
            />
        );

    return (
        <div className={classes.cont}>
            <Group>
                <Title fz={48} fw={200} sx={{ fontFamily: "Lora, serif" }}>
                    {get_event_label(eventQuery?.data?.data?.type)}
                </Title>
                <Menu shadow="md" width={200}>
                    <Menu.Target>
                        <ActionIcon variant="light" color="gray">
                            <IconSettings />
                        </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                        <Menu.Label>Manage Event</Menu.Label>
                        <Menu.Item
                            icon={<IconPencil />}
                            onClick={() => setMode("edit")}
                        >
                            Edit Event
                        </Menu.Item>
                        <Menu.Item
                            color="red"
                            icon={<IconTrash />}
                            onClick={() => setModalOpen(true)}
                            disabled={deleteEventMutation.isLoading}
                        >
                            Delete Event
                        </Menu.Item>
                    </Menu.Dropdown>
                </Menu>
            </Group>
            <Text
                fz={24}
                fw={200}
                sx={{ fontFamily: "Lora, serif" }}
                align="center"
                c="dimmed"
            >
                {get_auto_title(
                    eventQuery?.data?.data?.type,
                    eventQuery?.data?.data?.userName,
                    eventQuery?.data?.data?.location?.value,
                    eventQuery?.data?.data?.eventDate ? (
                        moment(eventQuery?.data?.data?.eventDate).format(
                            "YYYY-MM-DD"
                        )
                    ) : (
                        <>-</>
                    )
                )}
            </Text>
            <Divider
                label={<IconPlant2 color="gray" />}
                labelPosition="center"
            />
            <div className={classes.descCont}>
                <Text sx={{ fontFamily: "Lora, serif" }}>
                    {eventQuery?.data?.data?.description || "No description"}
                </Text>
                <Text fz="md" color="dimmed" italic>
                    {eventQuery?.data?.data?.authorName}
                </Text>
                <Text fz="sm" color="dimmed" italic>
                    {eventQuery?.data?.data?.createdAt ? (
                        moment(eventQuery?.data?.data?.createdAt).format(
                            "YYYY-MM-DD"
                        )
                    ) : (
                        <>-</>
                    )}
                </Text>
            </div>
            <Divider
                label={<IconAnchor color="gray" />}
                labelPosition="center"
            />
            <div className={classes.locationCont}>
                {/*<div className={classes.map}>
                    <Map
                        markers={getEventStoryMapMarker(eventQuery?.data?.data)}
                        //setSelectedMarkerId={setSelectedMarkerId}
                        //setModalOpen={setModalOpen}
                    />
                </div>
                <div className={classes.locationName}>
                    <Title fz={24} fw={200} sx={{ fontFamily: "Lora, serif" }}>
                        {` 📌 ${eventQuery?.data?.data?.location?.value}`}
                    </Title>
                </div>*/}
            </div>
            <Divider
                label={<IconSeeding color="gray" />}
                labelPosition="center"
                c="indigo"
            />
            <div className={classes.photosCont}>
                <EventOrStoryMediaViewer
                    sessionProfileRelation={""}
                    profileUser={router.query["id"]}
                    sessionUser={session.user.id}
                    eventOrStoryId={eventQuery?.data?.data._id}
                    eventOrStory="event"
                />
            </div>

            <Modal
                opened={modalOpen}
                onClose={() => setModalOpen(false)}
                //padding={modalViewMode === "delete" ? 0 : "sm"}
                radius="1.5rem"
                withCloseButton={false}
                padding={0}
            >
                <Box
                    sx={{
                        backgroundColor: "red",
                        padding: "5px",
                        borderRadius: "1.5rem",
                    }}
                >
                    <Paper radius="1.5em" p="md">
                        <Stack>
                            <Title order={3} align="center">
                                Are you sure you want to delete this event?
                            </Title>
                            <Text align="center">
                                this action can not be undone
                            </Text>
                            <Group grow>
                                <Button
                                    color="red"
                                    radius="1.5em"
                                    onClick={() => deleteEventMutation.mutate()}
                                    loading={deleteEventMutation.isLoading}
                                >
                                    Confirm
                                </Button>
                                <Button
                                    color="gray"
                                    radius="1.5em"
                                    onClick={() => setModalOpen(false)}
                                >
                                    Cancel
                                </Button>
                            </Group>
                        </Stack>
                    </Paper>
                </Box>
            </Modal>
        </div>
    );
}
