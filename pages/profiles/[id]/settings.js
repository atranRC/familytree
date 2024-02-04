import { useSession } from "next-auth/react";
import ProfileLoadingScreen from "../../../components/v2/loading_screens/profile_loading/ProfileLoadingScreen";
import AppShellContainer from "../../../components/appShell";
import { useRouter } from "next/router";
import ProfileSecondaryNabar from "../../../components/v2/nav/ProfileSecondaryNavbar";
import {
    ActionIcon,
    Avatar,
    Container,
    Divider,
    Group,
    Menu,
    Stack,
    Tabs,
    Text,
    Title,
} from "@mantine/core";
import ProfileOverview from "../../../components/v2/viewers/profile_overview/ProfileOverview";
import {
    IconEdit,
    IconSettings,
    IconSettings2,
    IconShare,
    IconShieldLock,
    IconTransferOut,
    IconTrash,
} from "@tabler/icons";
import { createStyles } from "@mantine/core";
import dynamic from "next/dynamic";
import { createContext, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useQuery } from "react-query";
import axios from "axios";
import { ProfileNavBar } from "../../../components/v2/nav/profile_navbar/ProfileNavBar";
import AccountCard from "../../../components/v2/cards/account/AccountCard";
import {
    ProfileSettingsPageNotificationContext,
    ProfileSettingsPageProfileContext,
    ProfileSettingsPageSessionContext,
} from "../../../contexts/profileSettingsPageContext";
import ProfileEditor from "../../../components/v2/editors/profile_editor/ProfileEditor";
import { FooterCentered } from "../../../components/appFooter/appFooter";
import { mockData } from "../../../components/appFooter/mockData";
import ProfilePrivacyAndPermissionPageComp from "../../../components/v2/page_comps/profile_privacy_and_permission/ProfilePrivacyAndPermissionPageComp";
import ClaimRequestsPageComp from "../../../components/v2/page_comps/claim_reqs_page_comp/ClaimRequestsPageComp";
import DeleteUnclaimedProfilePageComp from "../../../components/v2/page_comps/delete_unclaimed_profile/DeleteUnclaimedProfilePageComp";
import DeleteMyProfilePageComp from "../../../components/v2/page_comps/delete_my_profile/DeleteMyProfilePageComp";
import PublicSharedStories from "../../../components/v2/tables/public_shared_stories/PublicSharedStories";
//import PlacesPageComp from "../../../components/v2/page_comps/places/PlacesPageComp";
//import WrittenStoriesPageComp from "../../../components/v2/page_comps/written_stories/WrittenStoriesPageComp";
//import EventsPageComp from "../../../components/v2/page_comps/events/EventsPageComp";
/*const EventsPageComp = dynamic(
    () => import("../../../components/v2/page_comps/events/EventsPageComp"),
    {
        ssr: false,
    }
);*/

const useStyles = createStyles((theme) => ({
    root: {
        display: "flex",
        flexDirection: "column",
        //maxHeight: "100vh",
    },
    cont: {
        //border: "1px solid #E8E8E8",

        display: "flex",
        justifyContent: "center",
        gap: "2em",
        height: "100%",
        //paddingLeft: "1em",
        //paddingRight: "1em",
        //overflow: "auto",
        background: "#FCFCFC",
        width: "100%",
        "@media (max-width: 800px)": {
            flexDirection: "column",
            margin: "0px",
            padding: "0px",
        },
    },
    menuCont: {
        flexBasis: "30%",
        //maxWidth: "30%",
        //minWidth: "30%",
        //border: "1px solid blue",
        position: "sticky",
        top: "0",
        display: "flex",
        height: "100%",
        flexDirection: "column",
        justifyContent: "center",
        height: "100%",
        padding: "3em",
        "@media (max-width: 800px)": {
            //display: "none",
            flexBasis: "100%",
            padding: "0px",
            zIndex: 99,
            top: -90,
        },
    },
    tabsCont: {
        //width: "100%",
        "@media (max-width: 800px)": {
            display: "none",
        },
    },
    contentCont: {
        height: "100%",
        flexBasis: "70%",
        display: "flex",
        //maxWidth: "70%",
        //minWidth: "70%",
        //justifyContent: "center",
        padding: "2em",
        "@media (max-width: 800px)": {
            flexBasis: "100%",
            minWidth: "100%",
            padding: "0px",
            //border: "1px solid red",
        },
    },
}));

export default function ProfileSettingsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const { classes } = useStyles();

    const [activeTab, setActiveTab] = useState("profile");

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
        relationQuery.isLoading
    )
        return <ProfileLoadingScreen />;

    if (!relationQuery.data.data.isSelf && !relationQuery.data.data.isOwner)
        return <div>unauthorised</div>;

    return (
        <ProfileSettingsPageSessionContext.Provider value={session}>
            <ProfileSettingsPageNotificationContext.Provider
                value={{ success: notifySuccess, error: notifyError }}
            >
                <ProfileSettingsPageProfileContext.Provider
                    value={{
                        data: profileQuery?.data?.data,
                        refetch: profileQuery.refetch,
                    }}
                >
                    <div className={classes.root}>
                        <ProfileNavBar activeLink="-" />

                        <Container
                            size="lg"
                            //mt={60}
                            //w="100%"
                            p={0}
                            className={classes.cont}
                        >
                            <div className={classes.menuCont}>
                                <AccountCard
                                    name={`${profileQuery.data.data.name} ${profileQuery.data.data.fathers_name}`}
                                    img={profileQuery.data.data?.image}
                                    email={profileQuery.data.data?.email}
                                    isPrivate={
                                        profileQuery.data.data?.isPrivate
                                    }
                                />
                                <Tabs
                                    variant="pills"
                                    radius="md"
                                    orientation="horizontal"
                                    defaultValue="profile"
                                    value={activeTab}
                                    p={10}
                                    onTabChange={setActiveTab}
                                    sx={{
                                        "@media (min-width: 800px)": {
                                            display: "none",
                                        },
                                        backgroundColor: "white",
                                        border: "1px solid #e5e5e5",
                                        marginTop: "10px",
                                    }}
                                >
                                    <Tabs.List
                                        sx={{
                                            width: "100%",
                                            flexWrap: "noWrap",
                                            overflowX: "auto",
                                        }}
                                    >
                                        <Tabs.Tab
                                            value="profile"
                                            icon={<IconEdit />}
                                        >
                                            Profile
                                        </Tabs.Tab>
                                        <Tabs.Tab
                                            value="privacy"
                                            icon={<IconShieldLock />}
                                        >
                                            Privacy & Permissions
                                        </Tabs.Tab>
                                        <Tabs.Tab
                                            value="stories"
                                            icon={<IconShare stroke={1.5} />}
                                        >
                                            Shared Stories
                                        </Tabs.Tab>
                                        <Tabs.Tab
                                            value="claim"
                                            icon={<IconTransferOut />}
                                        >
                                            Claim Requests
                                        </Tabs.Tab>
                                        <Divider color="red" m="md" />
                                        <Tabs.Tab
                                            color="red"
                                            c="red"
                                            value="delete"
                                            icon={<IconTrash />}
                                        >
                                            Delete
                                        </Tabs.Tab>
                                    </Tabs.List>
                                </Tabs>
                                <div className={classes.tabsCont}>
                                    <Divider m="md" />
                                    <Tabs
                                        variant="pills"
                                        radius="md"
                                        orientation="vertical"
                                        defaultValue="profile"
                                        value={activeTab}
                                        onTabChange={setActiveTab}
                                    >
                                        <Tabs.List sx={{ width: "100%" }}>
                                            <Tabs.Tab
                                                value="profile"
                                                icon={<IconEdit stroke={1.5} />}
                                            >
                                                Profile
                                            </Tabs.Tab>
                                            <Tabs.Tab
                                                value="privacy"
                                                icon={
                                                    <IconShieldLock
                                                        stroke={1.5}
                                                    />
                                                }
                                            >
                                                Privacy & Permissions
                                            </Tabs.Tab>
                                            <Tabs.Tab
                                                value="stories"
                                                icon={
                                                    <IconShare stroke={1.5} />
                                                }
                                            >
                                                Shared Stories
                                            </Tabs.Tab>
                                            <Tabs.Tab
                                                value="claim"
                                                icon={
                                                    <IconTransferOut
                                                        stroke={1.5}
                                                    />
                                                }
                                            >
                                                Claim Requests
                                            </Tabs.Tab>

                                            <Divider color="red" m="md" />
                                            <Tabs.Tab
                                                color="red"
                                                c="red"
                                                value="delete"
                                                icon={
                                                    <IconTrash stroke={1.5} />
                                                }
                                            >
                                                Delete
                                            </Tabs.Tab>
                                        </Tabs.List>
                                    </Tabs>
                                </div>
                            </div>
                            <div className={classes.contentCont}>
                                {activeTab === "profile" && <ProfileEditor />}
                                {activeTab === "privacy" && (
                                    <ProfilePrivacyAndPermissionPageComp />
                                )}
                                {activeTab === "claim" && (
                                    <ClaimRequestsPageComp />
                                )}
                                {activeTab === "stories" && (
                                    <PublicSharedStories
                                        id={router?.query.id}
                                        type="profile"
                                    />
                                )}
                                {activeTab === "delete" &&
                                    session.user.id !== router.query.id && (
                                        <DeleteUnclaimedProfilePageComp />
                                    )}
                                {activeTab === "delete" &&
                                    session.user.id === router.query.id && (
                                        <DeleteMyProfilePageComp />
                                    )}
                            </div>
                        </Container>

                        <Toaster />
                    </div>
                </ProfileSettingsPageProfileContext.Provider>
            </ProfileSettingsPageNotificationContext.Provider>
        </ProfileSettingsPageSessionContext.Provider>
    );
}
{
    /*<Stack>
                        
                        {router.query.view === "overview" && (
                            <ProfileOverview />
                        )}
                        
                    </Stack>*/
}
