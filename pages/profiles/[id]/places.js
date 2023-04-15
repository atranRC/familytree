import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useQuery } from "react-query";
import { useEffect, useState } from "react";
import AppShellContainer from "../../../components/appShell";
import { ProfileTitleSection } from "../../../components/titleSections";
import {
    Loader,
    LoadingOverlay,
    Modal,
    Paper,
    Radio,
    Stack,
    Title,
    Text,
    Group,
    Divider,
} from "@mantine/core";
import SecondaryNavbar from "../../../components/profiles_page/SecondaryNavbar";
import { get_auto_title, get_event_label } from "../../../lib/static_lists";
import { IconAnchor, IconPlant2 } from "@tabler/icons";

const Map = dynamic(() => import("../../../components/places_page/Map"), {
    ssr: false,
});

function ModalEventViewer({ selectedMarkerId, profileUser }) {
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
                                profileUser.name,
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

function ModalWrittenStoriesViewer({ selectedMarkerId, profileUser }) {
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
                    <Stack spacing={1} justify="center" align="center">
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

function ModalContent({ markerType, selectedMarkerId, profileUser }) {
    if (markerType === "events") {
        return (
            <ModalEventViewer
                selectedMarkerId={selectedMarkerId}
                profileUser={profileUser}
            />
        );
    }

    if (markerType === "writtenstories") {
        return (
            <ModalWrittenStoriesViewer
                selectedMarkerId={selectedMarkerId}
                profileUser={profileUser}
            />
        );
    }
}

export default function PlacesPage({ asPath }) {
    const { data: session, status } = useSession();
    const [sessionUser, setSessionUser] = useState(null);
    const [profileUser, setProfileUser] = useState(null);
    const [sessionProfileRelation, setSessionProfileRelation] = useState(null);
    const [mapVisible, setMapVisible] = useState(false);
    const [markers, setMarkers] = useState([]);

    const [markerType, setMarkerType] = useState("events");
    const [selectedMarkerId, setSelectedMarkerId] = useState("");
    const [modalOpen, setModalOpen] = useState(false);

    const {
        isLoading: isLoadingSessionUser,
        isFetching: isFetchingSessionUser,
        data: dataSessionUser,
        refetch: refetchSessionUser,
        isError: isErrorSessionUser,
        error: errorSessionUser,
    } = useQuery({
        queryKey: "get_session_user_places_page",
        queryFn: () => {
            return axios.get("/api/users/users-mongoose/" + session.user.email);
        },
        enabled: session ? true : false,
        onSuccess: (d) => {
            //console.log("fetched session user", d.data.data);
            setSessionUser(d.data.data);
        },
    });

    const {
        isLoading: isLoadingProfileUser,
        isFetching: isFetchingProfileUser,
        data: dataProfileUser,
        refetch: refetchProfileUser,
        isError: isErrorProfileUser,
        error: errorProfileUser,
    } = useQuery({
        queryKey: "get_profile_user_places_page",
        queryFn: () => {
            return axios.get("/api/users/" + asPath.split("/").at(-2));
        },
        enabled: false,
        onSuccess: (d) => {
            const pathUserId = asPath.split("/").at(-2);

            setProfileUser(d.data.data);
            if (sessionUser) {
                console.log("testing", pathUserId, sessionUser._id);
                if (sessionUser._id.toString() === pathUserId) {
                    setSessionProfileRelation("self");
                } else if (d.data.data.owner === sessionUser._id.toString()) {
                    setSessionProfileRelation("owner");
                } else {
                    setSessionProfileRelation("none");
                }
            }
        },
    });

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
            const pathUserId = asPath.split("/").at(-2);
            return axios.get(`/api/events/events-markers/${pathUserId}`);
        },
        enabled: false,
        onSuccess: (d) => {
            console.log("fetched events markers", d.data.data);
            const m = d.data.data.map((event) => {
                return {
                    id: event._id,
                    geoloc: [
                        event.location.lat.$numberDecimal,
                        event.location.lon.$numberDecimal,
                    ],
                    popup: event.description,
                };
            });
            setMarkers(m);
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
        queryKey: "get-writtenstories-markers",
        queryFn: () => {
            const pathUserId = asPath.split("/").at(-2);
            return axios.get(
                `/api/written-stories/written-stories-map-markers/${pathUserId}`
            );
        },
        enabled: false,
        onSuccess: (d) => {
            console.log("fetched written stories markers", d.data.data);
            const m = d.data.data.map((story) => {
                return {
                    id: story._id,
                    geoloc: [
                        story.location.lat.$numberDecimal,
                        story.location.lon.$numberDecimal,
                    ],
                    popup: story.title,
                };
            });
            setMarkers(m);
            setMapVisible(false);
        },
    });

    const {
        isLoading: isLoadingAudioStoriesMarkers,
        isFetching: isFetchingAudioStoriesMarkers,
        data: dataAudioStoriesMarkers,
        refetch: refetchAudioStoriesMarkers,
        isError: isErrorAudioStoriesMarkers,
        error: errorAudioStoriesMarkers,
    } = useQuery({
        queryKey: "get-audiostories-markers",
        queryFn: () => {
            const pathUserId = asPath.split("/").at(-2);
            return axios.get(
                `/api/audio-stories/audio-stories-map-markers/${pathUserId}`
            );
        },
        enabled: false,
        onSuccess: (d) => {
            //console.log("fetched audio stories markers", d.data.data);
            const m = d.data.data.map((story) => {
                return {
                    id: story._id,
                    geoloc: [
                        story.location.lat.$numberDecimal,
                        story.location.lon.$numberDecimal,
                    ],
                    //popup: story.title,
                    popup: (
                        <div>
                            {story.title}{" "}
                            <div>
                                <audio controls>
                                    <source
                                        src={story.audioUrl}
                                        type="audio/ogg"
                                    />
                                    <source
                                        src={story.audioUrl}
                                        type="audio/mpeg"
                                    />
                                    Your browser does not support the audio
                                    element.
                                </audio>
                            </div>
                        </div>
                    ),
                };
            });
            setMarkers(m);
            setMapVisible(false);
        },
    });

    useEffect(() => {
        if (sessionUser) {
            refetchProfileUser();
        }
    }, [sessionUser]);

    useEffect(() => {
        setMapVisible(true);
        if (markerType === "events") {
            refetchEventsMarkers();
        } else if (markerType === "writtenstories") {
            refetchWrittenStoriesMarkers();
        } else if (markerType === "audiostories") {
            refetchAudioStoriesMarkers();
        }
    }, [markerType]);

    if (status === "unauthenticated") {
        return <a href="/api/auth/signin">Sign in</a>;
    }
    if (status === "loading" || !sessionProfileRelation) {
        //console.log(status);
        return (
            <AppShellContainer>
                <p>loading...</p>
            </AppShellContainer>
        );
    }
    /*if (
        sessionProfileRelation === "self" ||
        sessionProfileRelation === "owner"
    ) {*/
    return (
        <AppShellContainer>
            <ProfileTitleSection picUrl={""}>
                <Title order={2} fw={600}>
                    {sessionProfileRelation}
                </Title>
                <Title order={5} fw={500}>
                    Places
                </Title>
            </ProfileTitleSection>
            <SecondaryNavbar
                activePage={"places"}
                id={asPath.split("/").at(-2)}
                sessionProfileRelation={sessionProfileRelation}
            />
            <div>
                <p>
                    Signed in as {session.user.email} {sessionUser.name}
                </p>
                <Radio.Group
                    value={markerType}
                    onChange={setMarkerType}
                    name="type"
                    size="md"
                >
                    <Radio value="events" label="Events" />
                    <Radio value="writtenstories" label="Written Stories" />
                    <Radio value="audiostories" label="Audio Stories" />
                </Radio.Group>

                {markers && (
                    <div style={{ width: "100%", position: "relative" }}>
                        <LoadingOverlay visible={mapVisible} overlayBlur={2} />
                        <Map
                            markers={markers}
                            setSelectedMarkerId={setSelectedMarkerId}
                            setModalOpen={setModalOpen}
                        />
                    </div>
                )}
            </div>
            <Modal
                opened={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                }}
                title=""
                size="lg"
                overflow="inside"
            >
                <ModalContent
                    markerType={markerType}
                    selectedMarkerId={selectedMarkerId}
                    profileUser={dataProfileUser.data.data}
                />
            </Modal>
        </AppShellContainer>
    );
    //}
}

PlacesPage.getInitialProps = (ctx) => {
    const { asPath, query, pathname } = ctx;

    return { asPath, query, pathname };
};
