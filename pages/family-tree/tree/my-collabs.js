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
import { ObjectId } from "mongodb";
import { unstable_getServerSession } from "next-auth";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useQuery } from "react-query";
import AppShellContainer from "../../../components/appShell";
import { TreePageTitleSection } from "../../../components/titleSections";
import TreesNav from "../../../components/tree-page/modals/navigation/treePageNav";
import dbConnect from "../../../lib/dbConnect";
import Collabs from "../../../models/Collabs";
import FamilyTrees from "../../../models/FamilyTrees";
import Users from "../../../models/Users";
import { authOptions } from "../../api/auth/[...nextauth]";

export default function MyCollabsPage({ ownerData, myCollabsTrees2 }) {
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

    const myCollabsTreesRows = myCollabsTrees2.map((tree) => {
        let color = "green";
        if (tree.privacy === "private") {
            color = "blue";
        }
        return (
            <tr key={tree._id.toString()}>
                <td>
                    <Link
                        //href={"/family-tree/tree/" + tree._id.toString()}
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
            </tr>
        );
    });

    return (
        <AppShellContainer>
            <TreePageTitleSection picUrl="https://img.freepik.com/free-vector/business-team-putting-together-jigsaw-puzzle-isolated-flat-vector-illustration-cartoon-partners-working-connection-teamwork-partnership-cooperation-concept_74855-9814.jpg">
                <Title order={2} fw={600}>
                    My Collaborations
                </Title>
                <Title order={5} fw={400} color="dimmed">
                    Trees you&apos;ve been invited to collaborate on
                </Title>
            </TreePageTitleSection>
            <MediaQuery smallerThan="sm" styles={{ padding: "0px" }}>
                <Paper withBorder p="md" bg="white">
                    <TreesNav activePage={"my-collabs"} />

                    <Paper withBorder p="md" bg="#f7f9fc" mt="md">
                        <Table striped highlightOnHover withBorder bg="white">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Description</th>
                                    <th>Privacy</th>
                                </tr>
                            </thead>
                            <tbody>{myCollabsTreesRows}</tbody>
                        </Table>
                    </Paper>
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

    const myCollabs = await Collabs.find({ userId: user._id.toString() });
    const myCollabsIds = myCollabs.map((c) => {
        return ObjectId(c.treeId);
    });
    const myCollabsTrees = await FamilyTrees.find({
        _id: { $in: myCollabsIds },
    });
    console.log("my collabs", myCollabsTrees);

    const myCollabsTrees2 = JSON.parse(JSON.stringify(myCollabsTrees));
    const ownerData = JSON.parse(JSON.stringify(user));

    return {
        props: {
            session,
            ownerData,
            myCollabsTrees2,
        },
    };
}
