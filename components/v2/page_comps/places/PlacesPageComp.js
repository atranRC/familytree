import { use, useEffect, useState } from "react";
import { useStyles } from "./PlacesPageCompStyles";
import dynamic from "next/dynamic";
import { Box, Divider, LoadingOverlay, Tabs, Title } from "@mantine/core";
import {
    IconBallpen,
    IconCalendar,
    IconMicrophone,
    IconPlant2,
    IconSpeakerphone,
} from "@tabler/icons";
import { useQuery } from "react-query";
import axios from "axios";
import { useRouter } from "next/router";
import { useMediaQuery } from "@mantine/hooks";

const Map = dynamic(() => import("../../../places_page/Map"), {
    ssr: false,
});

const markers2 = [
    {
        id: "643e8724eb9e38526fd0ead7",
        type: "audioStory",
        geoloc: ["8.5410261", "39.2705461"],
        popup: "some celebration",
    },
];

export default function PlacesPageComp() {
    const router = useRouter();
    const { classes } = useStyles();
    const [tab, setTab] = useState("events"); //events, writtenStories, or audioStories
    const [markers, setMarkers] = useState();
    const screenMatches = useMediaQuery("(max-width: 800px)");

    const markersQuery = useQuery({
        queryKey: ["get-places-markers", tab],
        queryFn: () => {
            return axios.get(
                `/api/v2/places/markers/${tab}?profileId=${router.query["id"]}`
            );
        },
        enabled: router.isReady,
        onSuccess: (res) => {
            console.log("fetched events markers", res.data);
            const m = res.data
                .filter((m) => m.location)
                .map((marker) => {
                    return {
                        id: marker._id,
                        type: tab,
                        //geoloc: [marker.location.lat, marker.location.lon],
                        geoloc: [
                            marker?.location?.lat.$numberDecimal ||
                                marker?.location?.lat ||
                                0,
                            marker?.location?.lon.$numberDecimal ||
                                marker?.location?.lon ||
                                0,
                        ],
                        popup: marker?.description || marker?.content,
                    };
                });
            setMarkers(m);
        },
    });

    const handleOpenLink = (marker) => {
        let view = "events";
        if (tab === "writtenStories") {
            view = "written-stories";
        }
        if (tab === "audioStories") {
            view = "audio-stories";
        }
        window.open(
            `/profiles/${router.query["id"]}/${view}?contentId=${marker.id}`,
            "_blank",
            "noopener,noreferrer"
        );
    };

    useEffect(() => window.scrollTo({ top: 500, behavior: "smooth" }), []);
    return (
        <div className={classes.cont}>
            <div className={classes.typeNavSection}>
                <div>
                    <Title
                        fz={screenMatches ? 24 : 50}
                        fw={200}
                        sx={{ fontFamily: "Lora, serif" }}
                        align="right"
                    >
                        Places
                    </Title>
                    <Title
                        fz={screenMatches ? 24 : 50}
                        fw={200}
                        sx={{ fontFamily: "Lora, serif" }}
                        italic
                        align="right"
                    >
                        Atran
                    </Title>
                    <Title
                        fz={screenMatches ? 24 : 50}
                        fw={200}
                        sx={{ fontFamily: "Lora, serif" }}
                        align="right"
                    >
                        has been to:
                    </Title>
                </div>
                <Divider
                    label={<IconPlant2 color="gray" />}
                    labelPosition="center"
                    sx={{
                        "@media (max-width: 800px)": {
                            display: "none",
                        },
                    }}
                />
                <div className={classes.verticalTabs}>
                    <Tabs
                        variant="pills"
                        orientation="vertical"
                        radius="xl"
                        defaultValue="events"
                        color="indigo"
                        value={tab}
                        onTabChange={setTab}
                    >
                        <Tabs.List grow sx={{ width: "100%" }}>
                            <Tabs.Tab value="events" icon={<IconCalendar />}>
                                Events
                            </Tabs.Tab>
                            <Tabs.Tab
                                icon={<IconBallpen />}
                                value="writtenStories"
                            >
                                Written Stories
                            </Tabs.Tab>
                            <Tabs.Tab
                                icon={<IconMicrophone />}
                                value="audioStories"
                                // icon={<IconSettings size={14} />}
                            >
                                Audio Stories
                            </Tabs.Tab>
                        </Tabs.List>
                    </Tabs>
                </div>
            </div>
            <div className={classes.mapSection}>
                <LoadingOverlay
                    visible={markersQuery.isLoading}
                    overlayBlur={1}
                />

                {markers && (
                    <Map
                        markers={markers}
                        withPopup={true}
                        onOpenLink={handleOpenLink}
                        //setSelectedMarkerId={setSelectedMarkerId}
                        //setModalOpen={setModalOpen}
                    />
                )}
                <Box
                    sx={{
                        position: "absolute",
                        top: "0",
                        //width: "100%",
                        height: "100%",
                        marginTop: "60px",
                        border: "1px solid black",
                        filter: "blur(8px)",
                        //-webkit-filter: blur(8px),
                        WebkitFilter: "blur(8px)",
                        "@media (min-width: 800px)": {
                            display: "none",
                        },
                    }}
                >
                    drag
                </Box>
            </div>
        </div>
    );
}
