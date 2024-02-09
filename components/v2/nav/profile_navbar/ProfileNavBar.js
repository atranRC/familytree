import { useContext, useState } from "react";
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
    Popover,
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
    IconJpg,
    IconNotebook,
    IconTimelineEvent,
    IconUsers,
    IconLetterW,
} from "@tabler/icons";
import { useDisclosure } from "@mantine/hooks";
import { useQuery } from "react-query";
import axios from "axios";
import { useRouter } from "next/router";
import FamilyTreeLogo from "../../../FamilyTreeLogo";
import NotificationIndicator from "../notifications/NotificationIndicator";

const HEADER_HEIGHT = 60;

const linksMock = {
    links: [
        {
            link: "/",
            label: "TigrayWiki",
            children: [],
            icon: <IconLetterW size={20} stroke={1.5} color="gray" />,
        },
        {
            /*link: "/family-tree/tree/my-trees",*/
            label: "Trees",
            children: [
                {
                    link: "/family-tree/my-trees-v2",
                    label: "My Family Trees",
                    icon: <IconTrees size={20} stroke={1.5} color="gray" />,
                },
                {
                    link: "/family-tree/my-trees-v2/unclaimed",
                    label: "Unclaimed Profiles",
                    icon: <IconUsers size={20} stroke={1.5} color="gray" />,
                },
            ],
            icon: <IconTrees size={20} stroke={1.5} color="gray" />,
        },
    ],
};

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
    },
    navCont: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        //borderBottom: `3px solid white`,
        gap: "1em",
        //border: `1px solid black`,
        height: "60px",
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
        //padding: "1em",
    },
    links: {
        //padding: "0px",
        listStyleType: "none",
        flexGrow: 1,
        flexShrink: 1,
        //borderBottom: `2px solid white`,
        display: "flex",
        justifyContent: "flex-start",

        gap: "3em",
        //padding: "1em",
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
        //padding: "1em",
    },
}));

export function AvatarMenuContent({ sessionUserEmail }) {
    const router = useRouter();
    const { data: session, status } = useSession();

    if (status === "loading") {
        return <Loader size="sm" />;
    }

    return (
        <div>
            <Menu.Item
                icon={<IconUser size={20} stroke={1.5} color="gray" />}
                onClick={() =>
                    window.open(
                        `/profiles/${session.user.id}/overview`,
                        "_self"
                    )
                }
            >
                My Profile
            </Menu.Item>
            <Menu.Item
                icon={<IconLogout size={20} stroke={1.5} color="gray" />}
                onClick={() => signOut({ callbackUrl: "/" })}
            >
                Logout
            </Menu.Item>
        </div>
    );
}

export const AvatarWithMenu = ({
    picUrl = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=250&q=80",
}) => {
    const { data: session, status } = useSession();
    const [opened, setOpened] = useState(false);

    if (status === "loading")
        return <Loader variant="bars" size="xs" color="lightgray" />;
    if (status === "unauthenticated")
        return <Link href={"/u/signin"}>Login</Link>;

    return (
        <Group>
            <NotificationIndicator />
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
                        <AvatarMenuContent
                            sessionUserEmail={session.user.email}
                        />
                    </Menu.Dropdown>
                )}
                <Menu.Divider />
            </Menu>
        </Group>
    );
};

export const ProfileNavBar = ({ links = linksMock.links, activeLink }) => {
    const { data: session, status } = useSession();
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
                                                icon={child.icon}
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
                                onClick={() => {
                                    router.push(link.link);
                                }}
                            >
                                {link.label}
                            </li>
                        );
                    })}

                    <Menu shadow="md" width={200} trigger="hover">
                        <Menu.Target>
                            <li className={classes.link}>
                                My TigrayWiki Content
                            </li>
                        </Menu.Target>

                        <Menu.Dropdown>
                            <Box w={180}>
                                <NavLink
                                    label="Martyrs"
                                    onClick={() =>
                                        router.push(
                                            `/my-wiki/public-content/martyrs`
                                        )
                                    }
                                />
                            </Box>

                            <Menu.Divider />

                            <Menu.Label>Wiki</Menu.Label>
                            <NavLink
                                label="Timeline Articles"
                                icon={
                                    <IconTimelineEvent
                                        size={20}
                                        color="gray"
                                        stroke={1.5}
                                    />
                                }
                                childrenOffset={28}
                                disabled={
                                    !session || !session?.user.isHistorian
                                }
                            >
                                <NavLink
                                    label="Published"
                                    onClick={() =>
                                        router.push(`/my-wiki/my-articles/`)
                                    }
                                />
                                <NavLink
                                    label="Drafts"
                                    onClick={() =>
                                        router.push(
                                            `/my-wiki/my-articles/drafts`
                                        )
                                    }
                                />
                            </NavLink>

                            <NavLink
                                label="Wiki Pages"
                                icon={
                                    <IconNotebook
                                        size={20}
                                        color="gray"
                                        stroke={1.5}
                                    />
                                }
                                childrenOffset={28}
                                disabled={
                                    !session || !session?.user.isHistorian
                                }
                            >
                                <NavLink
                                    label="Published"
                                    onClick={() =>
                                        router.push(`/my-wiki/my-wikis/`)
                                    }
                                />
                                <NavLink
                                    label="Drafts"
                                    onClick={() =>
                                        router.push(`/my-wiki/my-wikis/drafts`)
                                    }
                                />
                            </NavLink>
                        </Menu.Dropdown>
                    </Menu>
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
                    <NavLink
                        label="Timeline Articles"
                        icon={
                            <IconTimelineEvent
                                size={20}
                                color="gray"
                                stroke={1.5}
                            />
                        }
                        childrenOffset={28}
                        disabled={!session || !session?.user.isHistorian}
                    >
                        <NavLink
                            label="Published"
                            onClick={() => router.push(`/my-wiki/my-articles/`)}
                        />
                        <NavLink
                            label="Drafts"
                            onClick={() =>
                                router.push(`/my-wiki/my-articles/drafts`)
                            }
                        />
                    </NavLink>

                    <NavLink
                        label="Wiki Pages"
                        icon={
                            <IconNotebook size={20} color="gray" stroke={1.5} />
                        }
                        childrenOffset={28}
                        disabled={!session || !session?.user.isHistorian}
                    >
                        <NavLink
                            label="Published"
                            onClick={() => router.push(`/my-wiki/my-wikis/`)}
                        />
                        <NavLink
                            label="Drafts"
                            onClick={() =>
                                router.push(`/my-wiki/my-wikis/drafts`)
                            }
                        />
                    </NavLink>
                </Box>
            </Drawer>
        </div>
    );
};
