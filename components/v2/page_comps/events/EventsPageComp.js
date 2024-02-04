import {
    Badge,
    Drawer,
    Pagination,
    Paper,
    Spoiler,
    TextInput,
    Timeline,
    Title,
} from "@mantine/core";
import { useStyles } from "./EventsPageCompStyles";
import MiniEventCardV2 from "../../cards/events/MiniEventCardV2";
import { IconGitBranch, IconPlus } from "@tabler/icons";
import { events_list, get_event_label } from "../../../../lib/static_lists";
import { useContext, useState } from "react";
import EventViewerV2 from "../../viewers/event_viewer/EventViewerV2";
import styles from "./eventsPageComp.module.css";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import axios from "axios";
import { createContext } from "react";
import AddNew from "../../cards/AddNew";
import AddEventForm from "../../forms/add_event/AddEventForm";
import { ProfileRelationContext } from "../../../../contexts/profilePageContexts";
import { useMediaQuery } from "@mantine/hooks";

export const EventsQueryContext = createContext();

export default function EventsPageComp() {
    const profileRelationContext = useContext(ProfileRelationContext);
    const router = useRouter();
    const [timelineActiveItem, setTimelineActiveItem] = useState(0);
    const [page, setPage] = useState(1);
    const { classes } = useStyles();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedEventTypeFilters, setSelectedEventTypeFilters] = useState(
        []
    );
    const [viewMode, setViewMode] = useState("view"); //view or edit or add
    const [drawerOpened, setDrawerOpened] = useState(false);
    const screenMatches = useMediaQuery("(max-width: 800px)");
    const eventsQuery = useQuery({
        queryKey: [
            "get-profile-events",
            page,
            searchTerm,
            selectedEventTypeFilters,
        ],
        refetchOnWindowFocus: false,
        queryFn: () => {
            return axios.get(
                `/api/events/events-of/${
                    router.query["id"]
                }?searchTerm=${searchTerm}&pageSize=10&page=${page}&eventFilters=${
                    selectedEventTypeFilters.length > 1
                        ? selectedEventTypeFilters.join(",")
                        : selectedEventTypeFilters
                }`
            );
        },
        //enabled: router.isReady,
        onSuccess: (res) => {
            //console.log("events result", res.data);
        },
    });

    const handleEventClick = (index, event) => {
        //console.log("index", index);
        //console.log("event", event);
        setViewMode("view");
        setTimelineActiveItem(index);
        router.push(
            {
                //...router,
                query: {
                    ...router.query,
                    contentId: event._id.toString(),
                },
            },
            undefined,
            { shallow: true }
        );
        setDrawerOpened(true);
    };
    //if (eventsQuery.isLoading) return <div>loading...</div>;
    return (
        <EventsQueryContext.Provider value={eventsQuery.refetch}>
            <div className={classes.cont}>
                <div className={classes.miniCardsCont}>
                    <TextInput
                        placeholder="search event"
                        radius="xl"
                        size="md"
                        onChange={(e) => {
                            setPage(1);
                            setSearchTerm(e.currentTarget.value);
                        }}
                    />

                    <Spoiler
                        maxHeight={50}
                        showLabel="Show more filters"
                        hideLabel="Hide"
                    >
                        <div className={classes.pillsCont}>
                            {events_list.map((event) => (
                                <Badge
                                    key={event.value}
                                    size="sm"
                                    sx={{
                                        "&:hover": {
                                            cursor: "pointer",
                                            backgroundColor: "green",
                                            color: "white",
                                            transition: "all 0.3s ease-in-out",
                                        },
                                    }}
                                    onClick={() => {
                                        if (
                                            selectedEventTypeFilters.includes(
                                                event.value
                                            )
                                        ) {
                                            setSelectedEventTypeFilters(
                                                selectedEventTypeFilters.filter(
                                                    (f) => f !== event.value
                                                )
                                            );
                                        } else {
                                            setSelectedEventTypeFilters([
                                                ...selectedEventTypeFilters,
                                                event.value,
                                            ]);
                                        }
                                    }}
                                    variant={
                                        selectedEventTypeFilters.includes(
                                            event.value
                                        )
                                            ? "filled"
                                            : "light"
                                    }
                                    color={
                                        selectedEventTypeFilters.includes(
                                            event.value
                                        )
                                            ? "green"
                                            : ""
                                    }
                                >
                                    {event.label}
                                </Badge>
                            ))}
                        </div>
                    </Spoiler>
                    {(profileRelationContext.isSelf ||
                        profileRelationContext.isOwner ||
                        profileRelationContext.isRelativeWithPost) && (
                        <AddNew
                            text="Add An Event"
                            onClick={() => {
                                setViewMode("add");
                                setDrawerOpened(true);
                            }}
                        />
                    )}

                    {eventsQuery.isLoading ? (
                        <div>loading</div>
                    ) : (
                        <Timeline
                            active={timelineActiveItem}
                            bulletSize={24}
                            lineWidth={2}
                        >
                            {eventsQuery?.data?.data[0]?.data.map(
                                (event, index) => (
                                    <Timeline.Item
                                        key={index}
                                        bullet={<IconGitBranch size={12} />}
                                        title={get_event_label(event.type)}
                                    >
                                        <MiniEventCardV2
                                            event={event}
                                            index={index}
                                            onClick={handleEventClick}
                                        />
                                    </Timeline.Item>
                                )
                            )}
                        </Timeline>
                    )}
                    {!eventsQuery.isLoading && (
                        <Pagination
                            page={page}
                            onChange={setPage}
                            total={
                                parseInt(
                                    eventsQuery.data?.data[0]?.count / 10
                                ) + 1
                            }
                            radius="md"
                            withEdges
                        />
                    )}
                </div>
                {(viewMode === "edit" || viewMode === "view") && (
                    <div className={classes.viewerCont}>
                        <EventViewerV2
                            mode={viewMode}
                            onViewModeChange={(mode) => setViewMode(mode)}
                        />
                    </div>
                )}
                {viewMode === "add" && (
                    <div className={classes.viewerCont}>
                        <AddEventForm
                            onViewModeChange={(mode) => setViewMode(mode)}
                        />
                    </div>
                )}
                <Drawer
                    position="bottom"
                    size="95%"
                    opened={screenMatches && drawerOpened}
                    onClose={() => {
                        setDrawerOpened(false);
                    }}
                >
                    <div
                        style={{
                            height: "90vh",
                            overflow: "auto",
                            marginBottom: "1em",
                        }}
                    >
                        {(viewMode === "edit" || viewMode === "view") && (
                            <EventViewerV2
                                mode={viewMode}
                                onViewModeChange={(mode) => setViewMode(mode)}
                            />
                        )}
                        {viewMode === "add" && (
                            <AddEventForm
                                onViewModeChange={(mode) => setViewMode(mode)}
                            />
                        )}
                    </div>
                </Drawer>
            </div>
        </EventsQueryContext.Provider>
    );
}
