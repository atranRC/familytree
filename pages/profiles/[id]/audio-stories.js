import {
    Container,
    Drawer,
    MediaQuery,
    Pagination,
    ScrollArea,
    Stack,
    Title,
    createStyles,
} from "@mantine/core";
import AppShellContainer from "../../../components/appShell";
import { ProfileTitleSection } from "../../../components/titleSections";
import SecondaryNavbar from "../../../components/profiles_page/SecondaryNavbar";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import {
    AudioStoryCard,
    MiniAddAudioStoryCard,
    MiniAudioStoryCard,
    MiniAudioStoryCardSkeleton,
} from "../../../components/profiles_page/audio_stories/cards";
import Link from "next/link";
import dynamic from "next/dynamic";

const AddAudioStoryCard = dynamic(
    () => import("../../../components/profiles_page/audio_stories/cards"),
    {
        ssr: false,
    }
);

export default function AudioStoriesPage({ asPath }) {
    const useStyles = createStyles((theme) => ({
        treeLink: {
            textDecoration: "none",
            "&:hover": {
                //border: "1px solid",
                textDecoration: "underline",
                transition: "0.5s",
            },
        },
        cont: {
            //border: "1px solid black",
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
        },
        allStories: {
            //border: "1px solid black",
            width: "35%",
            height: "100vh",
            padding: "5px",
        },
        storyView: {
            //border: "1px solid black",
            width: "65%",
            padding: "5px",
        },
        storyViewDrawer: {
            //border: "1px solid black",
            width: "100%",
            paddingTop: "50px",
        },
    }));
    const { classes } = useStyles();

    const { data: session, status } = useSession();
    const [sessionUser, setSessionUser] = useState(null);
    const [profileUser, setProfileUser] = useState(null);
    const [sessionProfileRelation, setSessionProfileRelation] = useState(null);

    const [page, setPage] = useState(1);
    const [pageCount, setPageCount] = useState(0);
    const [drawerOpened, setDrawerOpened] = useState(false);
    const [selectedStory, setSelectedStory] = useState();
    const [viewMode, setViewMode] = useState("add");

    const {
        isLoading: isLoadingSessionUser,
        isFetching: isFetchingSessionUser,
        data: dataSessionUser,
        refetch: refetchSessionUser,
        isError: isErrorSessionUser,
        error: errorSessionUser,
    } = useQuery({
        queryKey: "get_session_user_audio_stories",
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
        queryKey: "get_profile_user_audio_stories_page",
        queryFn: () => {
            return axios.get("/api/users/" + asPath.split("/").at(-2));
        },
        enabled: false,
        onSuccess: (d) => {
            const pathUserId = asPath.split("/").at(-2);
            setProfileUser(d.data.data);
            //console.log(pathUserId, sessionUser);
            if (sessionUser) {
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

    const { isLoading, isFetching, data, refetch, isError, error } = useQuery({
        queryKey: "fetch_audio_stories",
        queryFn: () => {
            return axios.get(
                "/api/audio-stories/audio-stories-of/" +
                    profileUser._id.toString() +
                    "?p=" +
                    page
            );
        },
        enabled: false,
        onSuccess: (d) => {
            console.log("edited", d.data.data);
        },
    });

    useEffect(() => {
        if (sessionUser) {
            refetchProfileUser();
        }
    }, [sessionUser]);

    useEffect(() => {
        if (profileUser) {
            refetch();
        }
    }, [page, profileUser]);

    if (status === "unauthenticated") {
        return <Link href="/api/auth/signin">Sign in</Link>;
    }
    if (status === "loading" || !sessionProfileRelation) {
        console.log(status);
        return (
            <AppShellContainer>
                <p>loading...</p>
            </AppShellContainer>
        );
    }

    if (typeof window === "undefined") {
        return <div>not window</div>;
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
                activePage={"audio-stories"}
                id={asPath.split("/").at(-2)}
                sessionProfileRelation={sessionProfileRelation}
            />
            <MediaQuery smallerThan="sm" styles={{ padding: "0px" }}>
                <Container pt="md">
                    <div className={classes.cont}>
                        <MediaQuery
                            smallerThan="sm"
                            styles={{
                                paddingRight: "0px",
                                paddingLeft: "0px",
                                width: "100%",
                            }}
                        >
                            <div className={classes.allStories}>
                                <Stack justify="center" align="stretch">
                                    {sessionProfileRelation !== "none" && (
                                        <MiniAddAudioStoryCard
                                            setViewMode={setViewMode}
                                            viewMode={viewMode}
                                            setDrawerOpened={setDrawerOpened}
                                        />
                                    )}
                                    {isLoading || isFetching ? (
                                        <>
                                            <MiniAudioStoryCardSkeleton />
                                            <MiniAudioStoryCardSkeleton />
                                            <MiniAudioStoryCardSkeleton />
                                        </>
                                    ) : (
                                        <Stack>
                                            <ScrollArea
                                                style={{ height: "530px" }}
                                            >
                                                <Stack spacing="xs">
                                                    {data &&
                                                        data.data.data.stories.map(
                                                            (s) => (
                                                                <MiniAudioStoryCard
                                                                    key={s._id.toString()}
                                                                    story={s}
                                                                    setDrawerOpened={
                                                                        setDrawerOpened
                                                                    }
                                                                    selectedStory={
                                                                        selectedStory
                                                                    }
                                                                    setSelectedStory={
                                                                        setSelectedStory
                                                                    }
                                                                    setViewMode={
                                                                        setViewMode
                                                                    }
                                                                    viewMode={
                                                                        viewMode
                                                                    }
                                                                >
                                                                    {s.title}
                                                                </MiniAudioStoryCard>
                                                            )
                                                        )}
                                                </Stack>
                                            </ScrollArea>
                                        </Stack>
                                    )}
                                    {data && (
                                        <Pagination
                                            page={page}
                                            onChange={setPage}
                                            total={
                                                data.data.data.pagination
                                                    .pageCount
                                            }
                                            siblings={1}
                                            initialPage={1}
                                            position="center"
                                        />
                                    )}
                                </Stack>
                            </div>
                        </MediaQuery>

                        <MediaQuery
                            smallerThan="sm"
                            styles={{
                                padding: "0px",
                                width: "100%",
                                display: "none",
                            }}
                        >
                            <div className={classes.storyView}>
                                {viewMode === "add" ? (
                                    <AddAudioStoryCard
                                        profileUser={profileUser}
                                        sessionUser={sessionUser}
                                        refetchStories={refetch}
                                        sessionProfileRelation={
                                            sessionProfileRelation
                                        }
                                    />
                                ) : (
                                    <AudioStoryCard
                                        story={selectedStory}
                                        refetchStories={refetch}
                                        sessionProfileRelation={
                                            sessionProfileRelation
                                        }
                                    />
                                )}
                            </div>
                        </MediaQuery>
                    </div>
                </Container>
            </MediaQuery>
            <MediaQuery largerThan="sm" styles={{ display: "none" }}>
                <Drawer
                    overlayOpacity={0.55}
                    overlayBlur={3}
                    opened={drawerOpened}
                    onClose={() => setDrawerOpened(false)}
                    position="bottom"
                    size="100vh"
                    lockScroll={false}
                >
                    <ScrollArea style={{ height: 550 }}>
                        <div className={classes.storyViewDrawer}>
                            {viewMode === "add" ? (
                                <AddAudioStoryCard
                                    profileUser={profileUser}
                                    sessionUser={sessionUser}
                                    refetchStories={refetch}
                                    sessionProfileRelation={
                                        sessionProfileRelation
                                    }
                                />
                            ) : (
                                <AudioStoryCard
                                    story={selectedStory}
                                    refetchStories={refetch}
                                    sessionProfileRelation={
                                        sessionProfileRelation
                                    }
                                />
                            )}
                        </div>
                    </ScrollArea>
                </Drawer>
            </MediaQuery>
        </AppShellContainer>
    );
    //}
}

AudioStoriesPage.getInitialProps = (ctx) => {
    const { asPath, query, pathname } = ctx;

    return { asPath, query, pathname };
};
