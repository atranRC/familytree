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
    Radio,
    Divider,
} from "@mantine/core";
import { IconEye, IconUserExclamation, IconUserPlus } from "@tabler/icons";
import { NodeNextRequest } from "next/dist/server/base-http/node";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import AppShellContainer from "../../../components/appShell";
import { TitleSection } from "../../../components/titleSections";
import { useQuery } from "react-query";
import axios from "axios";
import { Router, useRouter } from "next/router";
import Users from "../../../models/Users";
import dbConnect from "../../../lib/dbConnect";
import FamilyTrees from "../../../models/FamilyTrees";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]";
import TreeMembers from "../../../models/TreeMembers";
import { ObjectId } from "mongodb";
import Collabs from "../../../models/Collabs";

/*const ownerData = {
    _id: "63bfd98c2fc1bd9a18841fa4",
    name: "sam",
    email: "atranarsenal@gmail.com",
    image: "https://avatars.githubusercontent.com/u/15000399?v=4",
    emailVerified: null,
    birth_place: "khartum",
    birthday: { $date: { $numberLong: "642286800000" } },
    current_residence: "nairobi",
    fathers_name: "daniel",
    last_name: "hailu",
    nicknames: "sammy",
    owner: "self",
};*/

export default function FamilTreePage({
    ownerData,
    treesData,
    treesImInData2,
    myCollabsTrees2,
    unclaimedProfiles2,
}) {
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

    const rows = treesData.map((tree) => (
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
        </tr>
    ));

    const treesImInrows = treesImInData2.map((tree) => (
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
        </tr>
    ));

    const myCollabsTreesRows = myCollabsTrees2.map((tree) => (
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
        </tr>
    ));

    const unclaimedProfilesRow = unclaimedProfiles2.map((p) => (
        <tr key={p._id.toString()}>
            <td>
                <Link
                    href={`/profiles/${p._id.toString()}/claim-requests`}
                    className={classes.treeLink}
                >
                    {p.name}
                </Link>
            </td>
            <td>
                {p.current_residence ? p.current_residence : "unknown location"}
            </td>
        </tr>
    ));

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
            <MediaQuery smallerThan="sm" styles={{ padding: "0px" }}>
                <Paper withBorder p="md" bg="white">
                    <Stack justify="center" align="stretch">
                        <Tabs
                            keepMounted={false}
                            defaultValue="myTrees"
                            variant="outline"
                        >
                            <Tabs.List grow>
                                <Tabs.Tab
                                    value="myTrees"
                                    icon={<IconEye size={20} color="skyblue" />}
                                >
                                    My trees
                                </Tabs.Tab>
                                <Tabs.Tab
                                    value="collaborations"
                                    icon={
                                        <IconUserPlus
                                            size={20}
                                            color="skyblue"
                                        />
                                    }
                                >
                                    My Collaborations
                                </Tabs.Tab>
                                <Tabs.Tab
                                    value="treesimin"
                                    icon={
                                        <IconUserPlus
                                            size={20}
                                            color="skyblue"
                                        />
                                    }
                                >
                                    Trees I'm In
                                </Tabs.Tab>
                                <Tabs.Tab
                                    value="unclaimed"
                                    icon={
                                        <IconUserExclamation
                                            size={20}
                                            color="skyblue"
                                        />
                                    }
                                >
                                    Unclaimed Accounts
                                </Tabs.Tab>
                            </Tabs.List>

                            <Tabs.Panel value="myTrees">
                                my trees
                                <Paper withBorder p="md" bg="#f7f9fc">
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
                            </Tabs.Panel>

                            <Tabs.Panel value="collaborations">
                                my collabs
                                <Paper withBorder p="md" bg="#f7f9fc">
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
                                        <tbody>{myCollabsTreesRows}</tbody>
                                    </Table>
                                </Paper>
                            </Tabs.Panel>

                            <Tabs.Panel value="treesimin">
                                Trees i'm in
                                <Paper withBorder p="md" bg="#f7f9fc">
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
                                        <tbody>{treesImInrows}</tbody>
                                    </Table>
                                </Paper>
                            </Tabs.Panel>
                            <Tabs.Panel value="unclaimed">
                                Unclaimed Profiles
                                <Paper withBorder p="md" bg="#f7f9fc">
                                    <Table
                                        striped
                                        highlightOnHover
                                        withBorder
                                        bg="white"
                                    >
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Location</th>
                                            </tr>
                                        </thead>
                                        <tbody>{unclaimedProfilesRow}</tbody>
                                    </Table>
                                </Paper>
                            </Tabs.Panel>
                        </Tabs>
                        <Divider label="Create New tree" />
                        <Stack justify="center" align="left" spacing={3}>
                            <TextInput
                                w={300}
                                placeholder="name of your new tree"
                                label="Tree Name"
                                withAsterisk
                                value={newTreeName}
                                onChange={(e) => setNewTreeName(e.target.value)}
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
                                label="Privacy"
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
                    </Stack>
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

    //const res = await axios.get("/api/users/fuzzy-search");
    //const allUsersData = await res.data;

    /*const userByEmail = await axios.get(
        "/api/users/users-mongoose/" + session.user.email
    );
    const ownerData = await userByEmail.data.data;*/
    await dbConnect();
    //let trees = [];

    /*Users.findOne({ email: session.user.email }, function (err, user) {
        FamilyTrees.find(
            { owner: user._id.toString() },
            async function (err, docs) {
                trees = await docs;
            }
        );
    });*/
    const user = await Users.findOne({ email: session.user.email });
    const trees = await FamilyTrees.find({ owner: user._id.toString() });

    //trees i'm in
    const treesImIn = await TreeMembers.find({ id: user._id.toString() });
    const treesImInIds = treesImIn.map((t) => {
        return ObjectId(t.treeId);
    });
    const treesImInData = await FamilyTrees.find({
        _id: { $in: treesImInIds },
    });
    //console.log("trees im in", treesImInData);

    //collaborations
    const myCollabs = await Collabs.find({ userId: user._id.toString() });
    const myCollabsIds = myCollabs.map((c) => {
        return ObjectId(c.treeId);
    });
    const myCollabsTrees = await FamilyTrees.find({
        _id: { $in: myCollabsIds },
    });
    console.log("my collabs", myCollabsTrees);

    //unclaimed accounts
    const unclaimedProfiles = await Users.find({
        owner: user._id.toString(),
    });
    console.log("unclaimed profilesss", unclaimedProfiles);

    const treesData = JSON.parse(JSON.stringify(trees));
    const ownerData = JSON.parse(JSON.stringify(user));
    const treesImInData2 = JSON.parse(JSON.stringify(treesImInData));
    const myCollabsTrees2 = JSON.parse(JSON.stringify(myCollabsTrees));
    const unclaimedProfiles2 = JSON.parse(JSON.stringify(unclaimedProfiles));
    //console.log(trees);
    //console.log(ownerData);

    //console.log("these be the trees", trees);

    return {
        props: {
            session,
            //allUsersData,
            ownerData,
            treesData,
            treesImInData2,
            myCollabsTrees2,
            unclaimedProfiles2,
        },
    };
}
