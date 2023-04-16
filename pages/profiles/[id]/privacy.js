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
import TreeMembers from "../../../models/TreeMembers";
import Users from "../../../models/Users";
import { authOptions } from "../../api/auth/[...nextauth]";

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
                            href={"/family-tree/tree/" + tree._id.toString()}
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
                <Container mt="sm">
                    <SimpleGrid
                        cols={2}
                        spacing="lg"
                        breakpoints={[
                            { maxWidth: 755, cols: 2, spacing: "sm" },
                            { maxWidth: 600, cols: 1, spacing: "sm" },
                        ]}
                    >
                        {isLoadingCanPost || isFetchingCanPost ? (
                            <>
                                <Skeleton height={8} mt={6} radius="xl" />
                                <Skeleton height={8} mt={6} radius="xl" />
                                <Skeleton height={8} mt={6} radius="xl" />
                            </>
                        ) : (
                            <Paper withBorder p="md" bg="#f7f9fc" mt="md">
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
                        )}
                        <Paper withBorder p="md" bg="#f7f9fc" mt="md">
                            <Stack justify="center" align="center" spacing={3}>
                                <MultiSelect
                                    data={multiSelectData}
                                    value={multiSelectValue}
                                    label="Allow trees"
                                    onChange={setMultiSelectValue}
                                    placeholder="select"
                                    error={multiSelectError && "Please select"}
                                    onFocus={() => setMultiSelectError(false)}
                                />
                                <Button
                                    w={300}
                                    variant="outline"
                                    loading={isLoadingAllow || isFetchingAllow}
                                    onClick={handleAllow}
                                >
                                    Allow
                                </Button>
                            </Stack>
                        </Paper>
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

    if (!session) {
        return {
            redirect: {
                destination: "/",
                permanent: false,
            },
        };
    }
    console.log("contexttt", context.query.id);
    //get claim requests for context.query.id
    await dbConnect();

    //fetch session user and profile user
    const sessionUserPromise = Users.findOne({ email: session.user.email });
    const profileUserPromise = Users.findById(context.query.id);
    const [sessionUser, profileUser] = await Promise.all([
        sessionUserPromise,
        profileUserPromise,
    ]);
    const sessionUserJson = JSON.parse(JSON.stringify(sessionUser));
    const profileUserJson = JSON.parse(JSON.stringify(profileUser));

    //check sessionProfileRelation
    let sessionProfileRelation = "none";
    //session mode = 'self', 'owner', or 'relative'
    //if profile not session user's or session user not owner of profile
    if (sessionUser._id.toString() === context.query.id) {
        sessionProfileRelation = "self";
    } else {
        if (profileUser.owner === sessionUser._id.toString()) {
            sessionProfileRelation = "owner";
        }
    }

    console.log(
        "session profile relation is",
        sessionProfileRelation,
        sessionUserJson._id
    );

    //fetch profile's trees
    const profileUserTrees = JSON.parse(
        JSON.stringify(
            await TreeMembers.find({
                id: context.query.id,
            })
        )
    );
    //check if any session user trees are in profile user trees
    //send canPost prop
    //console.log("events page session user", sessionUser);
    //console.log("events page profile user", profileUser);
    //console.log("events page session user trees", sessionUserTrees);
    //console.log("events page profile user trees", profileUserTrees);

    let treesCanPost = [];
    let treesNoPost = [];

    profileUserTrees.map((tree) => {
        if (tree.canPost) {
            treesCanPost.push(tree);
        } else {
            treesNoPost.push(tree);
        }
    });

    /*console.log("trees ", profileUserTrees);
    console.log("can posts", treesCanPost);
    console.log("no posts", treesNoPost);*/
    const treesCanPost2 = JSON.parse(JSON.stringify(treesCanPost));
    const treesNoPost2 = JSON.parse(JSON.stringify(treesNoPost));

    /* const requestsFor = await axios.get(
        "/api/claim-requests-api/requests-for/" +
            context.query.id
    );
    const allReqs = await requestsFor.data;
    const allReqs2 = JSON.parse(JSON.stringify(allReqs.data));*/

    /*const userByEmail = await axios.get(
        "/api/users/users-mongoose/" + session.user.email
    );
    const ownerData = await userByEmail.data.data;*/
    //await dbConnect();
    //let trees = [];

    /*Users.findOne({ email: session.user.email }, function (err, user) {
        FamilyTrees.find(
            { owner: user._id.toString() },
            async function (err, docs) {
                trees = await docs;
            }
        );
    });*/
    /*const user = await Users.findOne({ email: session.user.email });
    const trees = await FamilyTrees.find({ owner: user._id.toString() });

    //trees i'm in
    const treesImIn = await TreeMembers.find({ id: user._id.toString() });
    const treesImInIds = treesImIn.map((t) => {
        return ObjectId(t.treeId);
    });
    const treesImInData = await FamilyTrees.find({
        _id: { $in: treesImInIds },
    });*/
    //console.log("trees im in", treesImInData);

    //collaborations
    /* const myCollabs = await Collabs.find({ userId: user._id.toString() });
    const myCollabsIds = myCollabs.map((c) => {
        return ObjectId(c.treeId);
    });
    const myCollabsTrees = await FamilyTrees.find({
        _id: { $in: myCollabsIds },
    });
    console.log("my collabs", myCollabsTrees);

    const treesData = JSON.parse(JSON.stringify(trees));
    const ownerData = JSON.parse(JSON.stringify(user));
    const treesImInData2 = JSON.parse(JSON.stringify(treesImInData));
    const myCollabsTrees2 = JSON.parse(JSON.stringify(myCollabsTrees));*/
    //console.log(trees);
    //console.log(ownerData);

    //console.log("these be the trees", trees);

    return {
        props: {
            session,
            treesCanPost2,
            treesNoPost2,
            sessionProfileRelation,
            //sessionUserCanPost,
            //allReqs2,
            //profileData,
            //allUsersData,
            //ownerData,
            //treesData,
            //treesImInData2,
            //myCollabsTrees2,
        },
    };
}
