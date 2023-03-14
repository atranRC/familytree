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
import FamilyTrees from "../../../models/FamilyTrees";
import TreeMembers from "../../../models/TreeMembers";
import Users from "../../../models/Users";
import { authOptions } from "../../api/auth/[...nextauth]";

export default function TreesImInPage({ ownerData, treesImInData2 }) {
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

    const treesImInrows = treesImInData2.map((tree) => {
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

    return (
        <AppShellContainer>
            <TreePageTitleSection picUrl="https://img.freepik.com/free-vector/job-interview-process-hiring-new-employees-hr-specialist-cartoon-character-talking-new-candidatee-recruitment-employment-headhunting_335657-2680.jpg">
                <Title order={2} fw={600}>
                    Trees I'm In
                </Title>
                <Title order={5} fw={400} color="dimmed">
                    Family Trees you've been added to
                </Title>
            </TreePageTitleSection>
            <MediaQuery smallerThan="sm" styles={{ padding: "0px" }}>
                <Paper withBorder p="md" bg="white">
                    <TreesNav activePage={"trees-im-in"} />

                    <Paper withBorder p="md" bg="#f7f9fc" mt="md">
                        <Table striped highlightOnHover withBorder bg="white">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Description</th>
                                    <th>Privacy</th>
                                </tr>
                            </thead>
                            <tbody>{treesImInrows}</tbody>
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

    const treesImIn = await TreeMembers.find({ id: user._id.toString() });
    const treesImInIds = treesImIn.map((t) => {
        return ObjectId(t.treeId);
    });
    const treesImInData = await FamilyTrees.find({
        _id: { $in: treesImInIds },
    });

    const treesImInData2 = JSON.parse(JSON.stringify(treesImInData));
    const ownerData = JSON.parse(JSON.stringify(user));

    return {
        props: {
            session,
            ownerData,
            treesImInData2,
        },
    };
}
