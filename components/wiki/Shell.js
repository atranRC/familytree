import { useState } from "react";
import {
    AppShell,
    Navbar,
    Header,
    Footer,
    Aside,
    Text,
    MediaQuery,
    Burger,
    useMantineTheme,
    NavLink,
    Box,
    Paper,
    Transition,
    createStyles,
    ScrollArea,
    Divider,
    Group,
    TextInput,
    ActionIcon,
    Menu,
    Avatar,
    Grid,
} from "@mantine/core";
import {
    IconAbc,
    IconAt,
    IconCalendarEvent,
    IconCaretDown,
    IconClock,
    IconClock2,
    IconFingerprint,
    IconFriends,
    IconGauge,
    IconGrowth,
    IconHistory,
    IconHome,
    IconLogin,
    IconMap2,
    IconMicrophone,
    IconNews,
    IconPencil,
    IconPlus,
    IconSearch,
    IconShare,
    IconTrash,
    IconUserPlus,
    IconWriting,
} from "@tabler/icons";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { AvatarMenuContent, AvatarWithMenu } from "../navBar";
import { useRouter } from "next/router";

export function Shell({ children }) {
    const useStyles = createStyles((theme) => ({
        navLink: {
            textDecoration: "none",
            "&:hover": {
                //border: "1px solid",
                textDecoration: "underline",
                transition: "0.5s",
            },
        },
        navSub: {
            textDecoration: "none",
            "&:hover": {
                //border: "1px solid",
                textDecoration: "underline",
                transition: "0.5s",
                color: "darkblue",
            },
            color: theme.colors.gray[7],
        },
    }));
    const router = useRouter();
    const { classes } = useStyles();
    const theme = useMantineTheme();
    const { data: session, status } = useSession();
    const [opened, setOpened] = useState(false);
    const [showNavbar, setShowNavbar] = useState(true);
    const [avatarOpened, setAvatarOpened] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    {
        /*<div>
            {" "}
            <Link href="/timeline">Go to timeline</Link>
        </div>*/
    }
    return (
        <AppShell
            styles={{
                main: {
                    background:
                        theme.colorScheme === "dark"
                            ? theme.colors.dark[8]
                            : theme.colors.gray[-1],
                },
            }}
            navbarOffsetBreakpoint="sm"
            asideOffsetBreakpoint="sm"
            navbar={
                <Transition
                    mounted={showNavbar}
                    transition="slide-right"
                    duration={300}
                    timingFunction="ease"
                >
                    {(styles) => (
                        <Navbar
                            p="md"
                            hiddenBreakpoint="sm"
                            hidden={!opened}
                            width={{ sm: 200, lg: 200 }}
                            style={styles}
                            sx={{ zIndex: 99 }}
                        >
                            <Navbar.Section grow component={ScrollArea}>
                                <MediaQuery
                                    largerThan="sm"
                                    styles={{ display: "none" }}
                                >
                                    <TextInput
                                        placeholder="Search TigrayWiki"
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.currentTarget.value)
                                        }
                                        onKeyDown={(e) => {
                                            if (e.code == "Enter") {
                                                window.location.replace(
                                                    `/timeline/search?searchTerm=${searchTerm}`
                                                );
                                            }
                                        }}
                                        rightSection={
                                            <ActionIcon
                                                //variant="filled"
                                                radius="xl"
                                                disabled={searchTerm.length < 1}
                                                onClick={() => {
                                                    window.location.replace(
                                                        `/timeline/search?searchTerm=${searchTerm}`
                                                    );
                                                }}
                                            >
                                                <IconSearch size={18} />{" "}
                                            </ActionIcon>
                                        }
                                        c="blue"
                                    />
                                </MediaQuery>
                                <Divider
                                    label="Navigate"
                                    labelPosition="center"
                                    m={2}
                                    c={theme.colors.gray[5]}
                                />
                                <Paper w="100%" withBorder bg="#f9fcfe">
                                    <Link
                                        href="/"
                                        style={{ textDecoration: "none" }}
                                    >
                                        <NavLink
                                            label="Front Page"
                                            icon={
                                                <IconHome
                                                    size="20px"
                                                    color="lightgreen"
                                                />
                                            }
                                            c="indigo"
                                            className={classes.navLink}
                                        />
                                    </Link>
                                    <NavLink
                                        label="Timelines"
                                        icon={
                                            <IconHistory
                                                size="20px"
                                                color="orange"
                                            />
                                        }
                                        childrenOffset={28}
                                        c="indigo"
                                        defaultOpened
                                    >
                                        <Link
                                            href="/timeline?tag=gen"
                                            style={{ textDecoration: "none" }}
                                        >
                                            <NavLink
                                                label="Tigray Genocide"
                                                className={classes.navSub}
                                            />
                                        </Link>
                                        <Link
                                            href="/timeline?tag=his"
                                            style={{ textDecoration: "none" }}
                                        >
                                            <NavLink
                                                label="Historical Events"
                                                className={classes.navSub}
                                            />
                                        </Link>
                                    </NavLink>

                                    <NavLink
                                        label="Articles"
                                        icon={
                                            <IconWriting
                                                size="20px"
                                                color="green"
                                            />
                                        }
                                        childrenOffset={28}
                                        c="indigo"
                                    >
                                        <NavLink
                                            label="Culture"
                                            className={classes.navSub}
                                            disabled
                                        />

                                        <NavLink
                                            label="Arts"
                                            className={classes.navSub}
                                            disabled
                                        />

                                        <NavLink
                                            label="Civilization"
                                            className={classes.navSub}
                                            disabled
                                        />
                                        <NavLink
                                            label="Geography"
                                            className={classes.navSub}
                                            disabled
                                        />
                                    </NavLink>

                                    <NavLink
                                        label="News"
                                        icon={
                                            <IconNews
                                                size="20px"
                                                color="teal"
                                            />
                                        }
                                        c="indigo"
                                        disabled
                                        className={classes.navLink}
                                    />

                                    <NavLink
                                        label="People"
                                        icon={
                                            <IconFriends
                                                size="20px"
                                                stroke={1.5}
                                                color="red"
                                            />
                                        }
                                        childrenOffset={28}
                                        c="indigo"
                                        className={classes.navSub}
                                        defaultOpened
                                    >
                                        <Link
                                            href="/wiki/people"
                                            style={{ textDecoration: "none" }}
                                        >
                                            <NavLink
                                                label="All"
                                                className={classes.navSub}
                                            />
                                        </Link>
                                        <Link
                                            href="/wiki/people/tag/martyr"
                                            style={{ textDecoration: "none" }}
                                        >
                                            <NavLink
                                                label="Martyrs"
                                                className={classes.navSub}
                                            />
                                        </Link>
                                        <Link
                                            href="/wiki/people/tag/hero"
                                            style={{ textDecoration: "none" }}
                                        >
                                            <NavLink
                                                label="Heroes"
                                                className={classes.navSub}
                                            />
                                        </Link>
                                        <Link
                                            href="/wiki/people/tag/public_figure"
                                            style={{ textDecoration: "none" }}
                                        >
                                            <NavLink
                                                label="Public Figures"
                                                className={classes.navSub}
                                            />
                                        </Link>
                                    </NavLink>
                                </Paper>
                            </Navbar.Section>
                            <Navbar.Section>
                                {/*<div>hello</div>*/}
                            </Navbar.Section>
                        </Navbar>
                    )}
                </Transition>
            }
            header={
                <Header height={{ base: 50, md: 70 }} p="md">
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            height: "100%",
                            width: "100%",
                        }}
                    >
                        <MediaQuery
                            largerThan="sm"
                            styles={{ display: "none" }}
                        >
                            <Burger
                                opened={opened}
                                onClick={() => {
                                    setShowNavbar(true);
                                    setOpened((o) => !o);
                                }}
                                size="sm"
                                color={theme.colors.gray[6]}
                                mr="xl"
                            />
                        </MediaQuery>
                        <MediaQuery
                            smallerThan="sm"
                            styles={{ display: "none" }}
                        >
                            <Burger
                                opened={showNavbar}
                                onClick={() => {
                                    setShowNavbar(!showNavbar);
                                    //setOpened((o) => !o);
                                }}
                                mr={20}
                            />
                        </MediaQuery>
                        <Group grow w="100%">
                            <h1>
                                <span
                                    style={{
                                        color: "red",
                                        fontFamily: "'Abhaya Libre', serif",
                                        fontWeight: 950,
                                        WebkitTextStroke: "0.5px red",
                                    }}
                                >
                                    Tigray
                                </span>

                                <span
                                    style={{
                                        color: "yellow",
                                        fontFamily: "'Abhaya Libre', serif",
                                        fontWeight: 500,
                                        WebkitTextStroke: "0.3px red",
                                    }}
                                >
                                    Wiki
                                </span>
                            </h1>

                            <MediaQuery
                                smallerThan="sm"
                                styles={{ display: "none" }}
                            >
                                <TextInput
                                    placeholder="Search TigrayWiki"
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.currentTarget.value)
                                    }
                                    onKeyDown={(e) => {
                                        if (e.code == "Enter") {
                                            window.location.replace(
                                                `/timeline/search?searchTerm=${searchTerm}`
                                            );
                                        }
                                    }}
                                    rightSection={
                                        <ActionIcon
                                            variant="outline"
                                            radius="xl"
                                            color="blue"
                                            disabled={searchTerm.length < 1}
                                            onClick={() => {
                                                window.location.replace(
                                                    `/timeline/search?searchTerm=${searchTerm}`
                                                );
                                            }}
                                        >
                                            <IconSearch size={18} />{" "}
                                        </ActionIcon>
                                    }
                                    color="blue"
                                />
                            </MediaQuery>

                            {session ? (
                                <MediaQuery
                                    smallerThan="sm"
                                    styles={{
                                        display: "none",
                                        marginLeft: "100px",
                                    }}
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "row-reverse",
                                        }}
                                    >
                                        <AvatarWithMenu />
                                    </div>
                                </MediaQuery>
                            ) : (
                                <MediaQuery
                                    smallerThan="sm"
                                    styles={{ display: "none" }}
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "row-reverse",
                                        }}
                                    >
                                        <Group
                                            spacing={0}
                                            onClick={() => signIn()}
                                        >
                                            Login
                                            <IconLogin />
                                        </Group>
                                    </div>
                                </MediaQuery>
                            )}
                        </Group>
                    </div>
                </Header>
            }
        >
            {children}
        </AppShell>
    );
}
