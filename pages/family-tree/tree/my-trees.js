import {
    Badge,
    Button,
    createStyles,
    Group,
    MediaQuery,
    Paper,
    Radio,
    SimpleGrid,
    Stack,
    Table,
    TextInput,
    Title,
} from "@mantine/core";
import axios from "axios";
import { unstable_getServerSession } from "next-auth";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useQuery } from "react-query";
import AppShellContainer from "../../../components/appShell";
import { TreePageTitleSection } from "../../../components/titleSections";
import TreesNav from "../../../components/tree-page/modals/navigation/treePageNav";
import dbConnect from "../../../lib/dbConnect";
import FamilyTrees from "../../../models/FamilyTrees";
import Users from "../../../models/Users";
import { authOptions } from "../../api/auth/[...nextauth]";

export default function MyTreesPage({ ownerData, treesData }) {
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

    const rows = treesData.map((tree) => {
        let color = "green";
        if (tree.privacy === "private") {
            color = "blue";
        }
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
            </tr>
        );
    });

    const [newTreeName, setNewTreeName] = useState("");
    const [newTreeDescription, setNewTreeDescription] = useState("");
    const [newTreePrivacyValue, setNewTreePrivacyValue] = useState("public");
    const [newTreeNameError, setNewTreeNameError] = useState(false);
    const router = useRouter();

    const { isLoading, isFetching, data, refetch, isError, error } = useQuery({
        queryKey: "create-tree",
        queryFn: () => {
            let uri = "/api/family-tree-api/";
            const bod = {
                owner: ownerData._id,
                tree_name: newTreeName,
                description: newTreeDescription,
                privacy: newTreePrivacyValue,
            };
            console.log(bod);
            return axios.post(uri, bod);
        },
        enabled: false,

        onSuccess: (d) => {
            console.log(d.data.data._id.toString());
        },
    });
    const {
        isLoading: isLoadingAddFirstMember,
        isFetching: isFetchingAddFirstMember,
        data: dataAddFirstMember,
        refetch: refetchAddFirstMember,
        isError: isErrorAddFirstMember,
        error: errorAddFirstMember,
    } = useQuery({
        queryKey: "create-first-member",
        queryFn: () => {
            let uri = "/api/family-tree-api/tree-members";
            const bod = {
                treeId: data.data.data._id.toString(),
                id: ownerData._id,
                name: ownerData.name,
                parent_id: "",
                attributes: {
                    spouse: "",
                    status: "",
                },
            };
            console.log(bod);
            return axios.post(uri, bod);
        },
        enabled: data ? true : false,

        onSuccess: (d) => {
            console.log("hizzz", d.data.data._id.toString());
            router.push("/family-tree/tree/" + data.data.data._id.toString());
        },
    });

    const handleCreateNewTree = () => {
        if (newTreeName === "") {
            setNewTreeNameError(true);
        } else {
            refetch();
        }
    };

    return (
        <AppShellContainer>
            <TreePageTitleSection picUrl="https://img.freepik.com/free-vector/hand-drawn-tree-life-brown-shades_23-2148703761.jpg">
                <Title order={2} fw={600}>
                    My Trees
                </Title>
                <Title order={5} fw={400} color="dimmed">
                    Family Trees you've created
                </Title>
                <Link href={`/profiles/${ownerData._id.toString()}/events`}>
                    My profile
                </Link>
            </TreePageTitleSection>
            <MediaQuery smallerThan="sm" styles={{ padding: "0px" }}>
                <Paper withBorder p="md" bg="white">
                    <TreesNav activePage={"my-trees"} />
                    <SimpleGrid
                        cols={2}
                        spacing="lg"
                        breakpoints={[
                            { maxWidth: 755, cols: 2, spacing: "sm" },
                            { maxWidth: 600, cols: 1, spacing: "sm" },
                        ]}
                    >
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
                                    </tr>
                                </thead>
                                <tbody>{rows}</tbody>
                            </Table>
                        </Paper>
                        <Paper withBorder p="md" bg="#f7f9fc" mt="md">
                            <Stack justify="center" align="center" spacing={3}>
                                <TextInput
                                    w={300}
                                    placeholder="name of your new tree"
                                    label="Tree Name"
                                    withAsterisk
                                    value={newTreeName}
                                    onChange={(e) =>
                                        setNewTreeName(e.target.value)
                                    }
                                    error={newTreeNameError}
                                    onFocus={() => setNewTreeNameError(false)}
                                />
                                <TextInput
                                    w={300}
                                    placeholder="describe your tree"
                                    value={newTreeDescription}
                                    label="Tree Description"
                                    onChange={(e) =>
                                        setNewTreeDescription(e.target.value)
                                    }
                                />
                                <Radio.Group
                                    name="privacy"
                                    value={newTreePrivacyValue}
                                    onChange={setNewTreePrivacyValue}
                                >
                                    <Radio value="public" label="Public" />
                                    <Radio value="private" label="Private" />
                                </Radio.Group>
                                <Button
                                    w={300}
                                    variant="outline"
                                    onClick={handleCreateNewTree}
                                >
                                    Create New Tree
                                </Button>
                            </Stack>
                        </Paper>
                    </SimpleGrid>
                </Paper>
            </MediaQuery>
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

    await dbConnect();

    const user = await Users.findOne({ email: session.user.email });
    const trees = await FamilyTrees.find({ owner: user._id.toString() });

    const treesData = JSON.parse(JSON.stringify(trees));
    const ownerData = JSON.parse(JSON.stringify(user));

    return {
        props: {
            session,
            ownerData,
            treesData,
        },
    };
}
