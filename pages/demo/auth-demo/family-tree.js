import { authOptions } from "../../api/auth/[...nextauth]";
import {
    Button,
    Divider,
    Drawer,
    Group,
    MediaQuery,
    Paper,
    Title,
    Text,
} from "@mantine/core";
import AppShellContainer from "../../../components/appShell";
import { unstable_getServerSession } from "next-auth";
import axios from "axios";
import { TitleSection } from "../../../components/titleSections";
import { useState } from "react";

import { FamtreePageContext } from "../../../contexts/contexts";
import {
    SelectTreeMemberToViewOrAddPrompt,
    TreeIsEmptyPrompt,
} from "../../../components/empty_section_prompts/emptySectionPrompts";
import { FamtreePageTabbedSection } from "../../../components/tabbed_sections/famTreePageTabbedSection";
import useFamTreePageStore from "../../../lib/stores/famtreePageStore";

export default function Familytree({ ownerData, treeData }) {
    const drawerOpened = useFamTreePageStore((state) => state.drawerOpened);
    const setDrawerOpened = useFamTreePageStore(
        (state) => state.setDrawerOpened
    );
    const selectedTreeMember = useFamTreePageStore(
        (state) => state.selectedTreeMember
    );
    const newRelativeChosenMethod = useFamTreePageStore(
        (state) => state.newRelativeChosenMethod
    );

    const handleNewRelativeNotFound = () => {
        if (newRelativeChosenMethod === "email") {
            setActiveStep(0);
        } else {
            //upload new relative method here
        }
    };
    const logFname = useFamTreePageStore((state) => state.printFirstName);
    return (
        <FamtreePageContext.Provider value={ownerData}>
            <AppShellContainer>
                <TitleSection>
                    <Title>{ownerData.name}&apos;s Family Tree</Title>
                    <Button onClick={() => console.log(drawerOpened)}>
                        drawer
                    </Button>
                </TitleSection>
                <MediaQuery smallerThan="sm" styles={{ padding: "0px" }}>
                    <Paper
                        withBorder
                        p="md"
                        style={{
                            minHeight: "100vh",
                            display: "flex",
                            alignItems: "stretch",
                        }}
                        bg="#f7f9fc"
                    >
                        <Group
                            position="apart"
                            mih="100vh"
                            style={{
                                display: "flex",
                                flexGrow: "1",
                            }}
                        >
                            <MediaQuery
                                smallerThan="sm"
                                styles={{ minWidth: "100%" }}
                            >
                                <Paper
                                    withBorder
                                    maw="50%"
                                    miw="50%"
                                    p="md"
                                    radius="md"
                                    style={{
                                        minHeight: "100%",
                                    }}
                                >
                                    <Title
                                        p="md"
                                        order={2}
                                        fw={550}
                                        color="dimmed"
                                    >
                                        Family Tree
                                    </Title>

                                    {treeData.length !== 0 ? (
                                        <Text>Displaying tree</Text>
                                    ) : (
                                        <TreeIsEmptyPrompt />
                                    )}
                                </Paper>
                            </MediaQuery>
                            <Divider
                                orientation="vertical"
                                size="xs"
                                c="white"
                            />
                            <MediaQuery
                                smallerThan="sm"
                                styles={{ display: "none" }}
                            >
                                <Paper
                                    withBorder
                                    maw="45%"
                                    miw="45%"
                                    p="md"
                                    radius="md"
                                    style={{
                                        minHeight: "100vh",
                                    }}
                                >
                                    <Title
                                        p="md"
                                        order={2}
                                        fw={550}
                                        color="dimmed"
                                    >
                                        Family Member Info
                                    </Title>

                                    {selectedTreeMember ? (
                                        <FamtreePageTabbedSection />
                                    ) : (
                                        <SelectTreeMemberToViewOrAddPrompt />
                                    )}
                                </Paper>
                            </MediaQuery>
                        </Group>
                    </Paper>
                </MediaQuery>
                <MediaQuery largerThan="sm" styles={{ display: "none" }}>
                    <Drawer
                        opened={drawerOpened}
                        onClose={() => setDrawerOpened(false)}
                        title="Register"
                        padding="md"
                        size="100vh"
                        position="bottom"
                        lockScroll={false}
                    >
                        <Title>Hello there!</Title>
                    </Drawer>
                </MediaQuery>
            </AppShellContainer>
        </FamtreePageContext.Provider>
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

    //const res = await axios.get("http://localhost:3000/api/users/fuzzy-search");
    //const allUsersData = await res.data;

    /*const userByEmail = await axios.get(
        "http://localhost:3000/api/users/users-mongoose/" + session.user.email
    );
    const ownerData = await userByEmail.data.data;*/
    const treeDataRes = await axios.get(
        process.env.API_BASE_URL + "/api/users/tree-data/" + session.user.email
    );
    const treeData = await treeDataRes.data.data.docs;
    const ownerData = await treeDataRes.data.data.ownerData;
    // fetch tree data here
    console.log("email", ownerData.name);
    console.log("ownertree", treeData);

    return {
        props: {
            session,
            //allUsersData,
            ownerData,
            treeData,
        },
    };
}
