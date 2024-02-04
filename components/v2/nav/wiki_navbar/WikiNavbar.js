import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import {
    createStyles,
    Header,
    Container,
    Group,
    Burger,
    Paper,
    Transition,
    Avatar,
    Menu,
    Text,
    ActionIcon,
    Title,
    Loader,
    MediaQuery,
    Drawer,
    Box,
    NavLink,
    Divider,
    TextInput,
} from "@mantine/core";
import {
    IconSettings,
    IconMessageCircle,
    IconPhoto,
    IconSearch,
    IconArrowsLeftRight,
    IconTrash,
    IconBell,
    IconLogout,
    IconUser,
    IconLogin,
    IconMenu,
    IconMenu2,
    IconTimeline,
    IconMap,
    IconTrees,
    IconHome,
    IconHistory,
    IconWriting,
    IconFriends,
    IconStar,
} from "@tabler/icons";
import { useDisclosure } from "@mantine/hooks";
import { useQuery } from "react-query";
import axios from "axios";
import { useRouter } from "next/router";
import FamilyTreeLogo from "../../../FamilyTreeLogo";
import TigrayWikiLogo from "../../../TigrayWikiLogo";
//import { AvatarWithMenu } from "../../../navBar";
import { AvatarWithMenu } from "../profile_navbar/ProfileNavBar";
const HEADER_HEIGHT = 60;

const useStyles = createStyles((theme, { activeLink }) => ({
    root: {
        paddingLeft: "3em",
        paddingRight: "3em",
        backgroundColor: "#F8F9FA",
        "@media (max-width: 800px)": {
            //fontSize: "1.5rem",
            //marginBottom: "-1rem",
            //display: "none",
            paddingLeft: "1em",
            paddingRight: "1em",
        },
        //border: `1px solid black`,
        position: "fixed",
        top: 0,
        width: "100%",
        transition: "display .5s ",
        zIndex: 99,
    },
    navCont: {
        display: "flex",
        //justifyContent: "space-between",
        alignItems: "center",
        //borderBottom: `3px solid white`,
        gap: "2em",
        //border: `1px solid black`,
        height: "60px",
        "@media (max-width: 800px)": {
            //fontSize: "1.5rem",
            //marginBottom: "-1rem",
            justifyContent: "space-between",
        },
    },
    burgerMenu: {
        color: "#02494d",
        //border: `1px solid black`,
        display: "flex",
        paddingTop: "5px",
        //flexDirection: "column-reversed",
        /*"@media (min-width: 800px)": {
            //fontSize: "1.5rem",
            //marginBottom: "-1rem",
            display: "none",
        },*/
    },
    logo: {
        flexShrink: 0,
        border: `1px solid black`,
        //padding: "1em",
        //alignSelf: "flex-start",
    },
    searchBar: {
        marginLeft: "3em",
        marginRight: "auto",
        width: "500px",
        "@media (max-width: 800px)": {
            //fontSize: "1.5rem",
            //marginBottom: "-1rem",
            display: "none",
        },
    },
    menuSearchBar: {
        //marginLeft: "auto",
        //marginRight: "auto",
        //width: "100%",
        "@media (min-width: 800px)": {
            //fontSize: "1.5rem",
            //marginBottom: "-1rem",
            display: "none",
        },
    },
    profile: {
        //border: `1px solid black`,
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
        //padding: "1em",
    },

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
        //color: "lightgray",
    },
}));

export default function WikiNavBar({ activeLink, searchPage = "wiki" }) {
    const [isMenuOpened, setIsMenuOpened] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [prevScrollPos, setPrevScrollPos] = useState(0);
    const [isVisible, setIsVisible] = useState(true);
    const { classes } = useStyles({ activeLink });

    const router = useRouter();

    //https://stackoverflow.com/a/73550530
    const handleScroll = useCallback(() => {
        const currentScrollPos = window.scrollY;

        if (currentScrollPos > prevScrollPos) {
            setIsVisible(false);
        } else {
            setIsVisible(true);
        }

        setPrevScrollPos(currentScrollPos);

        /*const shouldBeVisible = scroll <= 100;
        if (shouldBeVisible === isVisible) return;
        setIsVisible(shouldBeVisible);*/
    }, [isVisible, prevScrollPos]);

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [handleScroll]);

    return (
        <div
            className={classes.root}
            style={{
                /*display: isVisible ? "" : "none"*/
                visibility: isVisible ? "visible" : "hidden",
                opacity: isVisible ? 1 : 0,
                transition: "visibility 0.1s, opacity 0.1s linear",
            }}
        >
            <div className={classes.navCont}>
                <div className={classes.burgerMenu}>
                    <Menu
                        width={200}
                        shadow="md"
                        position="bottom"
                        //closeOnClickOutside={false}
                        onClose={() => setIsMenuOpened(false)}
                    >
                        <Menu.Target>
                            <Burger
                                opened={isMenuOpened}
                                onClick={() => {
                                    setIsMenuOpened(!isMenuOpened);
                                }}
                                size="sm"
                            />
                        </Menu.Target>

                        <Menu.Dropdown sx={{ marginTop: "5px" }}>
                            <TextInput
                                className={classes.menuSearchBar}
                                sx={{ flexGrow: 1.5 }}
                                placeholder="Search TigrayWiki"
                                value={searchTerm}
                                onChange={(e) =>
                                    setSearchTerm(e.currentTarget.value)
                                }
                                onKeyDown={(e) => {
                                    if (e.code == "Enter") {
                                        router.push(
                                            `/search?searchTerm=${searchTerm}&type=${searchPage}`
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
                                            router.push(
                                                `/search?searchTerm=${searchTerm}&type=${searchPage}`
                                            );
                                        }}
                                    >
                                        <IconSearch size={18} />{" "}
                                    </ActionIcon>
                                }
                                color="blue"
                            />
                            <Divider
                                label="Navigate"
                                labelPosition="center"
                                m={2}
                            />
                            <Paper w="100%" withBorder bg="#f9fcfe">
                                <Link
                                    href="/"
                                    style={{ textDecoration: "none" }}
                                >
                                    <NavLink
                                        label="Home"
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
                                        href="/timeline?type=gen"
                                        style={{ textDecoration: "none" }}
                                    >
                                        <NavLink
                                            label="Tigray Genocide"
                                            className={classes.navSub}
                                        />
                                    </Link>
                                    <Link
                                        href="/timeline?type=his"
                                        style={{ textDecoration: "none" }}
                                    >
                                        <NavLink
                                            label="Historical Events"
                                            className={classes.navSub}
                                        />
                                    </Link>
                                </NavLink>

                                <NavLink
                                    label="Wiki"
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
                                        href="/wiki?tag=hero"
                                        style={{ textDecoration: "none" }}
                                    >
                                        <NavLink
                                            label="Heroes"
                                            className={classes.navSub}
                                        />
                                    </Link>

                                    <Link
                                        href="/wiki?tag=public_figure"
                                        style={{ textDecoration: "none" }}
                                    >
                                        <NavLink
                                            label="Public Figures"
                                            className={classes.navSub}
                                        />
                                    </Link>
                                    <Link
                                        href="/wiki?tag=artefact"
                                        style={{ textDecoration: "none" }}
                                    >
                                        <NavLink
                                            label="Artefacts"
                                            className={classes.navSub}
                                        />
                                    </Link>
                                    <Link
                                        href="/wiki?tag=heritage"
                                        style={{ textDecoration: "none" }}
                                    >
                                        <NavLink
                                            label="Heritage"
                                            className={classes.navSub}
                                        />
                                    </Link>
                                </NavLink>
                                <Link
                                    href="/martyrs"
                                    style={{ textDecoration: "none" }}
                                >
                                    <NavLink
                                        label="Martyrs"
                                        icon={
                                            <IconStar size="20px" color="red" />
                                        }
                                        c="indigo"
                                        className={classes.navLink}
                                    />
                                </Link>
                            </Paper>
                        </Menu.Dropdown>
                    </Menu>
                </div>
                <TigrayWikiLogo />

                <TextInput
                    className={classes.searchBar}
                    radius="xl"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.currentTarget.value)}
                    onKeyDown={(e) => {
                        if (e.code == "Enter") {
                            router.push(
                                `/search?searchTerm=${searchTerm}&type=${searchPage}`
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
                                router.push(
                                    `/search?searchTerm=${searchTerm}&type=${searchPage}`
                                );
                            }}
                        >
                            <IconSearch size={18} />{" "}
                        </ActionIcon>
                    }
                    placeholder="Search TigrayWiki"
                />

                <div className={classes.profile}>
                    <AvatarWithMenu />
                </div>
            </div>
        </div>
    );
}
