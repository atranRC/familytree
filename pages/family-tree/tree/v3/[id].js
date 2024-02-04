import { Container, Drawer, Modal, createStyles } from "@mantine/core";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { ProfileNavBar } from "../../../../components/v2/nav/profile_navbar/ProfileNavBar";
import TreeMenu from "../../../../components/v2/nav/tree_menu/TreeMenu";
import dynamic from "next/dynamic";
import { useState } from "react";
import TagUserMenu from "../../../../components/v2/forms/tag_user/TagUserMenu";
import {
    DeleteTree,
    EditTree,
} from "../../../../components/tree-page/modals/treePageModals";
import AddCollabs from "../../../../components/v2/famtree_page_comps/AddCollabs";
import { useMediaQuery } from "@mantine/hooks";
//import BalkanTree from "../../../../components/tree-page/balkan_tree/BalkanTree";

const BalkanTree = dynamic(
    () => import("../../../../components/tree-page/balkan_tree/BalkanTree"),
    {
        ssr: false,
    }
);

const FamilyEventsTimeline = dynamic(
    () =>
        import(
            "../../../../components/v2/famtree_page_comps/FamilyEventsTimeline"
        ),
    {
        ssr: false,
    }
);

const WrittenStoriesTimeline = dynamic(
    () =>
        import(
            "../../../../components/v2/famtree_page_comps/WrittenStoriesTimeline"
        ),
    {
        ssr: false,
    }
);

const EventsMap = dynamic(
    () => import("../../../../components/v2/famtree_page_comps/EventsMap"),
    {
        ssr: false,
    }
);

const AudioStoriesTimeline = dynamic(
    () =>
        import(
            "../../../../components/v2/famtree_page_comps/AudioStoriesTimeline"
        ),
    {
        ssr: false,
    }
);

const StoriesMap = dynamic(
    () => import("../../../../components/v2/famtree_page_comps/StoriesMap"),
    {
        ssr: false,
    }
);

const useStyles = createStyles((theme) => ({
    root: {
        display: "flex",
        flexDirection: "column",
        maxHeight: "100vh",
    },
    cont: {
        border: "1px solid #E8E8E8",
        position: "relative",
        height: "100vh",
        //backgroundColor: "#F9F9F9",
        backgroundColor: "#F8F9FA",
        //overflow: "auto",
    },
    treeCont: {
        //border: "1px solid red",
        paddingBottom: "2em",
        textAlign: "right",
        //padding: "1em",
        position: "absolute",
        top: "0",
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
    },

    treeMenuCont: {
        border: "1px solid skyblue",
        position: "absolute",

        top: "0",
        //width: "260px",
        /*"@media (max-width: 800px)": {
            width: "40%",
        },*/
        textAlign: "left",
        padding: "1em",
        marginLeft: "2em",
        marginTop: "5em",
        backgroundColor: "rgba(245, 246, 247, 0.8)",
        borderRadius: "10px",
        overflow: "auto",
        maxHeight: "70%",
    },
    timelineCont: {
        width: "1000px",
        maxHeight: "100%",
        overflowY: "auto",
        "@media (max-width: 800px)": {
            width: "100%",
        },
    },
}));

export default function FamilyTreeV2() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const screenMatches = useMediaQuery("(max-width: 800px)");

    const [sessionTreeRelation, setSessionTreeRelation] = useState(null);
    const [balkanMemberId, setBalkanMemberId] = useState(null);
    const [viewMode, setViewMode] = useState("tree");
    const [manageMode, setManageMode] = useState();
    const [manageModalOpened, setManageModalOpened] = useState(false);
    const [drawerOpened, setDrawerOpened] = useState(false);
    const { classes } = useStyles();

    const sessionTreeRelationQuery = useQuery({
        queryKey: ["get-session-tree-relation", router.query.id],
        refetchOnWindowFocus: false,
        enabled: router.isReady,
        queryFn: () => {
            return axios.get(
                `/api/v2/user-authorization/get-session-tree-relation?treeId=${router.query.id}`
            );
        },
        onSuccess: (res) => {
            console.log("res", res.data);
            //console.log("result2", res.data[0].data);
            if (res.data.isOwner) {
                setSessionTreeRelation("owner");
            } else if (res.data.isCollab) {
                setSessionTreeRelation("collab");
            } else if (res.data.isMember) {
                setSessionTreeRelation("member");
            } else {
                setSessionTreeRelation("none");
            }
        },
    });
    //owner, collab, member, none
    const treeQuery = useQuery({
        queryKey: ["get-family-tree", router.query.id],
        refetchOnWindowFocus: false,
        enabled: router.isReady,
        queryFn: () => {
            return axios.get(`/api/family-tree-api/${router.query.id}`);
        },
        onSuccess: (res) => {
            //console.log("result2", res.data[0].data);
        },
    });
    if (
        !router.isReady ||
        treeQuery.isLoading ||
        sessionTreeRelationQuery.isLoading ||
        !sessionTreeRelation
    ) {
        return <div>Loading...</div>;
    }
    return (
        <div className={classes.root}>
            <ProfileNavBar activeLink="-" />
            {treeQuery.data.data.data.privacy === "private" &&
            sessionTreeRelation === "none" ? (
                <div>tree is private</div>
            ) : (
                <div className={classes.cont}>
                    {viewMode === "tree" && (
                        <div className={classes.treeCont}>
                            <div id="tree_balkan"></div>
                            <BalkanTree
                                treeIdProp={router.query.id}
                                treeNameProp={
                                    treeQuery.data.data.data.tree_name
                                }
                                sessionTreeRelation={sessionTreeRelation}
                                setBalkanMemberId={setBalkanMemberId}
                                setOpened={setDrawerOpened}
                            />
                        </div>
                    )}
                    {viewMode === "events_timeline" && (
                        <div className={classes.treeCont}>
                            <div className={classes.timelineCont}>
                                <FamilyEventsTimeline
                                    treeId={router.query.id}
                                />
                            </div>
                        </div>
                    )}
                    {viewMode === "written_stories_timeline" && (
                        <div className={classes.treeCont}>
                            <div className={classes.timelineCont}>
                                <WrittenStoriesTimeline
                                    treeId={router.query.id}
                                />
                            </div>
                        </div>
                    )}
                    {viewMode === "audio_stories_timeline" && (
                        <div className={classes.treeCont}>
                            <div className={classes.timelineCont}>
                                <AudioStoriesTimeline
                                    treeId={router.query.id}
                                />
                            </div>
                        </div>
                    )}
                    {viewMode === "events_map" && (
                        <div className={classes.treeCont}>
                            <EventsMap treeId={router.query.id} />
                        </div>
                    )}
                    {viewMode === "stories_map" && (
                        <div className={classes.treeCont}>
                            <StoriesMap treeId={router.query.id} />
                        </div>
                    )}
                    <div className={classes.treeMenuCont}>
                        <TreeMenu
                            tree={treeQuery.data.data.data}
                            activeTab={viewMode}
                            onViewModeSelect={(mode) => {
                                if (mode === "tree" && viewMode !== "tree") {
                                    //reload window
                                    window.location.reload();
                                } else {
                                    setViewMode(mode);
                                }
                            }}
                            onManageTreeSelect={(mode) => {
                                setManageMode(mode);
                                setManageModalOpened(true);
                            }}
                            sessionTreeRelation={sessionTreeRelation}
                        />
                    </div>
                </div>
            )}
            <Drawer
                opened={drawerOpened}
                onClose={() => setDrawerOpened(false)}
                title="Tagged User"
                padding="xs"
                size={screenMatches ? "95%" : "80%"}
                position="bottom"
                sx={{
                    overflowY: "scroll",
                }}
                lockScroll
            >
                <Container
                    size="xl"
                    //mt={60}
                    //w="100%"
                    p={0}
                    sx={{ maxHeight: "70vh" }}
                >
                    <TagUserMenu
                        treeId={router.query.id}
                        balkanMemberId={balkanMemberId}
                    />
                </Container>
            </Drawer>
            <Modal
                opened={manageModalOpened}
                onClose={() => setManageModalOpened(false)}
                padding={manageMode === "delete" ? "xs" : "lg"}
                radius="1.5em"
                withCloseButton={!(manageMode === "delete")}
            >
                {manageMode === "edit" && <EditTree treeId={router.query.id} />}
                {manageMode === "collabs" && (
                    <AddCollabs tree={treeQuery.data.data.data} />
                )}
                {manageMode === "delete" && (
                    <DeleteTree
                        treeId={router.query.id}
                        setConfirmDeleteOpened={setManageModalOpened}
                        treeName={treeQuery.data.data.data.tree_name}
                    />
                )}
            </Modal>
        </div>
    );
}
