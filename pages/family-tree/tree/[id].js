import {
    Button,
    MediaQuery,
    Table,
    Title,
    Paper,
    Tabs,
    Stack,
    Group,
    createStyles,
    TextInput,
    Modal,
    Container,
    Loader,
    Avatar,
    Text,
    Image,
    Stepper,
    Radio,
    Divider,
    Select,
    ScrollArea,
    Pagination,
    Autocomplete,
} from "@mantine/core";
import {
    IconAbc,
    IconAt,
    IconCalendarEvent,
    IconEye,
    IconLocation,
    IconPencil,
    IconPlus,
    IconShare,
    IconTrash,
    IconUserPlus,
} from "@tabler/icons";
import { NodeNextRequest } from "next/dist/server/base-http/node";
import Link from "next/link";
import { forwardRef, useEffect, useState } from "react";
import AppShellContainer from "../../../components/appShell";
import { TitleSection } from "../../../components/titleSections";
import { useQuery } from "react-query";
import axios from "axios";
import { Router, useRouter } from "next/router";
import arrayToTree from "array-to-tree";
import { useCenteredTree } from "../../../lib/helpers";
import dynamic from "next/dynamic";
import {
    ModalAddCollaborator,
    ModalAddMember,
} from "../../../components/add_member_components/addFamilyMember";
import useFamTreePageStore from "../../../lib/stores/famtreePageStore";
import { useSession } from "next-auth/react";
import { UserInfoCard } from "../../../components/user_view_cards/userInfoCard";
import { EditTree } from "../../../components/tree-page/modals/treePageModals";
import { Carousel } from "@mantine/carousel";
import { citiesData } from "../../demo/auth-demo/cities";
import { DatePicker } from "@mantine/dates";

const Tree = dynamic(() => import("react-d3-tree"), { ssr: false });

export default function FamilyTreeView({ asPath, query, pathname }) {
    const { data: session } = useSession();

    const useStyles = createStyles((theme) => ({
        actions: {
            cursor: "pointer",
        },
    }));
    const { classes } = useStyles();
    const [dimensions, translate, containerRef] = useCenteredTree();

    const router = useRouter();
    const { id } = router.query;
    const [opened, setOpened] = useState(false);
    const [confirmDeleteOpened, setConfirmDeleteOpened] = useState(false);
    const [editModalOpened, setEditModalOpened] = useState(false);
    const [collabModalOpened, setCollabModalOpened] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [selectedTreeMemberId, setSelectedTreeMemberId] = useState("");
    const [treeData2, setTreeData2] = useState();
    const [treeId, setTreeId] = useState();

    const { selectedTreeMemberData, setSelectedTreeMemberData, setActiveStep } =
        useFamTreePageStore((state) => ({
            setSelectedTreeMemberData: state.setSelectedTreeMemberData,
            selectedTreeMemberData: state.selectedTreeMemberData,
            setActiveStep: state.setActiveStep,
        }));

    const [treeMembersData, setTreeMembersData] = useState();

    const [treeMembersIdArray, setTreeMembersIdArray] = useState([]);
    const [collabsIdArray, setCollabsIdArray] = useState([]);
    const [editButtonDisabled, setEditButtonDisabled] = useState(false);
    const [collabButtonDisabled, setCollabButtonDisabled] = useState(false);
    const [deleteButtonDisabled, setDeleteButtonDisabled] = useState(false);
    const [treeMembersIds, setTreeMembersIds] = useState([]);

    const {
        isLoading: isLoadingUser,
        isFetching: isFetchingUser,
        data: dataUser,
        refetch: refetchUser,
        isError: isErrorUser,
        error: errorUser,
    } = useQuery({
        queryKey: "get-user",
        queryFn: () => {
            const pa = asPath.split("/");
            return axios.get("/api/users/users-mongoose/" + session.user.email);
        },
        enabled: session ? true : false,
        onSuccess: (d) => {
            console.log("owner now fetched", d.data.data);
        },
        onError: () => {
            console.log("iddddds", id);
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
        queryKey: "get-tree",
        queryFn: () => {
            const pa = asPath.split("/");
            return axios.get("/api/family-tree-api/" + pa[pa.length - 1]);
        },
        onSuccess: (d) => {
            console.log("t", d.data.data.structure);
            setTreeData2(d.data.data);

            setTreeId(asPath.split("/").pop());
        },
        onError: () => {
            console.log("iddddds", id);
        },
    });

    const {
        isLoading: isLoadingTreeCollabs,
        isFetching: isFetchingTreeCollabs,
        data: dataTreeCollabs,
        refetch: refetchTreeCollabs,
        isError: isErrorTreeCollabs,
        error: errorTreeCollabs,
    } = useQuery({
        queryKey: "get-tree-collabs",
        queryFn: () => {
            const pa = asPath.split("/");
            return axios.get(
                "/api/family-tree-api/collabs/" + pa[pa.length - 1]
            );
        },
        onSuccess: (d) => {
            let mid = [];
            d.data.data.map((member) => {
                mid.push(member.userId);
            });
            setCollabsIdArray(mid);
        },
        onError: () => {
            console.log("iddddds", id);
        },
    });

    const {
        isLoading: isLoadingTreeMembers,
        isFetching: isFetchingTreeMembers,
        data: dataTreeMembers,
        refetch: refetchTreeMembers,
        isError: isErrorTreeMembers,
        error: errorTreeMembers,
    } = useQuery({
        queryKey: "get-tree-members",
        queryFn: () => {
            const pa = asPath.split("/");
            return axios.get(
                `/api/family-tree-api/tree-members/${dataTree.data.data._id.toString()}?userOwnerId=${dataUser.data.data._id.toString()}&treeOwnerId=${
                    dataTree.data.data.owner
                }`
            );
        },
        onSuccess: (d) => {
            console.log(d.data.data);
            console.log("playerss", d.data.data);
            let mid = [];
            d.data.data.map((member) => {
                mid.push(member.id);
            });
            setTreeMembersIdArray(mid);

            const mdata = d.data.data.map((mem) => {
                let person_name = mem.name;
                let spouse_name = mem.attributes.spouse;
                if (
                    dataUser.data.data._id.toString() !==
                    dataTree.data.data.owner
                ) {
                    console.log("this is ownerrrrr");
                    //check if user is member
                    if (!mid.includes(dataUser.data.data._id.toString())) {
                        if (
                            collabsIdArray.length < 1 ||
                            (collabsIdArray.length > 0 &&
                                !collabsIdArray.includes(
                                    dataUser.data.data._id.toString()
                                ))
                        ) {
                            console.log("this is not collab");
                            if (mem.attributes.status === "living") {
                                person_name = "Person";
                                spouse_name = "Spouse";
                            }
                        }
                    }
                }
                setTreeMembersIds([...treeMembersIds, mem.id.toString()]);

                return {
                    _id: mem._id.toString(),
                    root: mem._id.toString() + "root",
                    treeId: mem.treeId,
                    customId: mem._id.toString(),
                    id: mem.id,
                    name: person_name,
                    parent_id: mem.parent_id,
                    attributes: {
                        spouse: spouse_name,
                        status: mem.attributes.status,
                    },
                };
            });
            console.log("here is your problem", mdata);
            const arrayToTreeData = arrayToTree(
                JSON.parse(JSON.stringify(mdata)),
                {
                    parentProperty: "parent_id",
                    customID: "id",
                    rootID: "root",
                }
            );
            setTreeMembersData(arrayToTreeData);
            //setTreeMembersData(d.data.data);
        },
        onError: () => {
            console.log("iddddds", id);
        },
        enabled: dataTree && dataTreeCollabs && dataUser ? true : false,
    });

    const {
        isLoading: isLoadingDelete,
        isFetching: isFetchingDelete,
        data: dataDelete,
        refetch: refetchDelete,
        isError: isErrorDelete,
        error: errorDelete,
    } = useQuery({
        queryKey: "delete-tree",
        queryFn: () => {
            const pa = asPath.split("/");
            return axios.delete("/api/family-tree-api/" + pa[pa.length - 1]);
        },
        onSuccess: (d) => {
            setButtonDisabled(true);
            router.push("/family-tree/tree/my-trees");
        },
        onError: () => {
            console.log("iddddds", id);
        },
        enabled: false,
    });

    const handleNodeClick = (n) => {
        if (
            dataUser.data.data._id.toString() === dataTree.data.data.owner ||
            collabsIdArray.includes(dataUser.data.data._id.toString())
        ) {
            console.log("node clicked", n.data);
            setSelectedTreeMemberId(n.data._id);
            setSelectedTreeMemberData(n.data);
            setOpened(true);
        }
    };

    const handleTreeDelete = () => {
        refetchDelete();
    };

    const getShareButtonStatus = () => {};
    const isEditButtonDisabled = () => {
        //if owner
        if (dataUser.data.data._id.toString() !== dataTree.data.data.owner) {
            console.log("this is ownerrrrr");
            if (
                collabsIdArray.length < 1 ||
                (collabsIdArray.length > 0 &&
                    !collabsIdArray.includes(dataUser.data.data._id.toString()))
            ) {
                console.log("this is not collab");
                setEditButtonDisabled(true);
            }
        }
    };
    const isCollabButtonDisabled = () => {
        //if owner
        if (dataUser.data.data._id.toString() !== dataTree.data.data.owner) {
            console.log("this is ownerrrrr");

            setCollabButtonDisabled(true);
        }
    };
    const isDeleteButtonDisabled = () => {
        //if owner
        if (dataUser.data.data._id.toString() !== dataTree.data.data.owner) {
            console.log("this is ownerrrrr");

            setDeleteButtonDisabled(true);
        }
    };

    useEffect(() => {
        if (dataUser && dataTree) {
            isEditButtonDisabled();
            isCollabButtonDisabled();
            isDeleteButtonDisabled();
        }
    }, [dataUser, dataTree, collabsIdArray]);

    if (!session) {
        return <div>sign in</div>;
    }

    return (
        <AppShellContainer>
            <TitleSection>
                <Group spacing="xs">
                    {treeData2 && (
                        <Stack spacing={0} align="left" justify="center">
                            <Title order={3} fw={500}>
                                {treeData2.tree_name}
                            </Title>
                            <Title order={6} color="dimmed" fw={500}>
                                {treeData2.description}
                            </Title>
                        </Stack>
                    )}

                    <Button
                        variant="subtle"
                        compact
                        leftIcon={<IconShare size={20} />}
                    >
                        Share
                    </Button>
                    <Button
                        variant="subtle"
                        compact
                        leftIcon={<IconPencil size={20} />}
                        disabled={editButtonDisabled}
                        onClick={() => setEditModalOpened(true)}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="subtle"
                        compact
                        leftIcon={<IconPlus size={20} />}
                        onClick={() => setCollabModalOpened(true)}
                        disabled={collabButtonDisabled}
                    >
                        Collaborators
                    </Button>
                    <Button
                        variant="subtle"
                        compact
                        color="red"
                        leftIcon={<IconTrash size={20} />}
                        onClick={() => setConfirmDeleteOpened(true)}
                        disabled={deleteButtonDisabled}
                    >
                        Delete
                    </Button>
                </Group>
            </TitleSection>
            <MediaQuery smallerThan="sm" styles={{ padding: "0px" }}>
                <div
                    style={{
                        height: "70vh",
                        border: "1px solid skyblue",
                    }}
                    ref={containerRef}
                >
                    {!treeMembersData ? (
                        <Loader />
                    ) : (
                        <Tree
                            data={treeMembersData}
                            dimensions={dimensions}
                            translate={translate}
                            collapsible={false}
                            onNodeClick={handleNodeClick}
                            orientation="vertical"
                        />
                    )}
                </div>
            </MediaQuery>
            <Modal
                opened={opened}
                onClose={() => {
                    setOpened(false);
                    //setActiveStep(0);
                }}
                title="Tree Member"
                size="lg"
                overflow="inside"
            >
                <ModalContent
                    selectedTreeMemberData={selectedTreeMemberData}
                    treeMembersIds={treeMembersIds}
                />
                {/*dataUser && (
                    <ModalContent
                        ownerId={dataUser.data.data._id.toString()}
                        selectedTreeMemberId={selectedTreeMemberId}
                        treeId={treeId}
                    />
                )*/}
            </Modal>
            <Modal
                opened={collabModalOpened}
                onClose={() => setCollabModalOpened(false)}
                title="Manage Collaborators"
                size="lg"
                overflow="inside"
            >
                <ModalAddCollaborator treeId={treeId} />
            </Modal>
            <Modal
                opened={editModalOpened}
                onClose={() => setEditModalOpened(false)}
                title="Edit tree"
            >
                <EditTree treeId={treeId} />
            </Modal>
            <Modal
                opened={confirmDeleteOpened}
                onClose={() => setConfirmDeleteOpened(false)}
                title="Confirm delete?"
            >
                <Stack spacing="md" align="center" justify="center">
                    <Title order={5} fw={500}>
                        Are you sure you want to delete{" "}
                        {treeData2 && treeData2.tree_name} ?
                    </Title>
                    <Group>
                        <Button onClick={() => setConfirmDeleteOpened(false)}>
                            Cancel
                        </Button>
                        <Button
                            loading={isLoadingDelete || isFetchingDelete}
                            color="red"
                            onClick={handleTreeDelete}
                            disabled={buttonDisabled}
                        >
                            Delete
                        </Button>
                    </Group>
                </Stack>
            </Modal>
        </AppShellContainer>
    );
}
function ModalContent({ selectedTreeMemberData, treeMembersIds }) {
    const [activeTab, setActiveTab] = useState("view");
    return (
        <Paper style={{ backgroundColor: "#f8f8f8" }} p="md">
            <Tabs value={activeTab} onTabChange={setActiveTab}>
                <Tabs.List>
                    <Tabs.Tab value="view">View Member</Tabs.Tab>
                    <Tabs.Tab value="add">Add Member</Tabs.Tab>
                </Tabs.List>
            </Tabs>
            {activeTab === "view" ? (
                <ViewTreeMember
                    selectedTreeMemberUserId={selectedTreeMemberData.id}
                />
            ) : (
                <AddMemberStepper
                    selectedTreeMemberData={selectedTreeMemberData}
                    treeMembersIds={treeMembersIds}
                />
            )}
        </Paper>
    );
}

function AddMemberStepper({ selectedTreeMemberData, treeMembersIds }) {
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
                    description="Family Member Information"
                    allowStepSelect={false}
                >
                    <StepOne
                        selectedTreeMemberData={selectedTreeMemberData}
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
                        newRelativeFirstName={newRelativeFirstName}
                        email={newRelativeEmail}
                        mode={mode}
                        setMemberAddMode={setMemberAddMode}
                        setActive={setActive}
                        setSelectedSearchResultCard={
                            setSelectedSearchResultCard
                        }
                        treeMembersIds={treeMembersIds}
                    />
                </Stepper.Step>
                <Stepper.Step
                    label="Final step"
                    description="Add Family Member"
                    allowStepSelect={false}
                >
                    <StepThree
                        memberAddMode={memberAddMode}
                        radioValue={radioValue}
                        memberLifeStatus={memberLifeStatus}
                        selectedTreeMemberData={selectedTreeMemberData}
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
                    />
                </Stepper.Step>
                <Stepper.Completed>
                    Completed, click back button to get to previous step
                </Stepper.Completed>
            </Stepper>
            <Button variant="default" onClick={prevStep}>
                Back
            </Button>
            <Button onClick={nextStep}>Next step</Button>
        </>
    );
}

function StepOne({
    selectedTreeMemberData,
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
    newRelativeBirthday,
    setNewRelativeBirthday,
    newRelativeCurrentResidence,
    setNewRelativeCurrentResidence,
    newRelativeBirthplace,
    setNewRelativeBirthplace,
    setActive,
    setMode,
}) {
    const [locationInputValue, setLocationInputValue] = useState("");
    const [fetchedLocations, setFetchedLocations] = useState([]);
    const [locationInputValue2, setLocationInputValue2] = useState("");
    const [fetchedLocations2, setFetchedLocations2] = useState([]);

    const {
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
    });

    const {
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
    });

    const handleLocationSelect = (l) => {
        console.log(l);
        setNewRelativeCurrentResidence(l);
    };

    const handleLocationSelect2 = (l) => {
        console.log(l);
        setNewRelativeBirthplace(l);
    };

    useEffect(() => {
        if (locationInputValue !== "") {
            refetchLocations();
        }
    }, [locationInputValue]);

    useEffect(() => {
        if (locationInputValue2 !== "") {
            refetchLocations2();
        }
    }, [locationInputValue2]);

    const handleFindByEmail = () => {
        if (radioValue === "") {
            setRadioValueError(true);
        }
        if (newRelativeEmail === "") {
            setNewRelativeEmailError(true);
        }
        if (memberLifeStatus === "") {
            setMemberLifeStatusError(true);
        }
        if (
            newRelativeEmail !== "" &&
            radioValue !== "" &&
            memberLifeStatus !== ""
        ) {
            setMode("email");
            setActive(1);
        }
    };

    const handleFindByInfo = () => {
        if (radioValue === "") {
            setRadioValueError(true);
        }
        if (newRelativeFirstName === "") {
            setNewRelativeFirstNameError(true);
        }
        if (memberLifeStatus === "") {
            setMemberLifeStatusError(true);
        }
        if (
            newRelativeFirstName !== "" &&
            radioValue !== "" &&
            memberLifeStatus !== ""
        ) {
            //setActiveStep(1);
            setMode("info");
            setActive(1);
        }
    };

    return (
        <Stack spacing="sm">
            <Paper withBorder p="md">
                <Radio.Group
                    value={radioValue}
                    onChange={setRadioValue}
                    name="relativeType"
                    label="Select Relation"
                    description={`How is this person related to ${selectedTreeMemberData.name}?`}
                    withAsterisk
                    pos="center"
                    error={radioValueError && "invalid input"}
                    onFocus={() => setRadioValueError(false)}
                >
                    {selectedTreeMemberData.parent_id === "" && (
                        <Radio value="father" label="Parent" />
                    )}

                    <Radio value="child" label="Child" />
                </Radio.Group>
            </Paper>
            <Paper withBorder p="md">
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
                        onChange={(e) => setNewRelativeEmail(e.target.value)}
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
                        Give us info on your relative and we will look for them
                        in our database. If they are not in our database, we
                        will create a profile for them so you can add them to
                        your family tree.
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

                    <Autocomplete
                        label="Location"
                        description="City they currently live in"
                        value={locationInputValue}
                        onChange={setLocationInputValue}
                        data={fetchedLocations}
                        onItemSubmit={handleLocationSelect}
                    />
                    <Autocomplete
                        label="Place of birth"
                        description="City they were born in"
                        value={locationInputValue2}
                        onChange={setLocationInputValue2}
                        data={fetchedLocations2}
                        onItemSubmit={handleLocationSelect2}
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
    );
}

function StepTwo({
    newRelativeFirstName,
    email,
    mode,
    setMemberAddMode,
    setActive,
    setSelectedSearchResultCard,
    treeMembersIds,
}) {
    return (
        <div>
            {mode === "email" ? (
                <EmailSearchResult
                    email={email}
                    setMemberAddMode={setMemberAddMode}
                    setActive={setActive}
                    setSelectedSearchResultCard={setSelectedSearchResultCard}
                    treeMembersIds={treeMembersIds}
                />
            ) : (
                <InfoSearchResult
                    newRelativeFirstName={newRelativeFirstName}
                    setActive={setActive}
                    setSelectedSearchResultCard={setSelectedSearchResultCard}
                    setMemberAddMode={setMemberAddMode}
                    treeMembersIds={treeMembersIds}
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
    treeMembersIds,
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
        console.log("treee membersss", treeMembersIds);
        if (treeMembersIds.indexOf(user._id.toString()) === -1) {
            setSelectedSearchResultCard(user);
            setMemberAddMode("existing");
            setActive(2);
        }
    };

    const handleCreate = () => {
        setMemberAddMode("create");
        setActive(2);
    };

    useEffect(() => {
        refetch();
    }, [page]);

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
    email,
    setActive,
    setSelectedSearchResultCard,
    setMemberAddMode,
    treeMembersIds,
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

    const { isLoading, isFetching, data, refetch, isError, error } = useQuery({
        queryKey: "similar-users-with-email",
        queryFn: () => {
            const uri = `/api/users/users-mongoose/${email}`;

            return axios.get(uri);
        },
        onSuccess: () => {
            console.log("hello");
        },
    });

    const handleClick = (user) => {
        if (treeMembersIds.indexOf(user._id.toString()) === -1) {
            setSelectedSearchResultCard(data.data.data);
            setMemberAddMode("existing");
            setActive(2);
        }
    };

    if (isLoading || isFetching) {
        return <Loader />;
    }

    if (isError) {
        return <div>error</div>;
    }

    return (
        <Stack spacing="sm">
            <Paper withBorder p="md">
                <Stack>
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
                                    {data.data.data.birthday &&
                                        data.data.data.birthday
                                            .toString()
                                            .split("T")[0]}
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
    memberAddMode,
    selectedSearchResultCard = null,
    radioValue,
    selectedTreeMemberData,
    memberLifeStatus,
    newRelativeEmail = "",
    newRelativeFirstName = "",
    newRelativeFatherName = "",
    newRelativeNicknames = "",
    newRelativeBirthday = "",
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
}) {
    if (memberAddMode === "create") {
        return (
            <CreateAndAdd
                memberLifeStatus={memberLifeStatus}
                newRelativeEmail={newRelativeEmail}
                newRelativeFirstName={newRelativeFirstName}
                newRelativeFatherName={newRelativeFatherName}
                newRelativeNicknames={newRelativeNicknames}
                newRelativeBirthday={newRelativeBirthday}
                newRelativeCurrentResidence={newRelativeCurrentResidence}
                newRelativeBirthplace={newRelativeBirthplace}
                radioValue={radioValue}
                selectedTreeMemberData={selectedTreeMemberData}
            />
        );
    }
    if (memberAddMode === "existing") {
        return (
            <AddExistingProfile
                radioValue={radioValue}
                memberLifeStatus={memberLifeStatus}
                selectedSearchResultCard={selectedSearchResultCard}
                selectedTreeMemberData={selectedTreeMemberData}
            />
        );
    }
}

function CreateAndAdd({
    radioValue,
    selectedTreeMemberData,
    memberLifeStatus,
    newRelativeEmail = "",
    newRelativeFirstName = "",
    newRelativeFatherName = "",
    newRelativeNicknames = "",
    newRelativeBirthday = "",
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
        queryKey: "create-user",
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
        queryKey: "create-and-add",
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
                    nicknames: newRelativeNicknames,
                    isHistorian: false,
                    isBlocked: false,
                },
                relationType: radioValue,
                selectedTreeMemberData: selectedTreeMemberData,
                attributes: {
                    spouse: "",
                    status: memberLifeStatus,
                },
            };
            const url = `/api/family-tree-api/tree-members/create-and-add/`;
            return axios.post(url, bod);
        },
        enabled: false,
        onSuccess: (d) => {
            setAddButtonDisabled(true);
            window.location.reload();
        },
    });
    /*
    const {
        isLoading: isLoadingCreateUser,
        isFetching: isFetchingCreateUserr,
        data: dataCreateUser,
        refetch: refetchCreateUser,
        isError: isErrorCreateUser,
        error: errorCreateUser,
    } = useQuery({
        queryKey: "create-user",
        queryFn: () => {
            const bod = {
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
                nicknames: newRelativeNicknames,
                isHistorian: false,
                isBlocked: false,
            };

            const url = `/api/users/add-unclaimed-account`;
            return axios.post(url, bod);
        },
        enabled: false,
        onSuccess: (d) => {
            console.log("user created", d.data.data);
        },
    });

    const {
        isLoading: isLoadingEditNode,
        isFetching: isFetchingEditNode,
        data: dataEditNode,
        refetch: refetchEditNode,
        isError: isErrorEditNode,
        error: errorEditNode,
    } = useQuery({
        queryKey: "edit-node",
        queryFn: () => {
            const bod = {
                parent_id: dataCreateUser.data.data._id.toString(),
            };
            return axios.put(
                `/api/family-tree-api/tree-members/manage-members/${selectedTreeMemberData._id.toString()}`,
                bod
            );
        },
        enabled: false,
        onSuccess: (d) => {
            console.log("editing node");
        },
    });

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
            let bod = {};
            if (radioValue === "father") {
                bod = {
                    treeId: selectedTreeMemberData.treeId,
                    id: dataCreateUser.data.data._id.toString(),
                    name: dataCreateUser.data.data.name,
                    parent_id: "",
                    attributes: {
                        spouse: "",
                        status: "",
                    },
                    canPost: false,
                };
            } else if (radioValue === "child") {
                bod = {
                    treeId: selectedTreeMemberData.treeId,
                    id: dataCreateUser.data.data._id.toString(),
                    name: dataCreateUser.data.data.name,
                    parent_id: selectedTreeMemberData.id.toString(),
                    attributes: {
                        spouse: "",
                        status: "",
                    },
                    canPost: false,
                };
            }
            const url = `/api/family-tree-api/tree-members/manage-members/`;
            return axios.post(url, bod);
        },
        enabled: dataCreateUser ? true : false,
        onSuccess: (d) => {
            if (radioValue === "father") {
                //edit selected node
                console.log("adding father");
                refetchEditNode();
            }
        },
    });
*/
    /////////////////////////////////////

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
                Create Profile and Add Relative
            </Button>
        </Stack>
    );
}

function AddExistingProfile({
    radioValue,
    selectedSearchResultCard,
    selectedTreeMemberData,
    memberLifeStatus,
}) {
    const images = [
        "https://images.unsplash.com/photo-1499952127939-9bbf5af6c51c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=876&q=80",
        "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
        "https://images.unsplash.com/photo-1597524678053-5e6fef52d8a3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=676&q=80",
        "https://images.unsplash.com/photo-1596510914965-9ae08acae566?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=449&q=80",
    ];
    const slides = images.map((url) => (
        <Carousel.Slide key={url}>
            <Image src={url} fit="cover" />
        </Carousel.Slide>
    ));

    const [addButtonDisabled, setAddButtonDisabled] = useState(false);

    const {
        isLoading: isLoadingEditNode,
        isFetching: isFetchingEditNode,
        data: dataEditNode,
        refetch: refetchEditNode,
        isError: isErrorEditNode,
        error: errorEditNode,
    } = useQuery({
        queryKey: "edit-node",
        queryFn: () => {
            const bod = {
                parent_id: selectedSearchResultCard._id.toString(),
            };
            console.log("hehehe", selectedTreeMemberData._id.toString());
            return axios.put(
                `/api/family-tree-api/tree-members/manage-members/${selectedTreeMemberData._id.toString()}`,
                bod
            );
        },
        enabled: false,
        onSuccess: (d) => {
            console.log("added father");
        },
    });

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
            let bod = {};
            if (radioValue === "father") {
                bod = {
                    treeId: selectedTreeMemberData.treeId,
                    id: selectedSearchResultCard._id.toString(),
                    name: selectedSearchResultCard.name,
                    parent_id: "",
                    attributes: {
                        spouse: "",
                        status: memberLifeStatus,
                    },
                    canPost: false,
                };
            } else if (radioValue === "child") {
                bod = {
                    treeId: selectedTreeMemberData.treeId,
                    id: selectedSearchResultCard._id.toString(),
                    name: selectedSearchResultCard.name,
                    parent_id: selectedTreeMemberData.id.toString(),
                    attributes: {
                        spouse: "",
                        status: memberLifeStatus,
                    },
                    canPost: false,
                };
            }
            const url = `/api/family-tree-api/tree-members/manage-members/`;
            return axios.post(url, bod);
        },
        enabled: false,
        onSuccess: (d) => {
            setAddButtonDisabled(true);
            if (radioValue === "father") {
                //edit selected node
                console.log("adding father");
                refetchEditNode();
            }
            window.location.reload();
        },
    });

    const handleAddRelative = () => {
        //if radiovalue = father
        //add selected card to tree members
        //edit selected nodes parent id
        //if radiovalue = child
        //add selected card to tree members with parent id set to selected node
        refetchAddMember();
        //console.log("yiiiiiiiii", memberLifeStatus);
        //console.log("selected tree member", selectedTreeMemberData);
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
                    <Carousel maw={320} mx="auto" withIndicators>
                        {slides}
                    </Carousel>
                </Stack>
            </Paper>
            <Button
                disabled={addButtonDisabled}
                loading={isLoadingAddMember || isFetchingAddMember}
                onClick={handleAddRelative}
            >
                Add Relative
            </Button>
        </Stack>
    );
}

function ViewTreeMember({ selectedTreeMemberUserId }) {
    const images = [
        "https://images.unsplash.com/photo-1499952127939-9bbf5af6c51c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=876&q=80",
        "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
        "https://images.unsplash.com/photo-1597524678053-5e6fef52d8a3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=676&q=80",
        "https://images.unsplash.com/photo-1596510914965-9ae08acae566?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=449&q=80",
    ];
    const slides = images.map((url) => (
        <Carousel.Slide key={url}>
            <Image src={url} fit="cover" />
        </Carousel.Slide>
    ));

    const router = useRouter();

    const { isLoading, isFetching, data, refetch, isError, error } = useQuery({
        queryKey: "fetch-stories",
        queryFn: () => {
            return axios.get(
                "http://localhost:3000/api/users/" + selectedTreeMemberUserId
            );
        },

        onSuccess: (d) => {
            console.log("events of ", d.data.data);
        },
    });
    const handleGoToProfile = () => {
        router.push(`/profiles/${selectedTreeMemberUserId}/events`);
    };
    if (isLoading || isFetching || !data) {
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
                    <Carousel maw={320} mx="auto" withIndicators>
                        {slides}
                    </Carousel>
                </Stack>
            </Paper>
            <Button onClick={handleGoToProfile}>Go to profile</Button>
        </Stack>
    );
}

/*function ModalContent({ ownerId, selectedTreeMemberId, treeId, setTreeData }) {
    const [userId, setUserId] = useState("");
    const { isLoading, isFetching, data, refetch, isError, error } = useQuery({
        queryKey: "get-selected-member-data",
        queryFn: () => {
            return axios.get(
                "/api/family-tree-api/tree-members/member/" +
                    selectedTreeMemberId
            );
        },
        onSuccess: (d) => {
            console.log("fuuuuuuuuuuu", selectedTreeMemberId, d.data);
        },
    });
    //const
    const {
        isLoading: isLoadingUser,
        data: dataUser,
        refetch: refetchUser,
    } = useQuery({
        queryKey: "get-selected-member-data",
        queryFn: () => {
            return axios.get("/api/users/" + data.data.data.id);
        },
        enabled: data ? true : false,
        onSuccess: (d) => {
            console.log("fuuuuuuuuuuu", selectedTreeMemberId, d.data);
            setUserId(d.data.data._id.toString());
        },
    });
    return (
        <Container>
            <Tabs keepMounted={false} defaultValue="view" color="blue">
                <Tabs.List grow>
                    <Tabs.Tab value="view">View Member</Tabs.Tab>
                    <Tabs.Tab value="add">Add member</Tabs.Tab>
                </Tabs.List>
                <Tabs.Panel value="view" pt="xs">
                    {dataUser ? (
                        <ViewSelectedMemberComponent userId={userId} />
                    ) : (
                        <Loader />
                    )}
                </Tabs.Panel>

                <Tabs.Panel value="add" pt="xs">
                    {dataUser ? (
                        <ModalAddMember
                            ownerId={ownerId}
                            selectedTreeMemberId={selectedTreeMemberId}
                            treeId={treeId}
                            setTreeData={setTreeData}
                        />
                    ) : (
                        <Loader />
                    )}
                </Tabs.Panel>
            </Tabs>
        </Container>
    );
}*/

FamilyTreeView.getInitialProps = (ctx) => {
    const { asPath, query, pathname } = ctx;

    return { asPath, query, pathname };
};
