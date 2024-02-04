import { Drawer, Pagination, Stack, TextInput } from "@mantine/core";
import { useStyles } from "./AudioStoriesPageCompStyles";
import { useContext, useState } from "react";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import axios from "axios";
import { createContext } from "react";
import MiniAudioStoryCardV2 from "../../cards/audio_stories/MiniAudioStoryCardV2";
import AudioStoryViewerV2 from "../../viewers/audio_story_viewer/AudioStoryViewerV2";
import AddNew from "../../cards/AddNew";
import { IconMicrophone } from "@tabler/icons";
import AddAudioStory from "../../forms/add_audio_story/AddAudioStory";
import { ProfileRelationContext } from "../../../../contexts/profilePageContexts";
import { useMediaQuery } from "@mantine/hooks";

export const AudioStoriesQueryContext = createContext();

export default function AudioStoriesPageComp() {
    const profileRelationContext = useContext(ProfileRelationContext);
    const router = useRouter();
    const [page, setPage] = useState(1);
    const { classes } = useStyles();
    const [searchTerm, setSearchTerm] = useState("");
    const [viewMode, setViewMode] = useState("view"); //view or edit or add
    const [drawerOpened, setDrawerOpened] = useState(false);
    const screenMatches = useMediaQuery("(max-width: 800px)");

    const audioStoriesQuery = useQuery({
        queryKey: ["get_profile_audio_stories", page, searchTerm],
        refetchOnWindowFocus: false,
        queryFn: () => {
            return axios.get(
                `/api/audio-stories/audio-stories-of/${router.query["id"]}?searchTerm=${searchTerm}&pageSize=10&page=${page}`
            );
        },
        //enabled: router.isReady,
        onSuccess: (res) => {
            //console.log("story result", res.data);
        },
    });

    const handleStoryClick = (story) => {
        //console.log("story", story);
        setViewMode("view");
        router.push(
            {
                //...router,
                query: {
                    ...router.query,
                    contentId: story._id.toString(),
                },
            },
            undefined,
            { shallow: true }
        );
        setDrawerOpened(true);
    };
    //if (audioStoriesQuery.isLoading) return <div>loading...</div>;
    return (
        <AudioStoriesQueryContext.Provider value={audioStoriesQuery.refetch}>
            <div className={classes.cont}>
                <div className={classes.miniCardsCont}>
                    <TextInput
                        placeholder="search audio story"
                        radius="xl"
                        size="md"
                        onChange={(e) => {
                            setPage(1);
                            setSearchTerm(e.currentTarget.value);
                        }}
                    />
                    {(profileRelationContext.isSelf ||
                        profileRelationContext.isOwner ||
                        profileRelationContext.isRelativeWithPost) && (
                        <AddNew
                            text="Tell a story"
                            icon={<IconMicrophone />}
                            onClick={() => {
                                setViewMode("add");
                                setDrawerOpened(true);
                            }}
                        />
                    )}
                    {audioStoriesQuery.isLoading ? (
                        <div>loading</div>
                    ) : (
                        <Stack>
                            {audioStoriesQuery.data.data[0]?.data.map(
                                (story) => (
                                    <MiniAudioStoryCardV2
                                        key={story._id}
                                        story={story}
                                        onClick={handleStoryClick}
                                    />
                                )
                            )}
                        </Stack>
                    )}
                    {/*<MiniEventCardV2
                                            event={event}
                                            index={index}
                                            onClick={handleEventClick}
                                       />*/}
                    {!audioStoriesQuery.isLoading && (
                        <Pagination
                            page={page}
                            onChange={setPage}
                            total={
                                parseInt(
                                    audioStoriesQuery.data?.data[0]?.count / 10
                                ) + 1
                            }
                            radius="md"
                            withEdges
                        />
                    )}
                </div>
                {(viewMode === "edit" || viewMode === "view") && (
                    <div className={classes.viewerCont}>
                        <AudioStoryViewerV2
                            mode={viewMode}
                            onViewModeChange={(mode) => setViewMode(mode)}
                        />
                    </div>
                )}

                {viewMode === "add" && (
                    <div className={classes.viewerCont}>
                        <AddAudioStory
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
                            <AudioStoryViewerV2
                                mode={viewMode}
                                onViewModeChange={(mode) => setViewMode(mode)}
                            />
                        )}
                        {viewMode === "add" && (
                            <AddAudioStory
                                onViewModeChange={(mode) => setViewMode(mode)}
                            />
                        )}
                    </div>
                </Drawer>
            </div>
        </AudioStoriesQueryContext.Provider>
    );
}
