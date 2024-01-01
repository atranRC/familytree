import { useState } from "react";
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
} from "@tabler/icons";
import { useDisclosure } from "@mantine/hooks";
import { useQuery } from "react-query";
import axios from "axios";
import { useRouter } from "next/router";
import FamilyTreeLogo from "../../../FamilyTreeLogo";

const HEADER_HEIGHT = 60;

const linksMock = {
    links: [
        {
            link: "/timeline",
            label: "Public Timeline",
            children: [],
            icon: <IconTimeline size={16} stroke={1.5} />,
        },
        {
            /*link: "/family-tree/tree/my-trees",*/
            label: "Trees",
            children: [
                {
                    link: "/family-tree/my-trees-v2",
                    label: "My Family Trees",
                },
                {
                    link: "/family-tree/my-trees-v2/unclaimed",
                    label: "Unclaimed Profiles",
                },
            ],
            icon: <IconTrees size={16} stroke={1.5} />,
        },
        {
            link: "#",
            label: "Places",
            children: [],
            icon: <IconMap size={16} stroke={1.5} />,
        },
    ],
};

const useStyles = createStyles((theme, { activeLink }) => ({
    /*root: {
        position: "relative",
        zIndex: 1,
    },

    dropdown: {
        position: "absolute",
        top: HEADER_HEIGHT,
        left: 0,
        right: 0,
        zIndex: 0,
        borderTopRightRadius: 0,
        borderTopLeftRadius: 0,
        borderTopWidth: 0,
        overflow: "auto",

        [theme.fn.largerThan("sm")]: {
            display: "none",
        },
    },
    headerCont: {
        backgroundColor: theme.fn.variant({
            variant: "filled",
            color: theme.primaryColor,
        }).background,
        height: "60px",
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        height: "100%",
        width: "100%",
        marginBottom: "100px",
    },

    links: {
        [theme.fn.smallerThan("sm")]: {
            display: "none",
        },
    },

    burger: {
        [theme.fn.largerThan("sm")]: {
            display: "none",
        },
    },

    link: {
        display: "block",
        lineHeight: 1,
        padding: "8px 12px",
        borderRadius: theme.radius.sm,
        textDecoration: "none",
        color:
            theme.colorScheme === "dark"
                ? theme.colors.dark[0]
                : theme.colors.gray[7],
        fontSize: theme.fontSizes.md,
        fontWeight: 500,
        [theme.fn.largerThan("sm")]: {
            color:
                theme.colorScheme === "dark"
                    ? theme.colors.dark[0]
                    : theme.colors.gray[2],
        },

        "&:hover": {
            backgroundColor:
                theme.colorScheme === "dark"
                    ? theme.colors.dark[6]
                    : theme.colors.gray[0],
            color:
                theme.colorScheme === "dark"
                    ? theme.colors.gray[0]
                    : theme.colors.blue[5],
        },

        [theme.fn.smallerThan("sm")]: {
            borderRadius: 0,
            padding: theme.spacing.md,
        },
    },

    linkActive: {
        "&, &:hover": {
            backgroundColor: theme.fn.variant({
                variant: "light",
                color: theme.primaryColor,
            }).background,
            color: theme.fn.variant({
                variant: "light",
                color: theme.primaryColor,
            }).color,
        },
    },*/
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
    },
    navCont: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        //borderBottom: `3px solid white`,
        gap: "1em",
    },
    burgerMenu: {
        color: "#02494d",
        "@media (min-width: 800px)": {
            //fontSize: "1.5rem",
            //marginBottom: "-1rem",
            display: "none",
        },
    },
    logo: {
        flexShrink: 0,
        border: `1px solid black`,
        padding: "1em",
    },
    links: {
        padding: "0px",
        listStyleType: "none",
        flexGrow: 1,
        flexShrink: 1,
        //borderBottom: `2px solid white`,
        display: "flex",
        justifyContent: "flex-start",

        gap: "3em",
        padding: "1em",
        "@media (max-width: 800px)": {
            //fontSize: "1.5rem",
            //marginBottom: "-1rem",
            display: "none",
        },
    },
    link: {
        fontWeight: "600",

        "&:hover": {
            cursor: "pointer",
            color: "#1C7ED6",
        },
        color: "#849394",
        paddingLeft: ".5em",
        paddingRight: ".5em",
    },
    profile: {
        //border: `1px solid black`,
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
        padding: "1em",
    },
}));

export function AvatarMenuContent({ sessionUserEmail }) {
    const router = useRouter();
    const { isLoading, isFetching, data, refetch, isError, error } = useQuery({
        queryKey: "get-user",
        queryFn: () => {
            return axios.get("/api/users/users-mongoose/" + sessionUserEmail);
        },
        onSuccess: (d) => {
            console.log("fetched avatar session user", d.data.data);
            //setSessionUser(d.data.data);
        },
    });

    if (isLoading || isFetching) {
        return <Loader size="sm" />;
    }

    if (data) {
        return (
            <div>
                <Menu.Item
                    icon={<IconUser size={14} />}
                    onClick={() =>
                        router.push(
                            `/profiles/${data.data.data._id.toString()}/events`
                        )
                    }
                >
                    My Profile
                </Menu.Item>
                <Menu.Item
                    icon={<IconLogout size={14} />}
                    onClick={() => signOut()}
                >
                    Logout
                </Menu.Item>
            </div>
        );
    }
}

export const AvatarWithMenu = ({
    picUrl = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=250&q=80",
}) => {
    const { data: session, status } = useSession();
    const [opened, setOpened] = useState(false);

    if (session) {
        return (
            <Menu
                shadow="md"
                width={200}
                opened={opened}
                onChange={setOpened}
                styles={{ zIndex: 100 }}
            >
                <Menu.Target>
                    <Avatar
                        radius="xl"
                        size="md"
                        color="blue"
                        src={session.user.image}
                    />
                </Menu.Target>

                {opened && (
                    <Menu.Dropdown>
                        <Menu.Label>Application</Menu.Label>
                        <AvatarMenuContent
                            sessionUserEmail={session.user.email}
                        />
                    </Menu.Dropdown>
                )}
                <Menu.Divider />
            </Menu>
        );
    }
};

export const ProfileNavBar = ({ links = linksMock.links, activeLink }) => {
    const [mobileDrawerOpened, setMobileDrawerOpened] = useState(false);
    const { classes } = useStyles({ activeLink });

    const router = useRouter();
    return (
        <div className={classes.root}>
            <div className={classes.navCont}>
                <div
                    className={classes.burgerMenu}
                    onClick={() => setMobileDrawerOpened(true)}
                >
                    <IconMenu2 />
                </div>
                <FamilyTreeLogo />

                <ul className={classes.links}>
                    {links.map((link, index) => {
                        return link.label === "Trees" ? (
                            <Menu withArrow trigger="hover" key={index}>
                                <Menu.Target>
                                    <Box
                                        sx={{
                                            color:
                                                activeLink === link.label &&
                                                "#05a7b0",
                                            borderBottom:
                                                activeLink === link.label &&
                                                "2px solid #05a7b0",
                                        }}
                                        className={classes.link}
                                    >
                                        {`Trees`}
                                    </Box>
                                </Menu.Target>
                                <Menu.Dropdown>
                                    {link?.children.map((child, index) => {
                                        return (
                                            <Menu.Item
                                                //component="a"
                                                //href={child.link}
                                                onClick={() => {
                                                    router.push(child.link);
                                                }}
                                                key={index}
                                            >
                                                {child.label}
                                            </Menu.Item>
                                        );
                                    })}
                                </Menu.Dropdown>
                            </Menu>
                        ) : (
                            <li
                                /*style={{
                                    textDecoration:
                                        activeLink === link.label &&
                                        "underlined",
                                }}*/
                                className={classes.link}
                                key={index}
                            >
                                {link.label}
                            </li>
                        );
                    })}
                </ul>

                <div className={classes.profile}>
                    <AvatarWithMenu />
                </div>
            </div>
            <Drawer
                opened={mobileDrawerOpened}
                onClose={() => setMobileDrawerOpened(false)}
                padding="xl"
                size="sm"
            >
                <FamilyTreeLogo />
                <Box sx={{ width: "100%" }}>
                    {links.map((link, index) => {
                        return link.children.length > 0 ? (
                            <NavLink
                                label={link.label}
                                icon={link?.icon}
                                defaultOpened
                                key={index}
                            >
                                {link.children.map((child, index) => (
                                    <NavLink
                                        label={child.label}
                                        onClick={() => {
                                            //setMobileDrawerOpened(false);
                                            router.push(child.link);
                                        }}
                                        key={index}
                                    />
                                ))}
                            </NavLink>
                        ) : (
                            <NavLink
                                label={link.label}
                                icon={link?.icon}
                                onClick={() => {
                                    //setMobileDrawerOpened(false);
                                    router.push(link.link);
                                }}
                                key={index}
                            />
                        );
                    })}
                </Box>
            </Drawer>
        </div>
    );
};
