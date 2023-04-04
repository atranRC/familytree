import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useQuery } from "react-query";
import { useEffect, useState } from "react";
import AppShellContainer from "../../../components/appShell";
import { ProfileTitleSection } from "../../../components/titleSections";
import { Box, LoadingOverlay, Radio, Title } from "@mantine/core";
import SecondaryNavbar from "../../../components/profiles_page/SecondaryNavbar";

const Map = dynamic(() => import("../../../components/places_page/Map"), {
    ssr: false,
});

export default function PlacesPage({ asPath }) {
    const { data: session, status } = useSession();
    const [sessionUser, setSessionUser] = useState(null);
    const [sessionProfileRelation, setSessionProfileRelation] = useState(null);
    const [mapVisible, setMapVisible] = useState(false);
    const [markerType, setMarkerType] = useState("events");
    const [markers, setMarkers] = useState([]);

    const {
        isLoading: isLoadingSessionUser,
        isFetching: isFetchingSessionUser,
        data: dataSessionUser,
        refetch: refetchSessionUser,
        isError: isErrorSessionUser,
        error: errorSessionUser,
    } = useQuery({
        queryKey: "get-user",
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
        queryKey: "get-user",
        queryFn: () => {
            return axios.get("/api/users/" + asPath.split("/").at(-2));
        },
        enabled: false,
        onSuccess: (d) => {
            const pathUserId = asPath.split("/").at(-2);
            //console.log(pathUserId, sessionUser);
            if (sessionUser) {
                if (sessionUser._id.toString() === pathUserId) {
                    setSessionProfileRelation("self");
                } else if (d.data.data.owner === sessionUser._id.toString()) {
                    setSessionProfileRelation("owner");
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
        }
    }, [markerType]);

    if (status === "unauthenticated") {
        return <a href="/api/auth/signin">Sign in</a>;
    }
    if (status === "loading" || !sessionProfileRelation) {
        console.log(status);
        return <p>loading...</p>;
    }
    if (
        sessionProfileRelation === "self" ||
        sessionProfileRelation === "owner"
    ) {
        return (
            <AppShellContainer>
                <ProfileTitleSection picUrl={""}>
                    <Title order={2} fw={600}>
                        hello
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
                        label="Select Type"
                        size="lg"
                    >
                        <Radio value="events" label="Events" />
                        <Radio value="writtenstories" label="Written Stories" />
                    </Radio.Group>

                    {markers && (
                        <div style={{ width: "100%", position: "relative" }}>
                            <LoadingOverlay
                                visible={mapVisible}
                                overlayBlur={2}
                            />
                            <Map markers={markers} />
                        </div>
                    )}
                </div>
            </AppShellContainer>
        );
    }
}

PlacesPage.getInitialProps = (ctx) => {
    const { asPath, query, pathname } = ctx;

    return { asPath, query, pathname };
};