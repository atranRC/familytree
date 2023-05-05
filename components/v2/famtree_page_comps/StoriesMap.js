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
    Divider,
    Group,
} from "@mantine/core";
import { IconAnchor, IconPlant2 } from "@tabler/icons";

export default function StoriesMap({ treeId }) {
    const [markers, setMarkers] = useState(null);
    const [audioMarkers, setAudioMarkers] = useState(null);
    const [mapVisible, setMapVisible] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedMarkerId, setSelectedMarkerId] = useState("");

    const {
        isLoading: isLoadingAudioStoriesMarkers,
        isFetching: isFetchingAudioStoriesMarkers,
        data: dataAudioStoriesMarkers,
        refetch: refetchAudioStoriesMarkers,
        isError: isErrorAudioStoriesMarkers,
        error: errorAudioStoriesMarkers,
    } = useQuery({
        queryKey: "get-Audio-markers",
        queryFn: () => {
            return axios.get(
                `/api/audio-stories/audio-stories-map-markers/all-audio-stories-of-family-tree/${treeId}`
            );
        },
        enabled: false,
        onSuccess: (d) => {
            console.log("fetched audio stories markers", d.data.data);
            const m = d.data.data.map((story) => {
                return {
                    id: story._id,
                    type: "audioStory",
                    geoloc: [
                        story.location.lat.$numberDecimal,
                        story.location.lon.$numberDecimal,
                    ],
                    popup: (
                        <Stack>
                            <Title order={3}>{story.title}</Title>
                            <Title order={6} color="dimmed" fw={450}>
                                {story.userName}
                            </Title>
                            <audio controls preload="none">
                                <source src={story.audioUrl} type="audio/ogg" />
                                <source
                                    src={story.audioUrl}
                                    type="audio/mpeg"
                                />
                                Your browser does not support the audio element.
                            </audio>
                        </Stack>
                    ),
                };
            });
            setAudioMarkers(m);
            setMapVisible(false);
        },
    });

    const {
        isLoading: isLoadingWrittenStoriesMarkers,
        isFetching: isFetchingWrittenStoriesMarkers,
        data: dataWrittenStoriesMarkers,
        refetch: refetchWrittenStoriesMarkers,
        isError: isErrorWrittenStoriesMarkers,
        error: errorWrittenStoriesMarkers,
    } = useQuery({
        queryKey: "get-WrittenStories-markers",
        queryFn: () => {
            return axios.get(
                `/api/written-stories/written-stories-map-markers/all-written-stories-of-family-tree/${treeId}`
            );
        },
        enabled: false,
        onSuccess: (d) => {
            console.log("fetched WrittenStories markers", d.data.data);
            const m = d.data.data.map((story) => {
                return {
                    id: story._id,
                    type: "writtenStory",
                    geoloc: [
                        story.location.lat.$numberDecimal,
                        story.location.lon.$numberDecimal,
                    ],
                    popup: (
                        <Stack>
                            <Title order={3}>{story.title}</Title>
                            <Title order={6} color="dimmed" fw={450}>
                                {story.userName}
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
        refetchWrittenStoriesMarkers();
    }, []);

    useEffect(() => {
        setMapVisible(true);
        refetchAudioStoriesMarkers();
    }, []);

    if (errorWrittenStoriesMarkers) {
        return <div>error fetching WrittenStories</div>;
    }

    if (!audioMarkers || !markers) {
        return <Loader />;
    }

    return (
        <div style={{ width: "100%", height: "100%", position: "relative" }}>
            <LoadingOverlay visible={mapVisible} overlayBlur={2} />

            <Map
                markers={[...markers, ...audioMarkers]}
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
                <ModalWrittenStoriesViewer
                    selectedMarkerId={selectedMarkerId}
                />
            </Modal>
        </div>
    );
}

function ModalWrittenStoriesViewer({ selectedMarkerId }) {
    const [story, setStory] = useState(null);
    const { isLoading, isFetching, data, refetch, isError, error } = useQuery({
        queryKey: "get-written-story",
        queryFn: () => {
            return axios.get(`/api/written-stories/${selectedMarkerId}`);
        },
        onSuccess: (d) => {
            // console.log("fetched story", d.data.data);
            setStory(d.data.data);
        },
    });

    if (isLoading || isFetching) {
        return <Loader />;
    }

    if (isError) {
        return <p>error fetching story</p>;
    }

    if (story) {
        return (
            <Paper withBorder p="md" mih="100vh">
                <Stack justify="center">
                    <Stack spacing="lg" justify="center" align="center">
                        <Title
                            className="storyTitle"
                            align="center"
                            color="darkgreen"
                        >
                            {story.title}
                        </Title>

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

                        <Divider
                            label={<IconPlant2 color="green" />}
                            labelPosition="center"
                        />
                        <Text>{story.content}</Text>
                        <Divider
                            label={<IconAnchor color="green" />}
                            labelPosition="center"
                        />
                    </Stack>
                </Stack>
            </Paper>
        );
    }
}