import { Button, Group, MediaQuery, Modal, Stack, Title } from "@mantine/core";
import AppShellContainer from "../../../../components/appShell";
import { TitleSection } from "../../../../components/titleSections";
import { IconPencil, IconPlus, IconShare, IconTrash } from "@tabler/icons";
import { ModalAddCollaborator } from "../../../../components/add_member_components/addFamilyMember";
import { EditTree } from "../../../../components/tree-page/modals/treePageModals";

import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import Link from "next/link";

const BalkanTree = dynamic(
    () => import("../../../../components/tree-page/balkan_tree/BalkanTree"),
    {
        ssr: false,
    }
);

export default function FamTreeTwoPage({ asPath }) {
    //const { asPath, pathname } = useRouter();
    const { data: session, status } = useSession();

    const [sessionUser, setSessionUser] = useState(null);
    const [fetchedFamilyTree, setFetchedFamilyTree] = useState(null);
    const [sessionTreeRelation, setSessionTreeRelation] = useState(null);

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

    /*useEffect(() => {
        if (session) {
            refetchUser;
        }
    }, [session]);*/

    useEffect(() => {
        refetchTree();
    }, []);

    useEffect(() => {
        if (sessionUser && fetchedFamilyTree) {
            console.log("sessionUser", sessionUser);
            console.log("fetched tree", fetchedFamilyTree);
            if (fetchedFamilyTree.owner === sessionUser._id.toString()) {
                setSessionTreeRelation("owner");
            } else {
                setSessionTreeRelation("none");
            }
        }
    }, [sessionUser, fetchedFamilyTree]);

    if (status === "unauthenticated") {
        return <Link href="/api/auth/signin">Sign in</Link>;
    }
    if (status === "loading" || !sessionTreeRelation) {
        console.log(status);
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
                        /*disabled={editButtonDisabled}*/
                        /*onClick={() => setEditModalOpened(true)}*/
                    >
                        Edit
                    </Button>
                    <Button
                        variant="subtle"
                        compact
                        leftIcon={<IconPlus size={20} />}
                        //onClick={() => setCollabModalOpened(true)}
                        //disabled={collabButtonDisabled}
                    >
                        Collaborators
                    </Button>
                    <Button
                        variant="subtle"
                        compact
                        color="red"
                        leftIcon={<IconTrash size={20} />}
                        //onClick={() => setConfirmDeleteOpened(true)}
                        //disabled={deleteButtonDisabled}
                    >
                        Delete
                    </Button>
                </Group>
            </TitleSection>

            <div
                style={{
                    height: "100vh",
                    border: "1px solid lightblue",
                    background: "white",
                }}
            >
                <div id="tree_balkan"></div>
                <BalkanTree
                    treeIdProp={asPath.split("/").at(-1)}
                    sessionTreeRelation={sessionTreeRelation}
                />
            </div>

            {/*<Modal
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
            </Modal>*/}
        </AppShellContainer>
    );
}

FamTreeTwoPage.getInitialProps = (ctx) => {
    const { asPath, query, pathname } = ctx;

    return { asPath, query, pathname };
};
