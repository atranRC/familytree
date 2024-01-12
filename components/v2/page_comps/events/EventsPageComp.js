import { Pagination, TextInput, Timeline } from "@mantine/core";
import { useStyles } from "./EventsPageCompStyles";
import MiniEventCardV2 from "../../cards/events/MiniEventCardV2";
import { IconGitBranch } from "@tabler/icons";
import { get_event_label } from "../../../../lib/static_lists";
import { useState } from "react";
import EventViewerV2 from "../../viewers/event_viewer/EventViewerV2";
import styles from "./eventsPageComp.module.css";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import axios from "axios";
import { createContext } from "react";

export const EventsQueryContext = createContext();

export default function EventsPageComp() {
    const router = useRouter();
    const [timelineActiveItem, setTimelineActiveItem] = useState(0);
    const [page, setPage] = useState(1);
    const { classes } = useStyles();

    const eventsQuery = useQuery({
        queryKey: ["get-profile-events", page],
        refetchOnWindowFocus: false,
        queryFn: () => {
            return axios.get(
                `/api/events/events-of/${router.query["id"]}?pageSize=10&page=${page}`
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
                    />
                    {eventsQuery.isLoading ? (
                        <div>loading</div>
                    ) : (
                        <Timeline
                            active={timelineActiveItem}
                            bulletSize={24}
                            lineWidth={2}
                        >
                            {eventsQuery.data.data[0]?.data.map(
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
                <div className={classes.viewerCont}>
                    <EventViewerV2 />
                </div>
            </div>
        </EventsQueryContext.Provider>
    );
}
