import {
    Container,
    createStyles,
    Drawer,
    MediaQuery,
    Pagination,
    Paper,
    ScrollArea,
    Stack,
    Timeline,
    Title,
    Text,
} from "@mantine/core";
import { IconGitBranch } from "@tabler/icons";
import axios from "axios";
import { unstable_getServerSession } from "next-auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import AppShellContainer from "../../../components/appShell";
import {
    AddEventCard,
    EventCard,
    MiniAddEventCard,
    MiniEventCard,
    MiniEventCardSkeleton,
} from "../../../components/profiles_page/events/cards";
import SecondaryNavbar from "../../../components/profiles_page/SecondaryNavbar";
import { ProfileTitleSection } from "../../../components/titleSections";
import dbConnect from "../../../lib/dbConnect";
import { get_event_label } from "../../../lib/static_lists";
import TreeMembers from "../../../models/TreeMembers";
import Users from "../../../models/Users";
import { authOptions } from "../../api/auth/[...nextauth]";

export default function EventsPage({
    sessionUserJson,
    profileUserJson,
    sessionProfileRelation,
}) {
    const router = useRouter();
    const id = router.query.id;

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

    const [page, setPage] = useState(1);
    const [pageCount, setPageCount] = useState(0);
    const [drawerOpened, setDrawerOpened] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState();
    const [timelineActiveItem, setTimelineActiveItem] = useState(0);
    const [viewMode, setViewMode] = useState("add");

    const { isLoading, isFetching, data, refetch, isError, error } = useQuery({
        queryKey: "fetch-stories",
        queryFn: () => {
            return axios.get(
                "/api/events/events-of/" +
                    profileUserJson._id.toString() +
                    "?p=" +
                    page
            );
        },
        enabled: false,
        onSuccess: (d) => {
            console.log("events of ", d.data.data);
        },
    });

    useEffect(() => {
        if (data) {
            setPageCount(data.data.data.pagination.pageCount);
        }
    }, [data]);

    useEffect(() => {
        refetch();
    }, [page]);

    useEffect(() => {
        if (data) {
            setTimelineActiveItem(data.data.data.events.indexOf(selectedEvent));
            console.log("tla", selectedEvent);
        }
    }, [selectedEvent]);

    return (
        <AppShellContainer>
            <ProfileTitleSection picUrl={""}>
                <Title order={2} fw={600}>
                    {profileUserJson.name}
                </Title>
                <Title order={5} fw={500}>
                    Events
                </Title>
            </ProfileTitleSection>
            <SecondaryNavbar
                activePage={"events"}
                id={id}
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
                                        <MiniAddEventCard
                                            setViewMode={setViewMode}
                                            viewMode={viewMode}
                                            setDrawerOpened={setDrawerOpened}
                                        />
                                    )}
                                    {isLoading || isFetching ? (
                                        <>
                                            <MiniEventCardSkeleton />
                                            <MiniEventCardSkeleton />
                                            <MiniEventCardSkeleton />
                                        </>
                                    ) : (
                                        <Stack>
                                            <ScrollArea
                                                style={{ height: "530px" }}
                                            >
                                                <Timeline
                                                    active={timelineActiveItem}
                                                    bulletSize={24}
                                                    lineWidth={2}
                                                >
                                                    {data &&
                                                        data.data.data.events.map(
                                                            (e) => (
                                                                <Timeline.Item
                                                                    bullet={
                                                                        <IconGitBranch
                                                                            size={
                                                                                12
                                                                            }
                                                                        />
                                                                    }
                                                                    title={get_event_label(
                                                                        e.type
                                                                    )}
                                                                >
                                                                    <MiniEventCard
                                                                        key={e._id.toString()}
                                                                        event={
                                                                            e
                                                                        }
                                                                        profileName={
                                                                            profileUserJson.name
                                                                        }
                                                                        setDrawerOpened={
                                                                            setDrawerOpened
                                                                        }
                                                                        selectedEvent={
                                                                            selectedEvent
                                                                        }
                                                                        setSelectedEvent={
                                                                            setSelectedEvent
                                                                        }
                                                                        setViewMode={
                                                                            setViewMode
                                                                        }
                                                                        viewMode={
                                                                            viewMode
                                                                        }
                                                                    />
                                                                </Timeline.Item>
                                                            )
                                                        )}
                                                </Timeline>
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
                                    <AddEventCard
                                        profileUser={profileUserJson}
                                        sessionUser={sessionUserJson}
                                        refetchEvents={refetch}
                                        sessionProfileRelation={
                                            sessionProfileRelation
                                        }
                                    />
                                ) : (
                                    <EventCard
                                        event={selectedEvent}
                                        refetchEvents={refetch}
                                        profileUser={profileUserJson}
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
                                <AddEventCard
                                    profileUser={profileUserJson}
                                    sessionUser={sessionUserJson}
                                    refetchEvents={refetch}
                                    sessionProfileRelation={
                                        sessionProfileRelation
                                    }
                                />
                            ) : (
                                <EventCard
                                    event={selectedEvent}
                                    refetchEvents={refetch}
                                    profileUser={profileUserJson}
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
}

export async function getServerSideProps(context) {
    const session = await unstable_getServerSession(
        context.req,
        context.res,
        authOptions
    );

    if (!session) {
        return {
            redirect: {
                destination: "/",
                permanent: false,
            },
        };
    }

    console.log("contexttt", context.query.id);
    await dbConnect();

    //fetch session user and profile user
    const sessionUserPromise = Users.findOne({ email: session.user.email });
    const profileUserPromise = Users.findById(context.query.id);
    const [sessionUser, profileUser] = await Promise.all([
        sessionUserPromise,
        profileUserPromise,
    ]);
    const sessionUserJson = JSON.parse(JSON.stringify(sessionUser));
    const profileUserJson = JSON.parse(JSON.stringify(profileUser));

    let sessionProfileRelation = "none";
    //session mode = 'self', 'owner', or 'relative'
    //if profile not session user's or session user not owner of profile
    if (sessionUser._id.toString() === context.query.id) {
        sessionProfileRelation = "self";
    } else {
        if (profileUser.owner === sessionUser._id.toString()) {
            sessionProfileRelation = "owner";
        } else {
            //check if session user inside allowed common tree of profile

            //fetch profile trees where post = true
            const profileUserTreesPromise = TreeMembers.find({
                id: context.query.id,
                canPost: true,
            });
            //fetch session trees
            const sessionUserTreesPromise = TreeMembers.find({
                id: sessionUser._id.toString(),
            });
            const [profileUserTrees, sessionUserTrees] = await Promise.all([
                profileUserTreesPromise,
                sessionUserTreesPromise,
            ]);

            const profileUserTreesJson = JSON.parse(
                JSON.stringify(profileUserTrees)
            );

            const sessionUserTreesJson = JSON.parse(
                JSON.stringify(sessionUserTrees)
            );
            //check if session in one of profile trees
            const profileUserTreesId = profileUserTreesJson.map(
                (t) => t.treeId
            );
            const sessionUserTreesId = sessionUserTreesJson.map(
                (t) => t.treeId
            );
            const canPost = sessionUserTreesId.some(
                (r) => profileUserTreesId.indexOf(r) >= 0
            );
            if (canPost) {
                sessionProfileRelation = "relative";
            }
        }
    }

    console.log(
        "session profile relation is",
        sessionProfileRelation,
        sessionUserJson._id
    );
    return {
        props: {
            session,
            sessionUserJson,
            profileUserJson,
            sessionProfileRelation,
            //sessionUserCanPost,
            //allReqs2,
            //profileData,
            //allUsersData,
            //ownerData,
            //treesData,
            //treesImInData2,
            //myCollabsTrees2,
        },
    };
}
