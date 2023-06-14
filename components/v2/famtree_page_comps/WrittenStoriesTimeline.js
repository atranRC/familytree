import { Loader } from "@mantine/core";
import axios from "axios";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Chrono } from "react-chrono";
import { get_event_theme_img } from "../../../lib/static_lists";

export default function WrittenStoriesTimeline({ treeId }) {
    const [page, setPage] = useState(1);
    const [sort, setSort] = useState("desc");
    const [reachedEnd, setReachedEnd] = useState(false);
    const [writtenStoriesItems, setWrittenStoriesItems] = useState([]);
    const { isLoading, isFetching, data, refetch, isError, error } = useQuery({
        queryKey: "get_family_timeline_written_stories_items",
        queryFn: () => {
            const url = `/api/written-stories/written-stories-of-family-tree/${treeId}?p=${page}&sort=${sort}`;
            return axios.get(url);
        },
        enabled: false,
        onSuccess: (d) => {
            if (d.data.data.writtenStories.length > 0) {
                console.log(
                    "fetching more...",
                    d.data.data.writtenStories.length
                );
                //setReachedEnd(false);
                let ia = writtenStoriesItems;
                d.data.data.writtenStories.map((story) => {
                    ia.push({
                        cardTitle: `${story.userName} - ${story.title}`,
                        cardSubtitle: story.location.value,
                        title: story.updatedAt.toString().split("T")[0],
                        cardDetailedText: story.content,
                        media: {
                            type: "IMAGE",
                            source: {
                                url: get_event_theme_img("story"),
                            },
                        },
                    });
                });
                setWrittenStoriesItems(ia);
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
        function refetchFun() {
            refetch();
        }
        refetchFun();
    }, [page, refetch]);

    if (isLoading) {
        return <Loader />;
    }

    if (writtenStoriesItems.length < 1) {
        return (
            <div
                style={{ width: "100%", height: "100vh", marginBottom: "5rem" }}
            >
                No written stories to show
            </div>
        );
    }

    return (
        <div style={{ width: "100%", height: "100vh", marginBottom: "5rem" }}>
            <Chrono
                items={writtenStoriesItems}
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
