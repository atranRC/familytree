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
    Badge,
    SimpleGrid,
    Stack,
    Title,
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
import TigrayWikiLogo from "../TigrayWikiLogo";

export function ShellWithAside({ children, page }) {
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
                                        className={classes.navLink}
                                        disabled
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
                                            href="/martyrs"
                                            style={{ textDecoration: "none" }}
                                            //rel="noopener noreferrer"
                                            //target="_blank"
                                        >
                                            <NavLink
                                                label="Martyrs"
                                                className={classes.navSub}
                                            />
                                        </Link>
                                        <Link
                                            href="/wiki/people/tag/hero"
                                            style={{ textDecoration: "none" }}
                                            rel="noopener noreferrer"
                                            target="_blank"
                                        >
                                            <NavLink
                                                label="Heroes"
                                                className={classes.navSub}
                                            />
                                        </Link>
                                        <Link
                                            href="/wiki/people/tag/public_figure"
                                            style={{ textDecoration: "none" }}
                                            rel="noopener noreferrer"
                                            target="_blank"
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
            aside={
                <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
                    <Aside
                        p="md"
                        hiddenBreakpoint="sm"
                        width={{ sm: 200, lg: 300 }}
                        zIndex={99}
                    >
                        {page === "people" && <AsideContentForPeople />}
                        {page === "artefacts" && <AsideContentForArtefacts />}
                    </Aside>
                </MediaQuery>
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
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                height: "100%",
                                width: "100%",
                            }}
                        >
                            <div
                                style={{
                                    flexGrow: 1,
                                    display: "flex",
                                }}
                            >
                                <TigrayWikiLogo />
                            </div>

                            {/*<h1>
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
                            </h1>*/}

                            <MediaQuery
                                smallerThan="sm"
                                styles={{ display: "none" }}
                            >
                                <TextInput
                                    sx={{ flexGrow: 1.5 }}
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
                                            flexGrow: 1,
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
                                            flexGrow: 1,
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
                        </div>
                    </div>
                </Header>
            }
        >
            {children}
        </AppShell>
    );
}

function AsideContentForPeople() {
    const useStyles = createStyles((theme) => ({
        tag: {
            "&:hover": {
                //border: "1px solid",
                textDecoration: "underline",
                transition: "0.2s",
                transform: "scale(1.1)",
                cursor: "pointer",
            },
        },
    }));
    const { classes } = useStyles();

    return (
        <Stack>
            <Text c="dimmed">Discover the people of Tigray</Text>
            <Group>
                <Badge
                    className={classes.tag}
                    //m="sm"
                    size="lg"
                    variant="gradient"
                    gradient={{ from: "indigo", to: "cyan" }}
                >
                    <Link
                        href="/wiki/people/tag/hero"
                        rel="noopener noreferrer"
                        target="_blank"
                    >
                        Heros
                    </Link>
                </Badge>
                <Badge
                    className={classes.tag}
                    //m="sm"
                    size="lg"
                    variant="gradient"
                    gradient={{ from: "teal", to: "lime", deg: 105 }}
                >
                    <Link
                        href="/wiki/people/tag/martyr"
                        rel="noopener noreferrer"
                        target="_blank"
                    >
                        Martyrs
                    </Link>
                </Badge>
                <Badge
                    className={classes.tag}
                    //m="sm"
                    size="lg"
                    variant="gradient"
                    gradient={{ from: "teal", to: "blue", deg: 60 }}
                >
                    <Link
                        href="/wiki/people/tag/public_figure"
                        rel="noopener noreferrer"
                        target="_blank"
                    >
                        Public Figures
                    </Link>
                </Badge>
            </Group>
        </Stack>
    );
}

function AsideContentForArtefacts() {
    return <div>aside for artefacts</div>;
}
