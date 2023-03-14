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
} from "@mantine/core";
import {
    IconEye,
    IconPencil,
    IconPlus,
    IconShare,
    IconTrash,
    IconUserPlus,
} from "@tabler/icons";
import { NodeNextRequest } from "next/dist/server/base-http/node";
import Link from "next/link";
import { useEffect, useState } from "react";
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

    const { setSelectedTreeMemberData } = useFamTreePageStore((state) => ({
        setSelectedTreeMemberData: state.setSelectedTreeMemberData,
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
                onClose={() => setOpened(false)}
                title="Tree Member"
                size="lg"
                overflow="inside"
            >
                {dataUser && (
                    <ModalContent
                        ownerId={dataUser.data.data._id.toString()}
                        selectedTreeMemberId={selectedTreeMemberId}
                        treeId={treeId}
                    />
                )}
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

function ModalContent({ ownerId, selectedTreeMemberId, treeId, setTreeData }) {
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
    const { isLoading: isLoadingUser, data: dataUser } = useQuery({
        queryKey: "get-selected-member-data",
        queryFn: () => {
            return axios.get("/api/users/" + data.data.data.id);
        },
        enabled: data ? true : false,
        onSuccess: (d) => {
            console.log("fuuuuuuuuuuu", selectedTreeMemberId, d.data);
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
                        <UserInfoCard
                            user={dataUser.data.data}
                            mode="view"
                            handleAddToTree={null}
                            isLoading={isLoadingUser}
                            isFetching={null}
                            isError={isError}
                        />
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
}

FamilyTreeView.getInitialProps = (ctx) => {
    const { asPath, query, pathname } = ctx;

    return { asPath, query, pathname };
};
