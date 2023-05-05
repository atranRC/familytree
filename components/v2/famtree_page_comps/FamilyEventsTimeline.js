import { Loader } from "@mantine/core";
import axios from "axios";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Chrono } from "react-chrono";
import { get_auto_title, get_event_theme_img } from "../../../lib/static_lists";

export default function FamilyEventsTimeline({ treeId }) {
    const [page, setPage] = useState(1);
    const [sort, setSort] = useState("desc");
    const [reachedEnd, setReachedEnd] = useState(false);
    const [eventsItems, setEventsItems] = useState([]);
    const { isLoading, isFetching, data, refetch, isError, error } = useQuery({
        queryKey: "get_family_timeline_events_items",
        queryFn: () => {
            const url = `/api/events/events-of-family-tree/${treeId}?p=${page}&sort=${sort}`;
            return axios.get(url);
        },
        enabled: false,
        onSuccess: (d) => {
            if (d.data.data.events.length > 0) {
                console.log("fetching more...", d.data.data.events.length);
                //setReachedEnd(false);
                let ia = eventsItems;
                d.data.data.events.map((event) => {
                    ia.push({
                        cardTitle: get_auto_title(
                            event.type,
                            event.userName,
                            event.location.value,
                            event.eventDate.toString().split("T")[0]
                        ),
                        cardSubtitle: event.location.value,
                        title: event.eventDate.toString().split("T")[0],
                        //date: event.eventDate,
                        cardDetailedText: event.description,
                        media: {
                            type: "IMAGE",
                            source: {
                                url: get_event_theme_img(event.type),
                            },
                        },
                    });
                });
                setEventsItems(ia);
            } else {
                console.log("end");
                //setReachedEnd(true);
            }
        },
    });

    const handleOnScrollEnd = () => {
        setPage(page + 1);
        /*if (!reachedEnd) {
            console.log("reached end");
            setPage(page + 1);
        } else {
            console.log("smt wrong");
        }*/
    };

    useEffect(() => {
        refetch();
    }, [page]);

    if (isLoading) {
        return <Loader />;
    }

    if (eventsItems.length < 1) {
        return (
            <div
                style={{ width: "100%", height: "100vh", marginBottom: "5rem" }}
            >
                No events to show
            </div>
        );
    }
    return (
        <div style={{ width: "100%", height: "100vh", marginBottom: "5rem" }}>
            <Chrono
                items={eventsItems}
                mode="VERTICAL_ALTERNATING"
                allowDynamicUpdate
                onScrollEnd={handleOnScrollEnd}
                enableOutline
                cardHeight={400}
                lineWidth={4}
                theme={{
                    primary: "#296338",

                    secondary: "#dce0dd",

                    cardSubtitleColor: "grey",
                    titleColor: "black",
                }}
                textOverlay
            />
            {reachedEnd && <div>you have reached the end</div>}
        </div>
    );
}
