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
import { useCenteredTree } from "./helpers";
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
                "/api/family-tree-api/tree-members/" +
                    dataTree.data.data._id.toString()
            );
        },
        onSuccess: (d) => {
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

                return {
                    _id: mem._id.toString(),
                    treeId: mem.treeId,
                    id: mem.id,
                    name: person_name,
                    parent_id: mem.parent_id,
                    attributes: {
                        spouse: spouse_name,
                        status: mem.attributes.status,
                    },
                };
            });
            setTreeMembersData(JSON.parse(JSON.stringify(mdata)));
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
                            data={arrayToTree(treeMembersData)}
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
                <ModalContent selectedTreeMemberData={selectedTreeMemberData} />
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
function ModalContent({ selectedTreeMemberData }) {
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
                />
            )}
        </Paper>
    );
}

function AddMemberStepper({ selectedTreeMemberData }) {
    const [active, setActive] = useState(0);
    const [mode, setMode] = useState("");

    const [radioValue, setRadioValue] = useState("");
    const [radioValueError, setRadioValueError] = useState(false);
    const [newRelativeEmail, setNewRelativeEmail] = useState("");
    const [newRelativeEmailError, setNewRelativeEmailError] = useState("");
    const [newRelativeFirstName, setNewRelativeFirstName] = useState("");
    const [newRelativeFirstNameError, setNewRelativeFirstNameError] =
        useState("");
    const [newRelativeFatherName, setNewRelativeFatherName] = useState("");
    const [newRelativeNicknames, setNewRelativeNicknames] = useState("");
    const [newRelativeBirthday, setNewRelativeBirthday] = useState("");
    const [newRelativeCurrentResidence, setNewRelativeCurrentResidence] =
        useState("");
    const [newRelativeBirthplace, setNewRelativeBirthplace] = useState("");

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
    const SelectItem = forwardRef(
        ({ image, label, description, ...others }, ref) => (
            <div ref={ref} {...others}>
                <Group noWrap>
                    <Avatar src={image} />

                    <div>
                        <Text size="sm">{label}</Text>
                        <Text size="xs" opacity={0.65}>
                            {description}
                        </Text>
                    </div>
                </Group>
            </div>
        )
    );

    const handleFindByEmail = () => {
        if (radioValue === "") {
            setRadioValueError(true);
        }
        if (newRelativeEmail === "") {
            setNewRelativeEmailError(true);
        }
        if (newRelativeEmail !== "" && radioValue !== "") {
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
        if (newRelativeFirstName !== "" && radioValue !== "") {
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
                    <Radio value="father" label="Father" />
                    <Radio value="mother" label="Mother" />
                    <Radio value="child" label="Child" />
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
                    <Select
                        label="Location"
                        placeholder="Pick one"
                        icon={<IconLocation size={19} />}
                        itemComponent={SelectItem}
                        description="City they currently live in"
                        data={citiesData}
                        searchable
                        maxDropdownHeight={300}
                        nothingFound="Nothing found"
                        filter={(value, item) =>
                            item.label
                                .toLowerCase()
                                .includes(value.toLowerCase().trim()) ||
                            item.description
                                .toLowerCase()
                                .includes(value.toLowerCase().trim())
                        }
                        value={newRelativeCurrentResidence}
                        onChange={setNewRelativeCurrentResidence}
                    />
                    <Select
                        label="Place of birth"
                        placeholder="Pick one"
                        icon={<IconLocation size={19} />}
                        itemComponent={SelectItem}
                        description="City they were born in"
                        data={citiesData}
                        searchable
                        maxDropdownHeight={300}
                        nothingFound="Nothing found"
                        filter={(value, item) =>
                            item.label
                                .toLowerCase()
                                .includes(value.toLowerCase().trim()) ||
                            item.description
                                .toLowerCase()
                                .includes(value.toLowerCase().trim())
                        }
                        value={newRelativeBirthplace}
                        onChange={setNewRelativeBirthplace}
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
}) {
    return (
        <div>
            {mode === "email" ? (
                <EmailSearchResult
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
        refetch();
    }, [page]);

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
                                                        {user.current_residence}
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

    const handleClick = () => {
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

    return (
        <Stack spacing="sm">
            <Paper withBorder p="md">
                <Stack>
                    <Title order={4} color="skyblue" fw={500} align="center">
                        We found the following people in our database:
                    </Title>
                    <Divider />
                    <Paper className={classes.paper} onClick={handleClick}>
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
                                    Location: {data.data.data.current_residence}
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
    newRelativeEmail = "",
    newRelativeFirstName = "",
    newRelativeFatherName = "",
    newRelativeNicknames = "",
    newRelativeBirthday = "",
    newRelativeCurrentResidence = "",
    newRelativeBirthplace = "",
}) {
    if (memberAddMode === "create") {
        return <div>creating {newRelativeFirstName}</div>;
    }
    if (memberAddMode === "existing") {
        return <div>{JSON.stringify(selectedSearchResultCard)}</div>;
    }
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
                        {data.data.data.current_residence}
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
                            {data.data.data.birth_place}
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
