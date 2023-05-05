import { useQuery } from "react-query";
import Map from "../../places_page/Map";
import axios from "axios";
import { useEffect, useState } from "react";
import {
    Loader,
    LoadingOverlay,
    Paper,
    Stack,
    Title,
    Text,
    Modal,
} from "@mantine/core";
import { get_auto_title, get_event_label } from "../../../lib/static_lists";

export default function EventsMap({ treeId }) {
    const [markers, setMarkers] = useState([]);
    const [mapVisible, setMapVisible] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedMarkerId, setSelectedMarkerId] = useState("");

    const {
        isLoading: isLoadingEventsMarkers,
        isFetching: isFetchingEventsMarkers,
        data: dataEventsMarkers,
        refetch: refetchEventsMarkers,
        isError: isErrorEventsMarkers,
        error: errorEventsMarkers,
    } = useQuery({
        queryKey: "get-events-markers",
        queryFn: () => {
            return axios.get(
                `/api/events/events-markers/all-events-of-family-tree/${treeId}`
            );
        },
        enabled: false,
        onSuccess: (d) => {
            console.log("fetched events markers", d.data.data);
            const m = d.data.data.map((event) => {
                return {
                    id: event._id,
                    type: "event",
                    geoloc: [
                        event.location.lat.$numberDecimal,
                        event.location.lon.$numberDecimal,
                    ],
                    popup: (
                        <Stack>
                            <Title order={3}>{event.type}</Title>
                            <Title order={6} color="dimmed" fw={450}>
                                {event.userName}
                            </Title>
                        </Stack>
                    ),
                };
            });
            setMarkers(m);
            setMapVisible(false);
        },
    });

    useEffect(() => {
        setMapVisible(true);
        refetchEventsMarkers();
    }, []);

    if (errorEventsMarkers) {
        return <div>error fetching events</div>;
    }

    return (
        <div style={{ width: "100%", height: "100%", position: "relative" }}>
            <LoadingOverlay visible={mapVisible} overlayBlur={2} />

            <Map
                markers={markers}
                setSelectedMarkerId={setSelectedMarkerId}
                setModalOpen={setModalOpen}
            />

            <Modal
                opened={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                }}
                title=""
                size="lg"
                overflow="inside"
            >
                <ModalEventViewer selectedMarkerId={selectedMarkerId} />
            </Modal>
        </div>
    );
}

function ModalEventViewer({ selectedMarkerId }) {
    const [event, setEvent] = useState(null);
    const { isLoading, isFetching, data, refetch, isError, error } = useQuery({
        queryKey: "get-event",
        queryFn: () => {
            return axios.get(`/api/events/${selectedMarkerId}`);
        },
        onSuccess: (d) => {
            //console.log("fetched event", d.data.data);
            setEvent(d.data.data);
        },
    });

    if (isLoading || isFetching) {
        return <Loader />;
    }

    if (isError) {
        return <p>error fetching event</p>;
    }
    if (event) {
        return (
            <Stack>
                <Paper withBorder p="md">
                    <Stack>
                        <Title
                            className="storyTitle"
                            align="center"
                            color="darkgreen"
                        >
                            {get_event_label(event.type)}
                        </Title>

                        <Title
                            className="autoTitle"
                            align="center"
                            color="gray"
                            order={3}
                        >
                            {get_auto_title(
                                event.type,
                                event.userName,
                                event.location.value,
                                event.eventDate.toString().split("T")[0]
                            )}
                        </Title>
                    </Stack>
                </Paper>
                <Paper withBorder p="md">
                    <Stack>
                        <Text>{event.description}</Text>
                        <Text c="dimmed" fs="italic" td="underline">
                            {event.authorName}
                        </Text>
                    </Stack>
                </Paper>
                <Paper withBorder p="md">
                    <Stack spacing="xs">
                        <Text>
                            This event happened in:{" "}
                            <Text span c="darkgreen" fw={700}>
                                {event.location.value}
                            </Text>
                        </Text>
                        <Text c="dimmed" fs="italic">
                            {event.eventDate.toString().split("T")[0]}
                        </Text>
                    </Stack>
                </Paper>
            </Stack>
        );
    }
}
