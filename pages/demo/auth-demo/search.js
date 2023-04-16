/*
    on sign in, redirect user to a custom page where they can add info about themselves
*/

import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../../api/auth/[...nextauth]";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import AppShellContainer from "../../../components/appShell";
import {
    Button,
    Title,
    Text,
    ActionIcon,
    TextInput,
    Group,
    Stack,
    createStyles,
    Tabs,
    Container,
    Paper,
    MediaQuery,
    ScrollArea,
    Avatar,
    Loader,
    SimpleGrid,
    Modal,
    Drawer,
    ThemeIcon,
    Image,
} from "@mantine/core";
import { ResponsiveNav } from "../../../components/navBar";
import { IconGlobe, IconSearch, IconUsers } from "@tabler/icons";
import { useState } from "react";
import * as Realm from "realm-web";
import {
    SearchPageSearchResults,
    SearchResultUserCard,
} from "../../../components/userSearchResult";
import NoAccounts from "../../../components/noResult";
import { ModalUserInfo } from "../../../components/userSearchResult";
import axios from "axios";
import { AllRelativesTab } from "../../../components/searchPageTabs";

export default function Search({ allUsersData, ownerData }) {
    const { data: session } = useSession();
    console.log(session);
    //console.log("owner: ", ownerData);

    const useStyles = createStyles((theme) => ({
        search: {
            borderRadius: "10px",
            marginTop: "10px",
            marginLeft: "30px",
            marginRight: "30px",
            padding: "5px",
        },
        searchSmall: {
            margin: "0px",
        },
        searchBar: {
            width: "50%",
            alignSelf: "center",
            "&:focus-within": {
                boxShadow:
                    "rgba(50, 50, 93, 0.25) 0px 30px 60px -12px, rgba(0, 0, 0, 0.3) 0px 18px 36px -18px",
                transition: "0.5s",
            },
        },
        searchButton: {
            "&:hover": {
                border: "1px solid lightgray",
                transition: "0.2s",
            },
        },
        searchResult: {
            marginTop: "30px",
            height: "100%",
        },
        right: {
            border: "2px solid black",
            marginTop: "10px",
            padding: "5px",
        },
    }));

    const { classes } = useStyles();

    const [searchTerm, setSearchTerm] = useState("");
    const [searchResult, setSearchResult] = useState();
    const [userToView, setUserToView] = useState();
    const [allTabUserToView, setAllTabUserToView] = useState();
    const [isSearching, setIsSearching] = useState(false);
    const [opened, setOpened] = useState(false);

    const handleSearch = async () => {
        setIsSearching(true);
        const APP_ID = "users-app-pwqpx";
        const app = new Realm.App({ id: APP_ID });
        const credentials = Realm.Credentials.anonymous();
        try {
            const user = await app.logIn(credentials);
            const allUsers = await user.functions.searchUsers(searchTerm);
            console.log("yuzzi", allUsers);
            setSearchResult(allUsers);
            setIsSearching(false);
        } catch (err) {
            console.log(err);
        }
        //console.log(searchTerm);
        //setSearchResult([]);
    };

    return (
        <AppShellContainer>
            <Paper mb="md" p="md" withBorder>
                <Group mb="md">
                    <Avatar src={session.user.image} radius="xl" size="lg" />
                    <Stack spacing={0}>
                        <Title>My Relatives</Title>
                        <Text>Signed In as {session.user.email}</Text>

                        <Text>
                            <Link
                                href="/api/auth/signout"
                                onClick={(e) => {
                                    e.preventDefault();
                                    signOut();
                                }}
                            >
                                signout
                            </Link>
                        </Text>
                    </Stack>
                </Group>
            </Paper>
            <MediaQuery
                largerThan="sm"
                styles={{
                    display: "none",
                }}
            >
                <Drawer
                    opened={opened}
                    onClose={() => {
                        setOpened(false);
                        setUserToView({});
                    }}
                    title="Register"
                    padding="xl"
                    size="100vh"
                    position="bottom"
                    lockScroll={false}
                >
                    <ModalUserInfo
                        user={userToView ? userToView : allTabUserToView}
                    />
                </Drawer>
            </MediaQuery>
            <MediaQuery smallerThan="sm" styles={{ padding: "20px" }}>
                <Paper withBorder p="xl" style={{ minHeight: "100vh" }}>
                    <Tabs
                        keepMounted={false}
                        defaultValue="all"
                        variant="outline"
                    >
                        <Tabs.List grow position="center">
                            <Tabs.Tab
                                value="all"
                                icon={
                                    <IconUsers color="lightblue" size="20px" />
                                }
                            >
                                All
                            </Tabs.Tab>
                            <Tabs.Tab
                                value="suggestion"
                                icon={
                                    <IconGlobe color="lightblue" size="20px" />
                                }
                            >
                                Suggestions
                            </Tabs.Tab>
                            <Tabs.Tab
                                value="search"
                                icon={
                                    <IconSearch color="lightblue" size="20px" />
                                }
                            >
                                Search
                            </Tabs.Tab>
                        </Tabs.List>
                        <Tabs.Panel value="all">
                            <AllRelativesTab
                                users={allUsersData.data}
                                setModalOpened={setOpened}
                                setUserToView={setAllTabUserToView}
                                userToView={allTabUserToView}
                            />
                        </Tabs.Panel>
                        <Tabs.Panel value="suggestion">
                            Suggestions
                            <Stack className={classes.right}>
                                <Text></Text>
                            </Stack>
                        </Tabs.Panel>
                        <Tabs.Panel value="search">
                            <MediaQuery
                                smallerThan="sm"
                                styles={{
                                    marginTop: "10px",
                                    marginLeft: "0px",
                                    marginRight: "0px",
                                }}
                            >
                                <Stack className={classes.search} pt="md">
                                    <Title
                                        order={2}
                                        fw={500}
                                        align="center"
                                        mt="md"
                                        color="blue"
                                    >
                                        Look for a relative
                                    </Title>
                                    <MediaQuery
                                        smallerThan="sm"
                                        styles={{ width: "90%" }}
                                    >
                                        <TextInput
                                            placeholder="relative's name"
                                            radius="xl"
                                            mt="md"
                                            rightSection={
                                                <IconSearch
                                                    size={20}
                                                    color="skyblue"
                                                />
                                            }
                                            className={classes.searchBar}
                                            value={searchTerm}
                                            onChange={(e) =>
                                                setSearchTerm(e.target.value)
                                            }
                                        />
                                    </MediaQuery>
                                    <Container size="sm">
                                        <Button
                                            className={classes.searchButton}
                                            variant="light"
                                            radius="xl"
                                            size="sm"
                                            align="center"
                                            uppercase
                                            onClick={handleSearch}
                                        >
                                            search
                                        </Button>
                                    </Container>

                                    <ScrollArea
                                        className={classes.searchResult}
                                    >
                                        <Stack align="center" pb={50}>
                                            {isSearching ? (
                                                <>
                                                    <Loader />
                                                    <Title
                                                        c="dimmed"
                                                        fw={500}
                                                        order={5}
                                                        align="center"
                                                    >
                                                        Looking for matching
                                                        results...
                                                    </Title>
                                                </>
                                            ) : (
                                                <>
                                                    {searchResult ? (
                                                        <>
                                                            {searchResult.length >
                                                            0 ? (
                                                                <SearchPageSearchResults
                                                                    users={
                                                                        searchResult
                                                                    }
                                                                    setModalOpened={
                                                                        setOpened
                                                                    }
                                                                    setUserToView={
                                                                        setUserToView
                                                                    }
                                                                    userToView={
                                                                        userToView
                                                                    }
                                                                />
                                                            ) : (
                                                                <NoAccounts
                                                                    searchTerm={
                                                                        searchTerm
                                                                    }
                                                                />
                                                            )}
                                                        </>
                                                    ) : (
                                                        <>
                                                            <ThemeIcon
                                                                color="dimmed"
                                                                radius="xl"
                                                                size={300}
                                                            >
                                                                <Image
                                                                    p={10}
                                                                    src="https://img.freepik.com/free-vector/where-concept-illustration_114360-8953.jpg"
                                                                />
                                                            </ThemeIcon>
                                                            <Title
                                                                c="skyblue"
                                                                fw={500}
                                                                order={3}
                                                                align="center"
                                                            >
                                                                Type a
                                                                relative&apos;s
                                                                name and
                                                                matching results
                                                                will appear
                                                                here.
                                                            </Title>
                                                            <Text
                                                                c="dimmed"
                                                                fw={500}
                                                                order={5}
                                                                align="center"
                                                                mb="sm"
                                                            >
                                                                Click on the
                                                                relative
                                                                you&apos;re
                                                                looking for to
                                                                view their
                                                                information and
                                                                send them a
                                                                request.
                                                            </Text>
                                                        </>
                                                    )}
                                                </>
                                            )}
                                        </Stack>
                                    </ScrollArea>
                                </Stack>
                            </MediaQuery>
                        </Tabs.Panel>
                    </Tabs>
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

    const res = await axios.get(
        process.env.API_BASE_URL + "api/users/fuzzy-search"
    );
    const allUsersData = await res.data;

    const userByEmail = await axios.get(
        process.env.API_BASE_URL +
            "api/users/users-mongoose/" +
            session.user.email
    );
    const ownerData = await userByEmail.data.data;
    console.log("email", ownerData.name);

    return {
        props: {
            session,
            allUsersData,
            ownerData,
        },
    };
}
