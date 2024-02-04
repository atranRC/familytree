import { Drawer, Pagination, Stack, TextInput } from "@mantine/core";
import { useStyles } from "./WrittenStoriesPageCompStyles";
import { useContext, useState } from "react";
import WrittenStoryViewerV2 from "../../viewers/written_story_viewer/WrittenStoryViewerV2";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import axios from "axios";
import { createContext } from "react";
import MiniWrittenStoryCardV2 from "../../cards/written_stories/MiniWrittenStoryCardV2";
import AddNew from "../../cards/AddNew";
import { IconBallpen } from "@tabler/icons";
import AddWrittenStory from "../../forms/add_written_story/AddWrittenStory";
import { ProfileRelationContext } from "../../../../contexts/profilePageContexts";
import { useMediaQuery } from "@mantine/hooks";

export const WrittenStoriesQueryContext = createContext();

export default function WrittenStoriesPageComp() {
    const profileRelationContext = useContext(ProfileRelationContext);
    const router = useRouter();
    const [page, setPage] = useState(1);
    const { classes } = useStyles();
    const [searchTerm, setSearchTerm] = useState("");
    const [viewMode, setViewMode] = useState("view"); //view or edit or add
    const [drawerOpened, setDrawerOpened] = useState(false);
    const screenMatches = useMediaQuery("(max-width: 800px)");

    const writtenStoriesQuery = useQuery({
        queryKey: ["get_profile_written_stories", page, searchTerm],
        refetchOnWindowFocus: false,
        queryFn: () => {
            return axios.get(
                `/api/written-stories/stories-of/${router.query["id"]}?searchTerm=${searchTerm}&pageSize=10&page=${page}`
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
    //if (writtenStoriesQuery.isLoading) return <div>loading...</div>;
    return (
        <WrittenStoriesQueryContext.Provider
            value={writtenStoriesQuery.refetch}
        >
            <div className={classes.cont}>
                <div className={classes.miniCardsCont}>
                    <TextInput
                        placeholder="search written story"
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
                            text="Write a story"
                            icon={<IconBallpen />}
                            onClick={() => {
                                setViewMode("add");
                                setDrawerOpened(true);
                            }}
                        />
                    )}
                    {writtenStoriesQuery.isLoading ? (
                        <div>loading</div>
                    ) : (
                        <Stack>
                            {writtenStoriesQuery.data.data[0]?.data.map(
                                (story) => (
                                    <MiniWrittenStoryCardV2
                                        key={story._id}
                                        story={story}
                                        onClick={handleStoryClick}
                                    />
                                )
                            )}
                        </Stack>
                    )}

                    {!writtenStoriesQuery.isLoading && (
                        <Pagination
                            page={page}
                            onChange={setPage}
                            total={
                                parseInt(
                                    writtenStoriesQuery.data?.data[0]?.count /
                                        10
                                ) + 1
                            }
                            radius="md"
                            withEdges
                        />
                    )}
                </div>
                {(viewMode === "edit" || viewMode === "view") && (
                    <div className={classes.viewerCont}>
                        <WrittenStoryViewerV2
                            mode={viewMode}
                            onViewModeChange={(mode) => setViewMode(mode)}
                        />
                    </div>
                )}
                {viewMode === "add" && (
                    <div className={classes.viewerCont}>
                        <AddWrittenStory
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
                            <WrittenStoryViewerV2
                                mode={viewMode}
                                onViewModeChange={(mode) => setViewMode(mode)}
                            />
                        )}
                        {viewMode === "add" && (
                            <AddWrittenStory
                                onViewModeChange={(mode) => setViewMode(mode)}
                            />
                        )}
                    </div>
                </Drawer>
            </div>
        </WrittenStoriesQueryContext.Provider>
    );
}
