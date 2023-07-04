import {
    ActionIcon,
    Badge,
    Button,
    Container,
    createStyles,
    Group,
    MediaQuery,
    Modal,
    MultiSelect,
    Paper,
    Radio,
    SimpleGrid,
    Skeleton,
    Stack,
    Table,
    TextInput,
    Title,
} from "@mantine/core";
import { IconTrash } from "@tabler/icons";
import axios from "axios";
import { unstable_getServerSession } from "next-auth";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useQuery } from "react-query";
import AppShellContainer from "../../../components/appShell";
import SecondaryNavbar from "../../../components/profiles_page/SecondaryNavbar";
import { TreePageTitleSection } from "../../../components/titleSections";
import dbConnect from "../../../lib/dbConnect";
//import TreeMembers from "../../../models/TreeMembers";
import Users from "../../../models/Users";
import { authOptions } from "../../api/auth/[...nextauth]";
import TreeMembersB from "../../../models/TreeMembersB";
import { ObjectId } from "mongodb";

export default function ProfilePrivacyPage({
    treesCanPost2,
    treesNoPost2,
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
    }));
    const { classes } = useStyles();
    const [multiSelectData, setMultiSelectData] = useState([]);
    const [multiSelectValue, setMultiSelectValue] = useState([]);
    const [multiSelectError, setMultiSelectError] = useState(false);
    const [removeAllowedModalOpened, setRemoveAllowedModalOpened] =
        useState(false);
    const [removeButtonDisabled, setRemoveButtonDisabled] = useState(false);
    const [treeToRemove, setTreeToRemove] = useState();
    //get canpost trees from familytrees
    const {
        isLoading: isLoadingCanPost,
        isFetching: isFetchingCanPost,
        data: dataCanPost,
        refetch: refetchCanPost,
        isError: isErrorCanPost,
        error: errorCanPost,
    } = useQuery({
        queryKey: "get-can-post-trees",
        queryFn: () => {
            const bod = treesCanPost2.map((tree) => {
                return tree.treeId;
            });

            return axios.post("/api/family-tree-api/get-multiple-trees/", bod);
        },
        onSuccess: (d) => {
            console.log("can post client side", d.data.data);
        },
    });
    const canPostRows =
        dataCanPost &&
        dataCanPost.data.data.map((tree) => {
            let color = "green";
            if (tree.privacy === "private") {
                color = "blue";
            }
            //the rows are from familytrees model
            //when the remove button is clicked, it goes throught
            //treescanpost2 (treemembers) and returns the one whose treeId === _id
            //then sets treetoremove which is a treemembers document whose canPOst is to be updated
            return (
                <tr key={tree._id.toString()}>
                    <td>
                        <Link
                            href={"/family-tree/tree/v2/" + tree._id.toString()}
                            rel="noopener noreferrer"
                            target="_blank"
                            className={classes.treeLink}
                        >
                            {tree.tree_name}
                        </Link>
                    </td>
                    <td>{tree.description}</td>

                    <td>
                        <Badge color={color}>{tree.privacy}</Badge>
                    </td>
                    <td>
                        <ActionIcon
                            color="red"
                            variant="light"
                            onClick={() => {
                                const treeMemId = treesCanPost2.filter(
                                    (tc) => tc.treeId === tree._id.toString()
                                );
                                setTreeToRemove(treeMemId[0]._id.toString());
                                setRemoveAllowedModalOpened(true);
                            }}
                        >
                            <IconTrash size={18} />
                        </ActionIcon>
                    </td>
                </tr>
            );
        });
    //get trees no post
    const {
        isLoading: isLoadingNoPost,
        isFetching: isFetchingNoPost,
        data: dataNoPost,
        refetch: refetchNoPost,
        isError: isErrorNoPost,
        error: errorNoPost,
    } = useQuery({
        queryKey: "get-no-post-trees",
        queryFn: () => {
            const bod = treesNoPost2.map((tree) => {
                return tree.treeId;
            });

            return axios.post("/api/family-tree-api/get-multiple-trees/", bod);
        },
        onSuccess: (d) => {
            console.log("no post client side", d.data.data);
            let multiSelectData = [];
            d.data.data.length > 0 &&
                d.data.data.map((t) => {
                    const treeMember = treesNoPost2.filter(
                        (m) => m.treeId === t._id.toString()
                    );
                    multiSelectData.push({
                        value: treeMember[0]._id.toString(),
                        label: t.tree_name,
                    });
                });
            setMultiSelectData(multiSelectData);
        },
    });
    const {
        isLoading: isLoadingAllow,
        isFetching: isFetchingAllow,
        data: dataAllow,
        refetch: refetchAllow,
        isError: isErrorAllow,
        error: errorAllow,
    } = useQuery({
        queryKey: "allow-trees",
        queryFn: () => {
            return axios.post(
                "/api/family-tree-api/allow-trees-post/",
                multiSelectValue
            );
        },
        enabled: false,
        onSuccess: (d) => {
            console.log("edited", d.data.data);
            setMultiSelectValue([]);
        },
    });
    const {
        isLoading: isLoadingRemoveAllowed,
        isFetching: isFetchingRemoveAllowed,
        data: dataRemoveAllowed,
        refetch: refetchRemoveAllowed,
        isError: isErrorRemoveAllowed,
        error: errorRemoveAllowed,
    } = useQuery({
        queryKey: "remove-allowed",
        queryFn: () => {
            return axios.delete(
                "/api/family-tree-api/allow-trees-post/" + treeToRemove
            );
        },
        enabled: false,
        onSuccess: (d) => {
            console.log("edited", d.data.data);
            setRemoveButtonDisabled(true);
            window.location.reload();
        },
    });
    const handleAllow = () => {
        if (multiSelectValue.length < 1) {
            setMultiSelectError(true);
        } else {
            //console.log("allowing", multiSelectValue);
            refetchAllow();
        }
    };
    const handleRemoveAllowed = () => {
        refetchRemoveAllowed();
    };

    if (sessionProfileRelation === "none") {
        return <div>RESTRICTED PAGE</div>;
    }

    return (
        <AppShellContainer>
            <TreePageTitleSection picUrl="https://img.freepik.com/free-vector/hand-drawn-tree-life-brown-shades_23-2148703761.jpg">
                <Title order={2} fw={600}>
                    Privacy Settings
                </Title>
                <Title order={5} fw={400} color="dimmed">
                    Choose who can post to this profile&apos;s wall
                </Title>
            </TreePageTitleSection>
            <SecondaryNavbar
                activePage={"privacy"}
                id={id}
                sessionProfileRelation={sessionProfileRelation}
            />
            <MediaQuery smallerThan="sm" styles={{ padding: "0px" }}>
                <Container
                    mt="sm"
                    sx={{ border: "1px solid lightgray", borderRadius: "10px" }}
                    p="xl"
                >
                    <SimpleGrid
                        cols={2}
                        spacing="xl"
                        breakpoints={[
                            { maxWidth: 755, cols: 2, spacing: "sm" },
                            { maxWidth: 600, cols: 1, spacing: "sm" },
                        ]}
                    >
                        {isLoadingCanPost ? (
                            <>
                                <Skeleton height={8} mt={6} radius="xl" />
                                <Skeleton height={8} mt={6} radius="xl" />
                                <Skeleton height={8} mt={6} radius="xl" />
                            </>
                        ) : (
                            <Stack mt="md">
                                <Title c="dimmed">Allowed Trees</Title>
                                <Paper withBorder p="md">
                                    <Table
                                        striped
                                        highlightOnHover
                                        withBorder
                                        bg="white"
                                    >
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Description</th>
                                                <th>Privacy</th>
                                            </tr>
                                        </thead>
                                        <tbody>{canPostRows}</tbody>
                                    </Table>
                                </Paper>
                            </Stack>
                        )}
                        <Stack mt="md">
                            <Title c="dimmed">Allow More Trees</Title>
                            <Paper withBorder p="md">
                                <Stack justify="center" spacing={3}>
                                    <MultiSelect
                                        data={multiSelectData}
                                        value={multiSelectValue}
                                        onChange={setMultiSelectValue}
                                        placeholder="select trees to allow"
                                        error={
                                            multiSelectError && "Please select"
                                        }
                                        onFocus={() =>
                                            setMultiSelectError(false)
                                        }
                                    />
                                    <Button
                                        w={300}
                                        variant="outline"
                                        loading={
                                            isLoadingAllow || isFetchingAllow
                                        }
                                        onClick={handleAllow}
                                    >
                                        Allow
                                    </Button>
                                </Stack>
                            </Paper>
                        </Stack>
                    </SimpleGrid>
                </Container>
            </MediaQuery>
            <Modal
                opened={removeAllowedModalOpened}
                onClose={() => setRemoveAllowedModalOpened(false)}
                title="Confirm Disallow?"
            >
                <Stack spacing="md" align="center" justify="center">
                    <Title order={5} fw={500}>
                        Are you sure you want to disallow members from posting?{" "}
                        {treeToRemove}
                    </Title>
                    <Group>
                        <Button
                            onClick={() => setRemoveAllowedModalOpened(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            loading={
                                isLoadingRemoveAllowed ||
                                isFetchingRemoveAllowed
                            }
                            color="red"
                            onClick={handleRemoveAllowed}
                            disabled={removeButtonDisabled}
                        >
                            Delete
                        </Button>
                    </Group>
                </Stack>
            </Modal>
        </AppShellContainer>
    );
}

export async function getServerSideProps(context) {
    const session = await unstable_getServerSession(
        context.req,
        context.res,
        authOptions
    );

    console.log("this changes everything", session);

    if (!session) {
        return {
            redirect: {
                destination: "/",
                permanent: false,
            },
        };
    }

    await dbConnect();

    const profileUser = await Users.findById(context.query.id);

    //check sessionProfileRelation
    //session mode = 'self', 'owner', or 'relative'
    let sessionProfileRelation = "none";
    if (session.user.id === context.query.id) {
        sessionProfileRelation = "self";
    } else {
        if (session.user.id === profileUser.owner) {
            sessionProfileRelation = "owner";
        }
    }

    //fetch profile's trees
    const profileUserTrees = JSON.parse(
        JSON.stringify(
            await TreeMembersB.find({
                taggedUser: ObjectId(context.query.id),
            })
        )
    );
    //check if any session user trees are in profile user trees
    //send canPost prop
    let treesCanPost = [];
    let treesNoPost = [];

    profileUserTrees.map((tree) => {
        if (tree.canPost) {
            treesCanPost.push(tree);
        } else {
            treesNoPost.push(tree);
        }
    });

    const treesCanPost2 = JSON.parse(JSON.stringify(treesCanPost));
    const treesNoPost2 = JSON.parse(JSON.stringify(treesNoPost));

    return {
        props: {
            session,
            treesCanPost2,
            treesNoPost2,
            sessionProfileRelation,
        },
    };
}
