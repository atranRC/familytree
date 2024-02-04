import {
    ActionIcon,
    Box,
    Button,
    Divider,
    Group,
    Menu,
    Modal,
    Paper,
    Stack,
    Text,
    Title,
} from "@mantine/core";
import { useStyles } from "./WrittenStoryViewerV2Styles";
import dynamic from "next/dynamic";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import {
    IconAnchor,
    IconPencil,
    IconPlant2,
    IconSeeding,
    IconSettings,
    IconTimelineEvent,
    IconTrash,
} from "@tabler/icons";
import { useRouter } from "next/router";
import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "axios";
import moment from "moment";
import EventOrStoryMediaViewer from "../../media_viewers/EventOrStoryMediaViewer";
import { useSession } from "next-auth/react";
import { getEventStoryMapMarker } from "../../../../utils/utils";
import { useContext, useEffect, useState } from "react";
import WrittenStoryEditor from "../../editors/written_story_editor/WrittenStoryEditor";
import { WrittenStoriesQueryContext } from "../../page_comps/written_stories/WrittenStoriesPageComp";
import {
    ProfilePageNotificationContext,
    ProfileRelationContext,
} from "../../../../contexts/profilePageContexts";
import LinkStoryToTimeline from "../../forms/LinkStoryToTimeline";
/*import {
    ProfilePageNotificationContext,
    ProfilePageProfileContext,
} from "../../../../pages/profiles/[id]/[view]";
*/

const Map = dynamic(() => import("../../../places_page/Map"), {
    ssr: false,
});

const markers = [
    {
        id: "643e8724eb9e38526fd0ead7",
        type: "writtenStory",
        geoloc: ["8.5410261", "39.2705461"],
        popup: "some celebration",
    },
];

export default function WrittenStoryViewerV2({
    mode = "view",
    onViewModeChange = () => {},
}) {
    const writtenStoriesQueryRefetchContext = useContext(
        WrittenStoriesQueryContext
    );
    const profileRelationContext = useContext(ProfileRelationContext);
    const profilePageNotification = useContext(ProfilePageNotificationContext);
    const router = useRouter();
    const { data: session, status } = useSession();
    const { classes } = useStyles();
    const position = [51.505, -0.09];
    //const [mode, setMode] = useState("view"); //view or edit
    const queryClient = useQueryClient();
    const [modalOpen, setModalOpen] = useState(false);
    const [shareToTimelineModalOpen, setShareToTimelineModalOpen] =
        useState(false);

    const storyQuery = useQuery({
        queryKey: ["get-written-story", router.query["contentId"]],
        refetchOnWindowFocus: false,
        enabled: !!router.query["contentId"],
        queryFn: () => {
            return axios.get(
                `/api/written-stories/${router.query["contentId"]}`
            );
        },
        onSuccess: (res) => {
            //console.log("single story result", res.data);
        },
    });

    const deleteStoryMutation = useMutation({
        mutationFn: (bod) => {
            return axios.delete(
                `/api/written-stories/${router.query["contentId"]}`
            );
        },
        onSuccess: (res) => {
            profilePageNotification[0]("Written Story Deleted");

            writtenStoriesQueryRefetchContext();
            setModalOpen(false);
            router.push(
                {
                    //...router,
                    query: {
                        ...router.query,
                        contentId: "",
                    },
                },
                undefined,
                { shallow: true }
            );
        },
        onError: () => {
            profilePageNotification[1]("Error deleting story");
        },
    });

    useEffect(() => {
        if (storyQuery.data) {
            onViewModeChange("view");
        }
    }, [storyQuery.data]);

    if (!router.query["contentId"])
        return <div>please select a story to view</div>;

    if (storyQuery.isLoading || status === "loading")
        return <div>Loading...</div>;

    if (mode === "edit")
        return (
            <WrittenStoryEditor
                story={storyQuery?.data?.data}
                onSaveSuccess={() => {
                    storyQuery.refetch();
                    profilePageNotification[0]("Story updated");
                    /*queryClient.invalidateQueries({
                        queryKey: ["get-profile-written-stories"],
                    });*/

                    writtenStoriesQueryRefetchContext();
                }}
                onSaveError={() => {
                    profilePageNotification[1]("Error updating story");
                }}
                onReturn={() => onViewModeChange("view")}
            />
        );

    if (!storyQuery.data.data) return <div>not found</div>;

    return (
        <div className={classes.cont}>
            <Group>
                <Title fz={48} fw={200} sx={{ fontFamily: "Lora, serif" }}>
                    {storyQuery?.data?.data?.title}
                </Title>
                {(profileRelationContext.isSelf ||
                    profileRelationContext.isOwner ||
                    profileRelationContext.isRelativeWithPost) && (
                    <Menu shadow="md" width={200}>
                        <Menu.Target>
                            <ActionIcon variant="light" color="gray">
                                <IconSettings />
                            </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                            <Menu.Label>Manage Story</Menu.Label>
                            <Menu.Item
                                icon={<IconPencil />}
                                onClick={() => onViewModeChange("edit")}
                            >
                                Edit Story
                            </Menu.Item>
                            <Menu.Item
                                icon={<IconTimelineEvent />}
                                onClick={() =>
                                    setShareToTimelineModalOpen(true)
                                }
                            >
                                Share to Tigray Timeline
                            </Menu.Item>
                            <Menu.Item
                                color="red"
                                icon={<IconTrash />}
                                onClick={() => setModalOpen(true)}
                                disabled={deleteStoryMutation.isLoading}
                            >
                                Delete Story
                            </Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                )}
            </Group>
            <Divider
                label={<IconPlant2 color="gray" />}
                labelPosition="center"
            />
            <div className={classes.descCont}>
                <Text sx={{ fontFamily: "Lora, serif" }}>
                    {storyQuery?.data?.data?.content || "No content"}
                </Text>
                <Text fz="md" color="dimmed" italic>
                    {storyQuery?.data?.data?.authorName}
                </Text>
                <Text fz="sm" color="dimmed" italic>
                    {storyQuery?.data?.data?.createdAt ? (
                        moment(storyQuery?.data?.data?.createdAt).format(
                            "YYYY-MM-DD"
                        )
                    ) : (
                        <>-</>
                    )}
                </Text>
            </div>
            <Divider
                label={<IconAnchor color="gray" />}
                labelPosition="center"
            />
            <div className={classes.locationCont}>
                <div className={classes.map}>
                    <Map
                        markers={getEventStoryMapMarker(storyQuery?.data?.data)}
                        //setSelectedMarkerId={setSelectedMarkerId}
                        //setModalOpen={setModalOpen}
                    />
                </div>
                <div className={classes.locationName}>
                    <Title fz={24} fw={200} sx={{ fontFamily: "Lora, serif" }}>
                        {` 📌 ${storyQuery?.data?.data?.location?.value}`}
                    </Title>
                </div>
            </div>
            <Divider
                label={<IconSeeding color="gray" />}
                labelPosition="center"
                c="indigo"
            />
            <div className={classes.photosCont}>
                <EventOrStoryMediaViewer
                    sessionProfileRelation={profileRelationContext}
                    profileUser={router.query["id"]}
                    sessionUser={session.user.id}
                    eventOrStoryId={storyQuery?.data?.data._id}
                    eventOrStory="writtenStory"
                />
            </div>

            <Modal
                opened={modalOpen}
                onClose={() => setModalOpen(false)}
                //padding={modalViewMode === "delete" ? 0 : "sm"}
                radius="1.5rem"
                withCloseButton={false}
                padding={0}
            >
                <Box
                    sx={{
                        backgroundColor: "red",
                        padding: "5px",
                        borderRadius: "1.5rem",
                    }}
                >
                    <Paper radius="1.5em" p="md">
                        <Stack>
                            <Title order={3} align="center">
                                Are you sure you want to delete this story?
                            </Title>
                            <Text align="center">
                                this action can not be undone
                            </Text>
                            <Group grow>
                                <Button
                                    color="red"
                                    radius="1.5em"
                                    onClick={() => deleteStoryMutation.mutate()}
                                    loading={deleteStoryMutation.isLoading}
                                >
                                    Confirm
                                </Button>
                                <Button
                                    color="gray"
                                    radius="1.5em"
                                    onClick={() => setModalOpen(false)}
                                >
                                    Cancel
                                </Button>
                            </Group>
                        </Stack>
                    </Paper>
                </Box>
            </Modal>
            <Modal
                opened={shareToTimelineModalOpen}
                onClose={() => setShareToTimelineModalOpen(false)}
                //padding={modalViewMode === "delete" ? 0 : "sm"}
                radius="1.5rem"
                withCloseButton={false}
                padding={0}
            >
                <LinkStoryToTimeline
                    story={storyQuery.data?.data}
                    sessionUserId={session.user.id}
                    onCancel={() => setShareToTimelineModalOpen(false)}
                />
            </Modal>
        </div>
    );
}
