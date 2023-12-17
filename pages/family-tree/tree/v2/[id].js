import {
    Button,
    Title,
    Paper,
    Tabs,
    Stack,
    Group,
    createStyles,
    TextInput,
    Modal,
    Loader,
    Avatar,
    Text,
    Stepper,
    Divider,
    ScrollArea,
    Pagination,
    Autocomplete,
    Radio,
    CopyButton,
    Menu,
} from "@mantine/core";
import AppShellContainer from "../../../../components/appShell";
import { TitleSection } from "../../../../components/titleSections";
import {
    IconAbc,
    IconAt,
    IconCalendarEvent,
    IconCaretDown,
    IconClock,
    IconGrowth,
    IconMap2,
    IconMicrophone,
    IconPencil,
    IconPlus,
    IconShare,
    IconTrash,
    IconUserPlus,
} from "@tabler/icons";
import { ModalAddCollaborator } from "../../../../components/add_member_components/addFamilyMember";
import {
    DeleteTree,
    EditTree,
} from "../../../../components/tree-page/modals/treePageModals";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import axios from "axios";
import Link from "next/link";
import { DatePicker } from "@mantine/dates";
import AddCollabs from "../../../../components/v2/famtree_page_comps/AddCollabs";
import LocationAutocomplete from "../../../../components/location/LocationAutocomplete";
import NoDataToShow from "../../../../components/v2/empty_data_comps/NoDataToShow";
import moment from "moment";
import { createContext, useContext } from "react";
import EmailNotFoundWithInvite from "../../../../components/v2/empty_data_comps/email_not_found_w_invite/EmailNotFoundWithInvite";

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

const TreeContext = createContext(null);

export default function FamTreeTwoPage({ asPath, pathname }) {
    //const { asPath, pathname } = useRouter();
    const { data: session, status } = useSession();

    const [sessionUser, setSessionUser] = useState(null);
    const [fetchedFamilyTree, setFetchedFamilyTree] = useState(null);
    const [sessionTreeRelation, setSessionTreeRelation] = useState(null);
    const [balkanMemberId, setBalkanMemberId] = useState(null);
    const [opened, setOpened] = useState(false);
    const [collabModalOpened, setCollabModalOpened] = useState(false);
    const [editModalOpened, setEditModalOpened] = useState(false);
    const [confirmDeleteOpened, setConfirmDeleteOpened] = useState(false);

    const [viewMode, setViewMode] = useState("tree");

    const {
        isLoading: isLoadingUser,
        isFetching: isFetchingUser,
        data: dataUser,
        refetch: refetchUser,
        isError: isErrorUser,
        error: errorUser,
    } = useQuery({
        queryKey: "fetch_session_user_treev2",
        queryFn: () => {
            return axios.get("/api/users/users-mongoose/" + session.user.email);
        },
        enabled: session ? true : false,
        //enabled: false,
        onSuccess: (d) => {
            console.log("owner now fetched", d.data.data);
            setSessionUser(d.data.data);
        },
        onError: () => {
            console.log("onError");
        },
    });

    const {
        isLoading: isLoadingTree,
        isFetching: isFetchingTree,
        data: dataTree,
        refetch: refetchTree,
        isError: isErrorTree,
        error: errorTree,
    } = useQuery({
        queryKey: "fetch_tree_treev2",
        queryFn: () => {
            console.log("this id", asPath);
            return axios.get(
                "/api/family-tree-api/" + asPath.split("/").at(-1)
            );
        },
        //enabled: false,
        onSuccess: (d) => {
            setFetchedFamilyTree(d.data.data);
            //setTreeData2(d.data.data);
            //setTreeId(asPath.split("/").pop());
        },
        onError: () => {
            console.log("iddddds");
        },
    });

    const {
        isLoading: isLoadingIsMember,
        isFetching: isFetchingIsMember,
        data: dataIsMember,
        refetch: refetchIsMember,
        isError: isErrorIsMember,
        error: errorIsMember,
    } = useQuery({
        queryKey: "check_is_member",
        queryFn: () => {
            console.log("this id", asPath);
            return axios.get(
                `/api/family-tree-api/check-is-member//${asPath
                    .split("/")
                    .at(-1)}?userId=${sessionUser._id.toString()}`
            );
        },
        enabled: false,
        onSuccess: (d) => {
            //setFetchedFamilyTree(d.data.data);
            //setTreeData2(d.data.data);
            //setTreeId(asPath.split("/").pop());
            if (d.data.data) {
                setSessionTreeRelation("member");
            } else {
                setSessionTreeRelation("none");
            }
        },
    });

    const {
        isLoading: isLoadingIsCollab,
        isFetching: isFetchingIsCollab,
        data: dataIsCollab,
        refetch: refetchIsCollab,
        isError: isErrorIsCollab,
        error: errorIsCollab,
    } = useQuery({
        queryKey: "check_is_collab",
        queryFn: () => {
            console.log("this id", asPath);
            return axios.get(
                `/api/family-tree-api/check-is-collab//${asPath
                    .split("/")
                    .at(-1)}?userId=${sessionUser._id.toString()}`
            );
        },
        enabled: false,
        onSuccess: (d) => {
            //setFetchedFamilyTree(d.data.data);
            //setTreeData2(d.data.data);
            //setTreeId(asPath.split("/").pop());
            if (d.data.data) {
                setSessionTreeRelation("collab");
            } else {
                refetchIsMember();
            }
        },
    });

    /*useEffect(() => {
        if (session) {
            refetchUser;
        }
    }, [session]);*/

    useEffect(() => {
        function refetchTreeFun() {
            refetchTree();
        }
        refetchTreeFun();
    }, [refetchTree]);

    useEffect(() => {
        function refetchIsCollabFun() {
            refetchIsCollab();
        }
        if (sessionUser && fetchedFamilyTree) {
            //console.log("sessionUser", sessionUser);
            //console.log("fetched tree", fetchedFamilyTree);
            if (fetchedFamilyTree.owner === sessionUser._id.toString()) {
                setSessionTreeRelation("owner");
            } else {
                refetchIsCollabFun();
            }
            //check if collab
            //check if member
        }
    }, [sessionUser, fetchedFamilyTree, refetchIsCollab]);

    if (status === "unauthenticated") {
        return <Link href="/api/auth/signin">Sign in</Link>;
    }
    if (status === "loading" || !sessionTreeRelation || !fetchedFamilyTree) {
        console.log(status, sessionTreeRelation, fetchedFamilyTree);
        return (
            <AppShellContainer>
                <p>loading...</p>
            </AppShellContainer>
        );
    }

    //get session and tree relation
    //if not signed in
    //if tree private
    //if tree is public
    //if session user is owner
    //if session user is collab
    //if session user is member

    return (
        <TreeContext.Provider value={fetchedFamilyTree}>
            <AppShellContainer>
                <TitleSection>
                    <Group spacing="xs">
                        {fetchedFamilyTree && (
                            <Stack spacing={0} align="left" justify="center">
                                <Title order={3} fw={500}>
                                    {fetchedFamilyTree.tree_name}
                                </Title>
                                <Title order={6} color="dimmed" fw={500}>
                                    {fetchedFamilyTree.description}
                                </Title>
                                <Title order={6} color="dimmed" fw={500}>
                                    {sessionTreeRelation}
                                </Title>
                            </Stack>
                        )}
                        <Menu shadow="md" width={200}>
                            <Menu.Target>
                                <Button
                                    compact
                                    rightIcon={<IconCaretDown size={14} />}
                                >
                                    Change View
                                </Button>
                            </Menu.Target>
                            <Menu.Dropdown>
                                <Menu.Label>Trees</Menu.Label>
                                <Menu.Item
                                    icon={<IconGrowth size={18} color="blue" />}
                                    onClick={() => window.location.reload()}
                                >
                                    {fetchedFamilyTree.tree_name}
                                </Menu.Item>
                                <Menu.Label>Family Timelines</Menu.Label>
                                <Menu.Item
                                    icon={
                                        <IconCalendarEvent
                                            size={18}
                                            color="darkgreen"
                                        />
                                    }
                                    onClick={() =>
                                        setViewMode("events_timeline")
                                    }
                                >
                                    Events Timeline
                                </Menu.Item>
                                <Menu.Item
                                    icon={<IconPencil size={18} color="blue" />}
                                    onClick={() =>
                                        setViewMode("written_stories_timeline")
                                    }
                                >
                                    Written Stories Timeline
                                </Menu.Item>
                                <Menu.Item
                                    icon={
                                        <IconMicrophone
                                            size={18}
                                            color="brown"
                                        />
                                    }
                                    onClick={() =>
                                        setViewMode("audio_stories_timeline")
                                    }
                                >
                                    Audio Stories Timeline
                                </Menu.Item>
                                <Menu.Label>Maps</Menu.Label>
                                <Menu.Item
                                    icon={<IconMap2 size={18} color="teal" />}
                                    onClick={() => setViewMode("events_map")}
                                >
                                    Events Map
                                </Menu.Item>
                                <Menu.Item
                                    icon={<IconMap2 size={18} color="purple" />}
                                    onClick={() => setViewMode("stories_map")}
                                >
                                    Stories Map
                                </Menu.Item>
                            </Menu.Dropdown>
                        </Menu>
                        <CopyButton value={asPath}>
                            {({ copied, copy }) => (
                                <Button
                                    color={copied ? "teal" : "blue"}
                                    onClick={copy}
                                    leftIcon={<IconShare size={20} />}
                                    variant="subtle"
                                    compact
                                >
                                    {copied ? "Copied url" : "Share"}
                                </Button>
                            )}
                        </CopyButton>
                        <Button
                            variant="subtle"
                            compact
                            leftIcon={<IconPencil size={20} />}
                            onClick={() => setEditModalOpened(true)}
                            disabled={sessionTreeRelation !== "owner"}
                        >
                            Edit
                        </Button>
                        <Button
                            variant="subtle"
                            compact
                            leftIcon={<IconPlus size={20} />}
                            onClick={() => setCollabModalOpened(true)}
                            disabled={sessionTreeRelation !== "owner"}
                        >
                            Collaborators
                        </Button>
                        <Button
                            variant="subtle"
                            compact
                            color="red"
                            leftIcon={<IconTrash size={20} />}
                            onClick={() => setConfirmDeleteOpened(true)}
                            disabled={sessionTreeRelation !== "owner"}
                        >
                            Delete
                        </Button>
                    </Group>
                </TitleSection>

                {viewMode === "tree" && (
                    <div
                        style={{
                            height: "100vh",
                            border: "1px solid lightblue",
                            background: "white",
                        }}
                    >
                        <div id="tree_balkan"></div>
                        {fetchedFamilyTree.privacy === "private" &&
                        sessionTreeRelation === "none" ? (
                            <div>tree is private</div>
                        ) : (
                            <BalkanTree
                                treeIdProp={asPath.split("/").at(-1)}
                                sessionTreeRelation={sessionTreeRelation}
                                setBalkanMemberId={setBalkanMemberId}
                                setOpened={setOpened}
                            />
                        )}
                    </div>
                )}
                {viewMode === "events_timeline" && (
                    <div>
                        <h1 style={{ color: "grey" }}>
                            Family Events Timeline
                        </h1>
                        <div
                            style={{
                                height: "100%",
                                border: "1px solid lightblue",
                            }}
                        >
                            <FamilyEventsTimeline
                                treeId={asPath.split("/").at(-1)}
                            />
                        </div>
                    </div>
                )}
                {viewMode === "written_stories_timeline" && (
                    <div>
                        <h1 style={{ color: "grey" }}>
                            Written Stories Timeline
                        </h1>
                        <div
                            style={{
                                height: "100%",
                                border: "1px solid lightblue",
                            }}
                        >
                            <WrittenStoriesTimeline
                                treeId={asPath.split("/").at(-1)}
                            />
                        </div>
                    </div>
                )}
                {viewMode === "audio_stories_timeline" && (
                    <div>
                        <h1 style={{ color: "grey" }}>
                            Audio Stories Timeline
                        </h1>
                        <div
                            style={{
                                height: "100%",
                                border: "1px solid lightblue",
                            }}
                        >
                            <AudioStoriesTimeline
                                treeId={asPath.split("/").at(-1)}
                            />
                        </div>
                    </div>
                )}
                {viewMode === "events_map" && (
                    <div>
                        <h1 style={{ color: "grey" }}>Family Events Map</h1>
                        <EventsMap treeId={asPath.split("/").at(-1)} />
                    </div>
                )}
                {viewMode === "stories_map" && (
                    <div>
                        <h1 style={{ color: "grey" }}>Family Stories Map</h1>
                        <StoriesMap treeId={asPath.split("/").at(-1)} />
                    </div>
                )}

                <Modal
                    opened={opened}
                    onClose={() => {
                        setOpened(false);
                        //setActiveStep(0);
                    }}
                    title="Tagged User"
                    size="lg"
                    overflow="inside"
                >
                    <ModalContent
                        treeId={asPath.split("/").at(-1)}
                        balkanMemberId={balkanMemberId}
                        setOpened={setOpened}
                        sessionTreeRelation={sessionTreeRelation}
                    />
                </Modal>

                <Modal
                    opened={collabModalOpened}
                    onClose={() => setCollabModalOpened(false)}
                    title="Manage Collaborators"
                    size="lg"
                    overflow="inside"
                >
                    {/*<AddCollabs treeId={asPath.split("/").at(-1)} />*/}
                    <AddCollabs tree={fetchedFamilyTree} />
                </Modal>
                <Modal
                    opened={editModalOpened}
                    onClose={() => setEditModalOpened(false)}
                    title="Edit tree"
                >
                    <EditTree treeId={asPath.split("/").at(-1)} />
                </Modal>
                <Modal
                    opened={confirmDeleteOpened}
                    onClose={() => setConfirmDeleteOpened(false)}
                    title="Confirm delete?"
                >
                    <DeleteTree
                        treeId={asPath.split("/").at(-1)}
                        setConfirmDeleteOpened={setConfirmDeleteOpened}
                        treeName={fetchedFamilyTree.tree_name}
                    />
                </Modal>
            </AppShellContainer>
        </TreeContext.Provider>
    );
}

function ModalContent({
    treeId,
    balkanMemberId,
    setOpened,
    sessionTreeRelation,
}) {
    const [activeTab, setActiveTab] = useState("view");
    //const [treeMember, setTreeMember] = useState(null)

    const { isLoading, isFetching, data, refetch, isError, error } = useQuery({
        queryKey: "fetch_treemembersb_doc",
        queryFn: () => {
            return axios.get(
                `/api/family-tree-api/tree-members-b/get-by-treeid-balkanid/${treeId}?balkanId=${balkanMemberId}`
            );
        },
        //enabled: false,
        onSuccess: (d) => {
            //console.log(d.data.data);
        },
    });

    if (isLoading) {
        return <Loader />;
    }

    if (error) {
        return <div>error</div>;
    }

    return (
        <Paper style={{ backgroundColor: "#f8f8f8" }} p="md">
            <Tabs value={activeTab} onTabChange={setActiveTab}>
                <Tabs.List>
                    <Tabs.Tab value="view">View Tagged User</Tabs.Tab>
                    {(sessionTreeRelation === "owner" ||
                        sessionTreeRelation === "collab") && (
                        <Tabs.Tab value="add">Tag User</Tabs.Tab>
                    )}
                </Tabs.List>
            </Tabs>
            {activeTab === "view" ? (
                data && data?.data?.data?.taggedUser ? (
                    <ViewTreeMember
                        selectedTreeMemberUserId={data?.data?.data?.taggedUser}
                    />
                ) : (
                    <NoDataToShow message="This member has no tagged user" />
                )
            ) : (
                <AddMemberStepper
                    treeMemberDocumentId={data?.data?.data?._id.toString()}
                    setOpened={setOpened}
                />
            )}
        </Paper>
    );
}

function AddMemberStepper({ treeMemberDocumentId, setOpened }) {
    const [active, setActive] = useState(0);
    const [mode, setMode] = useState("");

    const [radioValue, setRadioValue] = useState("");
    const [radioValueError, setRadioValueError] = useState(false);
    const [memberLifeStatus, setMemberLifeStatus] = useState("");
    const [memberLifeStatusError, setMemberLifeStatusError] = useState(false);
    const [newRelativeEmail, setNewRelativeEmail] = useState("");
    const [newRelativeEmailError, setNewRelativeEmailError] = useState("");
    const [newRelativeFirstName, setNewRelativeFirstName] = useState("");
    const [newRelativeFirstNameError, setNewRelativeFirstNameError] =
        useState("");
    const [newRelativeFatherName, setNewRelativeFatherName] = useState("");
    const [newRelativeMotherName, setNewRelativeMotherName] = useState("");
    const [newRelativeSpouse, setNewRelativeSpouse] = useState("none");
    const [newRelativeSex, setNewRelativeSex] = useState("");
    const [newRelativeNicknames, setNewRelativeNicknames] = useState("");
    const [newRelativeBirthday, setNewRelativeBirthday] = useState("");
    const [newRelativeCurrentResidence, setNewRelativeCurrentResidence] =
        useState({
            value: "",
            lon: 0.0,
            lat: 0.0,
        });
    const [newRelativeBirthplace, setNewRelativeBirthplace] = useState({
        value: "",
        lon: 0.0,
        lat: 0.0,
    });

    const [memberAddMode, setMemberAddMode] = useState("");
    const [selectedSearchResultCard, setSelectedSearchResultCard] = useState(
        {}
    );

    const nextStep = () =>
        setActive((current) => (current < 3 ? current + 1 : current));
    const prevStep = () =>
        setActive((current) => (current > 0 ? current - 1 : current));
    return (
        <>
            <Stepper
                active={active}
                onStepClick={setActive}
                breakpoint="sm"
                size="xs"
                mt="md"
            >
                <Stepper.Step
                    label="First step"
                    description="User Information"
                    allowStepSelect={false}
                >
                    <StepOne
                        treeMemberDocumentId={treeMemberDocumentId}
                        radioValue={radioValue}
                        setRadioValue={setRadioValue}
                        radioValueError={radioValueError}
                        setRadioValueError={setRadioValueError}
                        memberLifeStatus={memberLifeStatus}
                        setMemberLifeStatus={setMemberLifeStatus}
                        memberLifeStatusError={memberLifeStatusError}
                        setMemberLifeStatusError={setMemberLifeStatusError}
                        newRelativeEmail={newRelativeEmail}
                        setNewRelativeEmail={setNewRelativeEmail}
                        newRelativeEmailError={newRelativeEmailError}
                        setNewRelativeEmailError={setNewRelativeEmailError}
                        newRelativeFirstName={newRelativeFirstName}
                        setNewRelativeFirstName={setNewRelativeFirstName}
                        newRelativeFirstNameError={newRelativeFirstNameError}
                        setNewRelativeFirstNameError={
                            setNewRelativeFirstNameError
                        }
                        newRelativeFatherName={newRelativeFatherName}
                        setNewRelativeFatherName={setNewRelativeFatherName}
                        newRelativeNicknames={newRelativeNicknames}
                        setNewRelativeNicknames={setNewRelativeNicknames}
                        newRelativeMotherName={newRelativeMotherName}
                        setNewRelativeMotherName={setNewRelativeMotherName}
                        newRelativeSpouse={newRelativeSpouse}
                        setNewRelativeSpouse={setNewRelativeSpouse}
                        newRelativeSex={newRelativeSex}
                        setNewRelativeSex={setNewRelativeSex}
                        newRelativeBirthday={newRelativeBirthday}
                        setNewRelativeBirthday={setNewRelativeBirthday}
                        newRelativeCurrentResidence={
                            newRelativeCurrentResidence
                        }
                        setNewRelativeCurrentResidence={
                            setNewRelativeCurrentResidence
                        }
                        newRelativeBirthplace={newRelativeBirthplace}
                        setNewRelativeBirthplace={setNewRelativeBirthplace}
                        setActive={setActive}
                        setMode={setMode}
                    />
                </Stepper.Step>
                <Stepper.Step
                    label="Second step"
                    description="Search Results"
                    allowStepSelect={false}
                >
                    <StepTwo
                        treeMemberDocumentId={treeMemberDocumentId}
                        newRelativeFirstName={newRelativeFirstName}
                        email={newRelativeEmail}
                        mode={mode}
                        setMemberAddMode={setMemberAddMode}
                        setActive={setActive}
                        setSelectedSearchResultCard={
                            setSelectedSearchResultCard
                        }
                    />
                </Stepper.Step>
                <Stepper.Step
                    label="Final step"
                    description="Add User"
                    allowStepSelect={false}
                >
                    <StepThree
                        treeMemberDocumentId={treeMemberDocumentId}
                        memberAddMode={memberAddMode}
                        radioValue={radioValue}
                        memberLifeStatus={memberLifeStatus}
                        selectedSearchResultCard={selectedSearchResultCard}
                        newRelativeEmail={newRelativeEmail}
                        newRelativeFirstName={newRelativeFirstName}
                        newRelativeFatherName={newRelativeFatherName}
                        newRelativeNicknames={newRelativeNicknames}
                        newRelativeBirthday={newRelativeBirthday}
                        newRelativeCurrentResidence={
                            newRelativeCurrentResidence
                        }
                        newRelativeBirthplace={newRelativeBirthplace}
                        newRelativeSex={newRelativeSex}
                        setOpened={setOpened}
                    />
                </Stepper.Step>
                <Stepper.Completed>
                    Completed, click back button to get to previous step
                </Stepper.Completed>
            </Stepper>
        </>
    );
}

function StepOne({
    treeMemberDocumentId,
    radioValue,
    memberLifeStatus,
    setMemberLifeStatus,
    memberLifeStatusError,
    setMemberLifeStatusError,
    setRadioValue,
    radioValueError,
    setRadioValueError,
    newRelativeEmail,
    setNewRelativeEmail,
    newRelativeEmailError,
    setNewRelativeEmailError,
    newRelativeFirstName,
    setNewRelativeFirstName,
    newRelativeFirstNameError,
    setNewRelativeFirstNameError,
    newRelativeFatherName,
    setNewRelativeFatherName,
    newRelativeNicknames,
    setNewRelativeNicknames,
    newRelativeMotherName,
    setNewRelativeMotherName,
    newRelativeSpouse,
    setNewRelativeSpouse,
    newRelativeSex,
    setNewRelativeSex,
    newRelativeBirthday,
    setNewRelativeBirthday,
    newRelativeCurrentResidence,
    setNewRelativeCurrentResidence,
    newRelativeBirthplace,
    setNewRelativeBirthplace,
    setActive,
    setMode,
}) {
    /*const [locationInputValue, setLocationInputValue] = useState("");
    const [fetchedLocations, setFetchedLocations] = useState([]);
    const [locationInputValue2, setLocationInputValue2] = useState("");
    const [fetchedLocations2, setFetchedLocations2] = useState([]);*/

    const [locationError, setLocationError] = useState(false);
    const [locationError2, setLocationError2] = useState(false);

    const [memberSexError, setMemberSexError] = useState(false);

    /*const [selectedLocation, setSelectedLocation] = useState();
    const [locationError, setLocationError] = useState(false);

    const [selectedLocation2, setSelectedLocation2] = useState();
    const [locationError2, setLocationError2] = useState(false);*/

    /*const {
        isLoading: isLoadingLocations,
        isFetching: isFetchingLocations,
        data: dataLocations,
        refetch: refetchLocations,
        isError: isErrorLocations,
        error: errorLocations,
    } = useQuery({
        queryKey: "fetch_locations_add_relative",
        queryFn: () => {
            return axios.get(
                `https://nominatim.openstreetmap.org/search?q=${locationInputValue}&format=json`
            );
        },
        enabled: false,
        onSuccess: (d) => {
            const cit = d.data.map((d) => {
                return {
                    value: d.display_name,
                    lat: d.lat,
                    lon: d.lon,
                };
            });
            setFetchedLocations(cit);
        },
    });*/

    /*const {
        isLoading: isLoadingLocation2,
        isFetching: isFetchingLocations2,
        data: dataLocations2,
        refetch: refetchLocations2,
        isError: isErrorLocations2,
        error: errorLocations2,
    } = useQuery({
        queryKey: "fetch_locations_add_relative_2",
        queryFn: () => {
            return axios.get(
                `https://nominatim.openstreetmap.org/search?q=${locationInputValue2}&format=json`
            );
        },
        enabled: false,
        onSuccess: (d) => {
            const cit = d.data.map((d) => {
                return {
                    value: d.display_name,
                    lat: d.lat,
                    lon: d.lon,
                };
            });
            setFetchedLocations2(cit);
        },
    });*/

    /*const handleLocationSelect = (l) => {
        console.log(l);
        setNewRelativeCurrentResidence(l);
    };*/

    /*const handleLocationSelect2 = (l) => {
        console.log(l);
        setNewRelativeBirthplace(l);
    };*/

    /*useEffect(() => {
        function refetchLocationsFun() {
            refetchLocations();
        }
        if (locationInputValue !== "") {
            refetchLocationsFun();
        }
    }, [locationInputValue, refetchLocations]);*/

    /*useEffect(() => {
        function refetchLocations2Fun() {
            refetchLocations2();
        }
        if (locationInputValue2 !== "") {
            refetchLocations2Fun();
        }
    }, [locationInputValue2, refetchLocations2]);*/

    const handleFindByEmail = () => {
        /*if (newRelativeSex === "") {
            setMemberSexError(true);
        }

        if (newRelativeEmail === "") {
            setNewRelativeEmailError(true);
        }
        if (memberLifeStatus === "") {
            setMemberLifeStatusError(true);
        }*/
        if (newRelativeEmail !== "") {
            setMode("email");
            setActive(1);
        }
    };

    const handleFindByInfo = () => {
        if (newRelativeSex === "") {
            setMemberSexError(true);
        }
        if (newRelativeFirstName === "") {
            setNewRelativeFirstNameError(true);
        }
        /*if (memberLifeStatus === "") {
            setMemberLifeStatusError(true);
        }*/
        if (newRelativeFirstName !== "") {
            //setActiveStep(1);
            setMode("info");
            setActive(1);
        }
    };

    return (
        <Stack spacing="sm">
            <Stack>
                {/*<Paper withBorder p="md">
                    <Radio.Group
                        value={memberLifeStatus}
                        onChange={setMemberLifeStatus}
                        name="memberLifeStatusType"
                        label="Member Status"
                        description={`Is this family member alive or deceased?`}
                        withAsterisk
                        pos="center"
                        error={memberLifeStatusError && "invalid input"}
                        onFocus={() => setMemberLifeStatusError(false)}
                    >
                        <Radio value="living" label="Living" />
                        <Radio value="deceased" label="Deceased" />
                    </Radio.Group>
    </Paper>*/}
                <Paper withBorder p="md">
                    <Radio.Group
                        value={newRelativeSex}
                        onChange={setNewRelativeSex}
                        name="memberSex"
                        label="Sex"
                        pos="center"
                        error={memberSexError && "invalid input"}
                        onFocus={() => setMemberSexError(false)}
                    >
                        <Radio value="female" label="Female" />
                        <Radio value="male" label="Male" />
                    </Radio.Group>
                </Paper>
                <Paper withBorder p="md">
                    <Stack spacing={1}>
                        <Text align="center" size="sm" fw={500} c="dimmed">
                            If your relative is already in our database, we will
                            find them by their email.
                        </Text>
                        <TextInput
                            label="Email"
                            value={newRelativeEmail}
                            description="email"
                            icon={<IconAt size={19} />}
                            placeholder="email"
                            onChange={(e) =>
                                setNewRelativeEmail(e.target.value)
                            }
                            error={newRelativeEmailError && "invalid email"}
                            onFocus={() => setNewRelativeEmailError(false)}
                        />
                        <Button
                            mt="sm"
                            variant="outline"
                            onClick={handleFindByEmail}
                        >
                            Find by Email
                        </Button>
                    </Stack>
                </Paper>
                <Divider label="Or" labelPosition="center" />
                <Paper withBorder p="md">
                    <Stack spacing={1}>
                        <Text align="center" size="sm" fw={500} c="dimmed">
                            Give us info on your relative and we will look for
                            them in our database. If they are not in our
                            database, we will create a profile for them so you
                            can add them to your family tree.
                        </Text>
                        <TextInput
                            label="Name"
                            icon={<IconAbc size={19} />}
                            value={newRelativeFirstName}
                            description="First Name"
                            placeholder="name"
                            onChange={(e) =>
                                setNewRelativeFirstName(e.target.value)
                            }
                            error={newRelativeFirstNameError && "invalid input"}
                            onFocus={() => setNewRelativeFirstNameError(false)}
                        />

                        <TextInput
                            label="Father's Name"
                            icon={<IconAbc size={19} />}
                            value={newRelativeFatherName}
                            description="Father's Name"
                            placeholder="father's name"
                            onChange={(e) =>
                                setNewRelativeFatherName(e.target.value)
                            }
                        />
                        <TextInput
                            label="Nicknames"
                            value={newRelativeNicknames}
                            icon={<IconAbc size={19} />}
                            description="If any"
                            placeholder="nicknames"
                            onChange={(e) =>
                                setNewRelativeNicknames(e.target.value)
                            }
                        />

                        {/*<Autocomplete
                            label="Location"
                            description="City they currently live in"
                            value={locationInputValue}
                            onChange={setLocationInputValue}
                            data={fetchedLocations}
                            onItemSubmit={handleLocationSelect}
                        />*/}
                        <LocationAutocomplete
                            selectedLocation={newRelativeCurrentResidence}
                            setSelectedLocation={setNewRelativeCurrentResidence}
                            locationError={locationError}
                            setLocationError={setLocationError}
                            label="Current City"
                            id="tag-user-to-tree-node-1"
                        />
                        {/*<Autocomplete
                            label="Place of birth"
                            description="City they were born in"
                            value={locationInputValue2}
                            onChange={setLocationInputValue2}
                            data={fetchedLocations2}
                            onItemSubmit={handleLocationSelect2}
                        />*/}
                        <LocationAutocomplete
                            selectedLocation={newRelativeBirthplace}
                            setSelectedLocation={setNewRelativeBirthplace}
                            locationError={locationError2}
                            setLocationError={setLocationError2}
                            label="Place of Birth"
                            id="tag-user-to-tree-node-2"
                        />

                        <DatePicker
                            placeholder="Pick date"
                            label="Birthday"
                            icon={<IconCalendarEvent size={19} />}
                            value={newRelativeBirthday}
                            onChange={setNewRelativeBirthday}
                        />
                        <Button
                            mt="sm"
                            variant="outline"
                            onClick={handleFindByInfo}
                        >
                            Find Relative
                        </Button>
                    </Stack>
                </Paper>
            </Stack>
        </Stack>
    );
}

function StepTwo({
    treeMemberDocumentId,
    newRelativeFirstName,
    email,
    mode,
    setMemberAddMode,
    setActive,
    setSelectedSearchResultCard,
}) {
    return (
        <div>
            {mode === "email" ? (
                <EmailSearchResult
                    treeMemberDocumentId={treeMemberDocumentId}
                    email={email}
                    setMemberAddMode={setMemberAddMode}
                    setActive={setActive}
                    setSelectedSearchResultCard={setSelectedSearchResultCard}
                />
            ) : (
                <InfoSearchResult
                    newRelativeFirstName={newRelativeFirstName}
                    setActive={setActive}
                    setSelectedSearchResultCard={setSelectedSearchResultCard}
                    setMemberAddMode={setMemberAddMode}
                />
            )}
        </div>
    );
}

function InfoSearchResult({
    newRelativeFirstName,
    setActive,
    setSelectedSearchResultCard,
    setMemberAddMode,
}) {
    const useStyles = createStyles((theme) => ({
        paper: {
            padding: "10px",
            cursor: "pointer",
            maxWidth: "100%",

            boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px;",
            "&:hover": {
                //border: "1px solid",
                backgroundColor: theme.colors.blue[1],
                boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
                transition: "0.5s",
            },
        },
    }));

    const { classes } = useStyles();
    const [page, setPage] = useState(1);

    const { isLoading, isFetching, data, refetch, isError, error } = useQuery({
        queryKey: "similar-users-with-info",
        queryFn: () => {
            console.log("newrelfname", newRelativeFirstName);
            const uri = `/api/users/search/family?searchTerm=${newRelativeFirstName}&p=${page}`;

            return axios.get(uri);
        },
        enabled: false,
        onSuccess: () => {
            console.log("hello");
        },
    });

    const handleClick = (user) => {
        setSelectedSearchResultCard(user);
        setMemberAddMode("existing");
        setActive(2);
    };

    const handleCreate = () => {
        setMemberAddMode("create");
        setActive(2);
    };

    useEffect(() => {
        function refetchFun() {
            refetch();
        }
        refetchFun();
    }, [page, refetch]);

    if (isLoading || isFetching) {
        return <Loader />;
    }

    if (isError) {
        return (
            <div>
                {`error searching for ${newRelativeFirstName}`}
                <Text>
                    Cant find the person looking for?{" "}
                    <Text
                        span
                        style={{
                            color: "blue",
                            textDecoration: "underline",
                            cursor: "pointer",
                        }}
                        onClick={handleCreate}
                    >
                        Create
                    </Text>{" "}
                    a profile for them.{" "}
                </Text>
            </div>
        );
    }

    return (
        <Stack spacing="sm">
            <Paper withBorder p="md">
                <Stack>
                    <Title order={4} color="skyblue" fw={500} align="center">
                        We found the following people in our database:
                    </Title>
                    <Divider />
                    {data && (
                        <Pagination
                            page={page}
                            onChange={setPage}
                            total={data.data.data.pagination.pageCount}
                            siblings={1}
                            initialPage={1}
                            position="center"
                        />
                    )}
                    <ScrollArea style={{ height: 350 }}>
                        <Stack>
                            {data &&
                                data.data.data.users.map((user) => {
                                    return (
                                        <Paper
                                            className={classes.paper}
                                            key={user._id.toString()}
                                            onClick={() => handleClick(user)}
                                        >
                                            <Group>
                                                <Avatar
                                                    src={user.image}
                                                    radius="xl"
                                                    size="lg"
                                                />
                                                <Stack
                                                    spacing={0}
                                                    justify="flex-start"
                                                >
                                                    <Title order={4} fw={500}>
                                                        {user.name}{" "}
                                                        {user.fathers_name}{" "}
                                                        {user.last_name}
                                                    </Title>
                                                    <Text
                                                        size="sm"
                                                        c="dimmed"
                                                        fw={500}
                                                        order={6}
                                                    >
                                                        Born:{" "}
                                                        {user.birthday &&
                                                            user.birthday
                                                                .toString()
                                                                .split("T")[0]}
                                                    </Text>
                                                    <Text
                                                        size="sm"
                                                        c="dimmed"
                                                        fw={500}
                                                        order={6}
                                                    >
                                                        Location:{" "}
                                                        {
                                                            user
                                                                .current_residence
                                                                .value
                                                        }
                                                    </Text>
                                                </Stack>
                                            </Group>
                                        </Paper>
                                    );
                                })}
                        </Stack>
                    </ScrollArea>
                    <Text>
                        Cant find the person looking for?{" "}
                        <Text
                            span
                            style={{
                                color: "blue",
                                textDecoration: "underline",
                                cursor: "pointer",
                            }}
                            onClick={handleCreate}
                        >
                            Create
                        </Text>{" "}
                        a profile for them.{" "}
                    </Text>
                </Stack>
            </Paper>
        </Stack>
    );
}

function EmailSearchResult({
    treeMemberDocumentId,
    email,
    setActive,
    setSelectedSearchResultCard,
    setMemberAddMode,
}) {
    const useStyles = createStyles((theme) => ({
        paper: {
            padding: "10px",
            cursor: "pointer",
            maxWidth: "100%",

            boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px;",
            "&:hover": {
                //border: "1px solid",
                backgroundColor: theme.colors.blue[1],
                boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
                transition: "0.5s",
            },
        },
        inviteLink: {
            color: "blue",
            textDecoration: "underline",
            "&:hover": {
                cursor: "pointer",
            },
        },
    }));

    const { classes } = useStyles();
    const tree = useContext(TreeContext);

    const { isLoading, isFetching, data, refetch, isError, error } = useQuery({
        queryKey: "similar-users-with-email",
        refetchOnWindowFocus: false,
        queryFn: () => {
            const uri = `/api/users/users-mongoose/${email}`;

            return axios.get(uri);
        },
        onSuccess: () => {
            //console.log("hello");
        },
    });

    const handleClick = (user) => {
        setSelectedSearchResultCard(data.data.data);
        setMemberAddMode("existing");
        setActive(2);
    };

    if (isLoading || isFetching) {
        return <Loader />;
    }

    if (isError) {
        return <div>error</div>;
    }

    if (!data?.data?.data)
        return (
            <EmailNotFoundWithInvite
                treeMemberDocumentId={treeMemberDocumentId}
                tree={tree}
                email={email}
                invitationType="member"
            />
        );

    return (
        <Stack spacing="sm">
            <Paper withBorder p="md">
                <Stack>
                    <EmailNotFoundWithInvite
                        treeMemberDocumentId={treeMemberDocumentId}
                        tree={tree}
                        email={email}
                        invitationType="member"
                    />
                    <Title order={4} color="skyblue" fw={500} align="center">
                        We found the following people in our database:
                    </Title>
                    <Divider />
                    <Paper
                        className={classes.paper}
                        onClick={() => handleClick(data.data.data)}
                    >
                        <Group>
                            <Avatar
                                src={data.data.data.image}
                                radius="xl"
                                size="lg"
                            />
                            <Stack spacing={0} justify="flex-start">
                                <Title order={4} fw={500}>
                                    {data.data.data.name}{" "}
                                    {data.data.data.fathers_name}{" "}
                                    {data.data.data.last_name}
                                </Title>
                                <Text size="sm" c="dimmed" fw={500} order={6}>
                                    Born:{" "}
                                    {moment(data?.data?.data?.birthday).format(
                                        "YYYY-MM-DD"
                                    )}
                                </Text>
                                <Text size="sm" c="dimmed" fw={500} order={6}>
                                    Location:{" "}
                                    {data.data.data.current_residence.value}
                                </Text>
                            </Stack>
                        </Group>
                    </Paper>
                </Stack>
            </Paper>
        </Stack>
    );
}

function StepThree({
    treeMemberDocumentId,
    memberAddMode,
    selectedSearchResultCard = null,
    radioValue,
    memberLifeStatus,
    newRelativeEmail = "",
    newRelativeFirstName = "",
    newRelativeFatherName = "",
    newRelativeNicknames = "",
    newRelativeBirthday = "",
    newRelativeSex,
    newRelativeCurrentResidence = {
        value: "",
        lon: 0.0,
        lat: 0.0,
    },
    newRelativeBirthplace = {
        value: "",
        lon: 0.0,
        lat: 0.0,
    },
    setOpened,
}) {
    if (memberAddMode === "create") {
        return (
            <CreateAndAdd
                treeMemberDocumentId={treeMemberDocumentId}
                newRelativeEmail={newRelativeEmail}
                newRelativeFirstName={newRelativeFirstName}
                newRelativeFatherName={newRelativeFatherName}
                newRelativeNicknames={newRelativeNicknames}
                newRelativeBirthday={newRelativeBirthday}
                newRelativeCurrentResidence={newRelativeCurrentResidence}
                newRelativeBirthplace={newRelativeBirthplace}
                newRelativeSex={newRelativeSex}
                setOpened={setOpened}
            />
        );
    }
    if (memberAddMode === "existing") {
        return (
            <AddExistingProfile
                treeMemberDocumentId={treeMemberDocumentId}
                selectedSearchResultCard={selectedSearchResultCard}
                setOpened={setOpened}
            />
        );
    }
}

function CreateAndAdd({
    treeMemberDocumentId,
    newRelativeFirstName = "",
    newRelativeFatherName = "",
    newRelativeNicknames = "",
    newRelativeBirthday = "",
    newRelativeSex,
    newRelativeCurrentResidence = {
        value: "",
        lon: 0.0,
        lat: 0.0,
    },
    newRelativeBirthplace = {
        value: "",
        lon: 0.0,
        lat: 0.0,
    },
    setOpened,
}) {
    const [addButtonDisabled, setAddButtonDisabled] = useState(false);
    const { data: session } = useSession();
    //get user by email
    const {
        isLoading: isLoadingOwner,
        isFetching: isFetchingOwner,
        data: dataOwner,
        refetch: refetchOwner,
        isError: isErrorOwner,
        error: errorOwner,
    } = useQuery({
        queryKey: "load_owner",
        queryFn: () => {
            const url = `/api/users/users-mongoose/${session.user.email}`;
            return axios.get(url);
        },
        enabled: session ? true : false,
        onSuccess: (d) => {
            //edit selected node
            console.log("fetching owner");
        },
    });

    /////////////////creating new user
    //json bod
    //new user info
    //relation type
    //treeid
    //selectedTreeMemberData
    //attributes

    //get user by email
    const {
        isLoading: isLoadingCreateAndAdd,
        isFetching: isFetchingCreateAndAdd,
        data: dataCreateAndAdd,
        refetch: refetchCreateAndAdd,
        isError: isErrorCreateAndAdd,
        error: errorCreateAndAdd,
    } = useQuery({
        queryKey: "create-and-tag",
        queryFn: () => {
            const bod = {
                newUserInfo: {
                    name: newRelativeFirstName,
                    email: "",
                    image: "",
                    emailVerified: false,
                    birth_place: newRelativeBirthplace,
                    birthday: newRelativeBirthday.toString(),
                    owner: dataOwner.data.data._id.toString(),
                    current_residence: newRelativeCurrentResidence,
                    fathers_name: newRelativeFatherName,
                    last_name: "",
                    sex: newRelativeSex,
                    nicknames: newRelativeNicknames,
                    isHistorian: false,
                    isBlocked: false,
                },
                treeMemberDocumentId: treeMemberDocumentId,
            };
            const url = `/api/family-tree-api/tree-members/create-and-add/v2`;
            return axios.post(url, bod);
        },
        enabled: false,
        onSuccess: (d) => {
            setAddButtonDisabled(true);
            //window.location.reload();
            setOpened(false);
        },
    });

    const handleCreateAndAdd = () => {
        refetchCreateAndAdd();
    };
    if (!dataOwner) {
        return <Loader />;
    }

    return (
        <Stack>
            <Paper p="sm" withBorder>
                <Stack align="center" justify="center" spacing={0}>
                    <h1>
                        {newRelativeFirstName} {newRelativeFatherName}
                    </h1>
                    <Text fw={500} c="dimmed">
                        {newRelativeSex}
                    </Text>
                </Stack>
            </Paper>
            <Paper p="sm" withBorder>
                <Group position="center">
                    <Stack align="center" justify="center" spacing={0}>
                        <Text fw={500} c="dimmed">
                            Birthday
                        </Text>
                        <Text fz="xl" fw={500}>
                            {newRelativeBirthday &&
                                newRelativeBirthday.toString().split("T")[0]}
                        </Text>
                    </Stack>
                    <Stack align="center" justify="center" spacing={0}>
                        <Text fw={500} c="dimmed">
                            Place of Birth
                        </Text>
                        <Text fz="xl" fw={500}>
                            {newRelativeBirthplace.value}
                        </Text>
                    </Stack>
                    <Stack align="center" justify="center" spacing={0}>
                        <Text fw={500} c="dimmed">
                            Nicknames
                        </Text>
                        <Text fz="xl" fw={500}>
                            {newRelativeNicknames}
                        </Text>
                    </Stack>
                    <Stack align="center" justify="center" spacing={0}>
                        <Text fw={500} c="dimmed">
                            City
                        </Text>
                        <Text fz="xl" fw={500}>
                            {newRelativeCurrentResidence.value}
                        </Text>
                    </Stack>
                </Group>
            </Paper>

            <Button
                disabled={addButtonDisabled}
                loading={isLoadingCreateAndAdd || isFetchingCreateAndAdd}
                onClick={handleCreateAndAdd}
            >
                Create Profile and Tag
            </Button>
        </Stack>
    );
}

function AddExistingProfile({
    selectedSearchResultCard,
    treeMemberDocumentId,
    setOpened,
}) {
    const [addButtonDisabled, setAddButtonDisabled] = useState(false);

    const {
        isLoading: isLoadingAddMember,
        isFetching: isFetchingAddMember,
        data: dataAddMember,
        refetch: refetchAddMember,
        isError: isErrorAddMember,
        error: errorAddMember,
    } = useQuery({
        queryKey: "add-tree-member",
        queryFn: () => {
            const bod = {
                selectedSearchResultCardUserId:
                    selectedSearchResultCard._id.toString(),
                treeMemberDocumentId: treeMemberDocumentId,
            };
            const url = `/api/family-tree-api/tree-members/add-from-existing/v2`;
            return axios.post(url, bod);
        },
        enabled: false,
        onSuccess: (d) => {
            setAddButtonDisabled(true);
            //window.location.reload();
            setOpened(false);
        },
    });

    const handleAddRelative = () => {
        refetchAddMember();
    };

    return (
        <Stack>
            <Paper p="sm" withBorder>
                <Stack align="center" justify="center" spacing={0}>
                    <Avatar
                        src={selectedSearchResultCard.image}
                        alt="profile pic"
                        size="xl"
                        radius="xl"
                        color="indigo"
                    />
                    <h1>
                        {selectedSearchResultCard.name}{" "}
                        {selectedSearchResultCard.fathers_name}
                    </h1>
                </Stack>
            </Paper>
            <Paper p="sm" withBorder>
                <Group position="center">
                    <Stack align="center" justify="center" spacing={0}>
                        <Text fw={500} c="dimmed">
                            Birthday
                        </Text>
                        <Text fz="xl" fw={500}>
                            {selectedSearchResultCard.birthday &&
                                selectedSearchResultCard.birthday
                                    .toString()
                                    .split("T")[0]}
                        </Text>
                    </Stack>
                    <Stack align="center" justify="center" spacing={0}>
                        <Text fw={500} c="dimmed">
                            Place of Birth
                        </Text>
                        <Text fz="xl" fw={500}>
                            {selectedSearchResultCard.birth_place.value}
                        </Text>
                    </Stack>
                    <Stack align="center" justify="center" spacing={0}>
                        <Text fw={500} c="dimmed">
                            Nicknames
                        </Text>
                        <Text fz="xl" fw={500}>
                            {selectedSearchResultCard.nicknames}
                        </Text>
                    </Stack>
                    <Stack align="center" justify="center" spacing={0}>
                        <Text fw={500} c="dimmed">
                            City
                        </Text>
                        <Text fz="xl" fw={500}>
                            {selectedSearchResultCard.current_residence.value}
                        </Text>
                    </Stack>
                </Group>
            </Paper>
            <Paper p="sm" withBorder>
                <Stack align="center" justify="center">
                    <Text fz="xl" fw={500}>
                        Photos
                    </Text>
                </Stack>
            </Paper>
            <Button
                disabled={addButtonDisabled}
                loading={isLoadingAddMember || isFetchingAddMember}
                onClick={handleAddRelative}
            >
                Tag User
            </Button>
        </Stack>
    );
}

function ViewTreeMember({ selectedTreeMemberUserId }) {
    const router = useRouter();

    const { isLoading, isFetching, data, refetch, isError, error } = useQuery({
        queryKey: ["fetch_user_viewTreeMember", selectedTreeMemberUserId],
        queryFn: () => {
            return axios.get("/api/users/" + selectedTreeMemberUserId);
        },

        onSuccess: (d) => {
            //console.log("user ", d.data.data);
        },
    });
    const handleGoToProfile = () => {
        //router.push(`/profiles/${selectedTreeMemberUserId}/events`);
        window.open(`/profiles/${selectedTreeMemberUserId}/events`, "_blank");
    };
    if (isLoading || !data || isFetching) {
        return <Loader />;
    }
    return (
        <Stack>
            <Paper p="sm" withBorder>
                <Stack align="center" justify="center" spacing={0}>
                    <Avatar
                        src={data.data.data.image}
                        alt="profile pic"
                        size="xl"
                        radius="xl"
                        color="indigo"
                    />
                    <h1>
                        {data.data.data.name} {data.data.data.fathers_name}
                    </h1>
                    <Text fs="italic" c="dimmed">
                        {data.data.data.nicknames}
                    </Text>
                    <Text fz="xl" fw={500}>
                        {data.data.data.current_residence.value}
                    </Text>
                </Stack>
            </Paper>
            <Paper p="sm" withBorder>
                <Group grow>
                    <Stack align="center" justify="center" spacing={0}>
                        <Text fw={500} c="dimmed">
                            Birthday
                        </Text>
                        <Text fw={700} fz="xl">
                            {data.data.data.birthday &&
                                data.data.data.birthday
                                    .toString()
                                    .split("T")[0]}
                        </Text>
                    </Stack>
                    <Stack align="center" justify="center" spacing={0}>
                        <Text fw={500} c="dimmed">
                            Place of Birth
                        </Text>
                        <Text fw={700} fz="xl">
                            {data.data.data.birth_place.value}
                        </Text>
                    </Stack>
                </Group>
            </Paper>
            <Paper p="sm" withBorder>
                <Stack align="center" justify="center">
                    <Text fz="xl" fw={500}>
                        Photos
                    </Text>
                </Stack>
            </Paper>
            <Button onClick={handleGoToProfile}>Go to profile</Button>
        </Stack>
    );
}

FamTreeTwoPage.getInitialProps = (ctx) => {
    const { asPath, query, pathname } = ctx;

    return { asPath, query, pathname };
};
