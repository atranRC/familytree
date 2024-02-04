import { useSession } from "next-auth/react";
import ProfileLoadingScreen from "../../../components/v2/loading_screens/profile_loading/ProfileLoadingScreen";
import AppShellContainer from "../../../components/appShell";
import { useRouter } from "next/router";
import ProfileSecondaryNabar from "../../../components/v2/nav/ProfileSecondaryNavbar";
import {
    ActionIcon,
    Avatar,
    Divider,
    Group,
    Menu,
    Stack,
    Text,
    Title,
} from "@mantine/core";
import ProfileOverview from "../../../components/v2/viewers/profile_overview/ProfileOverview";
import { IconSettings, IconSettings2 } from "@tabler/icons";
import { createStyles } from "@mantine/core";
import dynamic from "next/dynamic";
import { createContext } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useQuery } from "react-query";
import axios from "axios";
import {
    ProfilePageNotificationContext,
    ProfilePageProfileContext,
    ProfileRelationContext,
} from "../../../contexts/profilePageContexts";
import { useMediaQuery } from "@mantine/hooks";

//import PlacesPageComp from "../../../components/v2/page_comps/places/PlacesPageComp";
//import WrittenStoriesPageComp from "../../../components/v2/page_comps/written_stories/WrittenStoriesPageComp";
//import EventsPageComp from "../../../components/v2/page_comps/events/EventsPageComp";
/*const EventsPageComp = dynamic(
    () => import("../../../components/v2/page_comps/events/EventsPageComp"),
    {
        ssr: false,
    }
);*/

const EventsPageComp = dynamic(
    () => import("../../../components/v2/page_comps/events/EventsPageComp"),
    {
        ssr: false,
    }
);

const WrittenStoriesPageComp = dynamic(
    () =>
        import(
            "../../../components/v2/page_comps/written_stories/WrittenStoriesPageComp"
        ),
    {
        ssr: false,
    }
);

const AudioStoriesPageComp = dynamic(
    () =>
        import(
            "../../../components/v2/page_comps/audio_stories/AudioStoriesPageComp"
        ),
    {
        ssr: false,
    }
);

const PlacesPageComp = dynamic(
    () => import("../../../components/v2/page_comps/places/PlacesPageComp"),
    {
        ssr: false,
    }
);

const useStyles = createStyles((theme) => ({
    nameHeader: {},
    status: {
        width: "50%",
        fontSize: "18px",
        color: "gray",
        textAlign: "center",
        "@media (max-width: 800px)": {
            //flexWrap: "wrap",
            fontSize: "14px",
            width: "100%",
        },
    },
}));

export default function ProfileOverviewPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const screenMatches = useMediaQuery("(max-width: 800px)");

    const { classes } = useStyles();

    const notifySuccess = (message) => toast.success(message);
    const notifyError = (message) => toast.error(message);

    const profileQuery = useQuery({
        queryKey: ["get-profile"],
        refetchOnWindowFocus: false,
        enabled: router.isReady && !!session,
        queryFn: () => {
            return axios.get(`/api/users/v2/${router.query["id"]}`);
        },
        onSuccess: (res) => {
            console.log("profile user", res.data.name);
        },
    });

    const relationQuery = useQuery({
        queryKey: ["get-session-profile-relation"],
        refetchOnWindowFocus: false,
        enabled: router.isReady && !!session,
        queryFn: () => {
            return axios.get(
                `/api/v2/user-authorization/get-session-profile-relation/v2?profileId=${router.query["id"]}`
            );
        },
        onSuccess: (res) => {
            console.log("session profile relation", res.data);
        },
    });

    //generate lorem ipsum

    const handleTabClick = (page) => {
        router.push(
            {
                //...router,
                query: {
                    ...router.query,
                    view: page,
                    contentId: "",
                },
            },
            undefined,
            { shallow: true }
        );
    };

    if (status === "unauthenticated")
        router.push("/u/signin?callBackUrl=%2Ffamily-tree%2Fmy-trees-v2");
    if (
        status === "loading" ||
        profileQuery.isLoading ||
        relationQuery.isLoading ||
        !router.isReady
    )
        return <ProfileLoadingScreen />;

    //session not self and owner and relativeWithPost and relative and profile is private: return private profile
    if (
        !relationQuery.data.data.isSelf &&
        !relationQuery.data.data.isOwner &&
        !relationQuery.data.data.isRelativeWithPost &&
        !relationQuery.data.data.isRelative &&
        profileQuery.data.data.isPrivate
    )
        return <div>this profile is private</div>;

    return (
        <ProfilePageNotificationContext.Provider
            value={[notifySuccess, notifyError]}
        >
            <ProfileRelationContext.Provider value={relationQuery?.data?.data}>
                <ProfilePageProfileContext.Provider
                    value={profileQuery?.data?.data}
                >
                    <AppShellContainer activePage="Trees">
                        <Stack>
                            <Stack align="center" mb="md">
                                <Avatar
                                    size={screenMatches ? 120 : 200}
                                    radius={200}
                                    sx={{
                                        boxShadow:
                                            " rgba(0, 0, 0, 0.1) 0px 1px 2px 0px",
                                    }}
                                    src={profileQuery?.data?.data?.image}
                                    color={
                                        profileQuery?.data?.data?.died
                                            ? "gray"
                                            : profileQuery?.data?.data
                                                  ?.owner !== "self"
                                            ? "green"
                                            : "#6f32be"
                                    }
                                />
                                {(relationQuery.data.data.isSelf ||
                                    relationQuery.data.data.isOwner) && (
                                    <Menu shadow="md" width={200}>
                                        <Menu.Target>
                                            <ActionIcon
                                                variant="light"
                                                color="gray"
                                            >
                                                <IconSettings />
                                            </ActionIcon>
                                        </Menu.Target>
                                        <Menu.Dropdown>
                                            <Menu.Item
                                                onClick={() => {
                                                    router.push(
                                                        `/profiles/${router.query["id"]}/settings`
                                                    );
                                                }}
                                            >
                                                Manage Profile
                                            </Menu.Item>
                                        </Menu.Dropdown>
                                    </Menu>
                                )}

                                <Title
                                    weight={800}
                                    fz={screenMatches ? 32 : 50}
                                    align="center"
                                >
                                    {`${profileQuery?.data?.data?.name} ${profileQuery?.data?.data?.fathers_name} ${profileQuery?.data?.data?.last_name}`}
                                </Title>

                                <Text className={classes.status}>
                                    {profileQuery?.data?.data?.shortBio}
                                </Text>
                            </Stack>
                            <ProfileSecondaryNabar
                                activePage="overview"
                                onTabClick={handleTabClick}
                            />

                            {router.query.view === "overview" && (
                                <ProfileOverview />
                            )}
                            {router.query.view === "family-trees" && (
                                <div>family trees</div>
                            )}
                            {router.query.view === "events" && (
                                <EventsPageComp />
                            )}
                            {router.query.view === "written-stories" && (
                                <WrittenStoriesPageComp />
                            )}
                            {router.query.view === "audio-stories" && (
                                <AudioStoriesPageComp />
                            )}
                            {router.query.view === "places" && (
                                <PlacesPageComp />
                            )}
                        </Stack>
                        <Toaster />
                    </AppShellContainer>
                </ProfilePageProfileContext.Provider>
            </ProfileRelationContext.Provider>
        </ProfilePageNotificationContext.Provider>
    );
}
