import { Loader } from "@mantine/core";
import axios from "axios";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Chrono } from "react-chrono";
import { get_event_theme_img } from "../../../lib/static_lists";

export default function AudioStoriesTimeline({ treeId }) {
    const [page, setPage] = useState(1);
    const [sort, setSort] = useState("desc");
    const [reachedEnd, setReachedEnd] = useState(false);
    const [audioStoriesItems, setAudioStoriesItems] = useState([]);
    const { isLoading, isFetching, data, refetch, isError, error } = useQuery({
        queryKey: "get_family_timeline_audio_stories_items",
        queryFn: () => {
            const url = `/api/audio-stories/audio-stories-of-family-tree/${treeId}?p=${page}&sort=${sort}`;
            return axios.get(url);
        },
        enabled: false,
        onSuccess: (d) => {
            if (d.data.data.audioStories.length > 0) {
                console.log(
                    "fetching more...",
                    d.data.data.audioStories.length
                );
                //setReachedEnd(false);
                let ia = audioStoriesItems;
                d.data.data.audioStories.map((story) => {
                    ia.push({
                        renId: story._id.toString(),
                        audioUrl: story.audioUrl,
                        cardTitle: `${story.userName} - ${story.title}`,
                        cardSubtitle: `by ${story.authorName} - ${story.location.value}`,
                        title: story.updatedAt.toString().split("T")[0],
                        cardDetailedText: story.description,
                        media: {
                            type: "IMAGE",
                            source: {
                                url: get_event_theme_img("story"),
                            },
                        },
                    });
                });
                setAudioStoriesItems(ia);
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

    if (audioStoriesItems.length < 1) {
        return (
            <div
                style={{ width: "100%", height: "100vh", marginBottom: "5rem" }}
            >
                No audio stories to show
            </div>
        );
    }

    return (
        <div style={{ width: "100%", height: "100vh", marginBottom: "5rem" }}>
            <Chrono
                items={audioStoriesItems}
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
            >
                {audioStoriesItems.map((story) => {
                    return (
                        <div key={story.renId}>
                            <audio controls preload="none">
                                <source
                                    src={story.audioUrl}
                                    type="audio/webm"
                                />
                                <source src={story.audioUrl} type="audio/ogg" />
                                Your browser does not support the audio element.
                            </audio>
                        </div>
                    );
                })}
            </Chrono>
            {reachedEnd && <div>you have reached the end</div>}
        </div>
    );
}
