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
} from "@mantine/core";
import {
    IconSettings,
    IconMessageCircle,
    IconPhoto,
    IconSearch,
    IconArrowsLeftRight,
    IconTrash,
    IconBell,
} from "@tabler/icons";
import { useDisclosure } from "@mantine/hooks";

const HEADER_HEIGHT = 60;

const linksMock = {
    links: [
        {
            link: "/demo/auth-demo",
            label: "Public Timeline",
        },

        {
            link: "/family-tree/tree/my-trees",
            label: "Trees",
        },
        {
            link: "/demo/auth-demo/places",
            label: "Places",
        },
        {
            link: "/demo/auth-demo/search",
            label: "My Relatives",
        },
    ],
};

const useStyles = createStyles((theme) => ({
    root: {
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
    },
}));

export const AvatarWithMenu = ({
    picUrl = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=250&q=80",
}) => {
    return (
        <Menu shadow="md" width={200}>
            <Menu.Target>
                <Avatar radius="xl" size="md" color="blue" src={picUrl} />
            </Menu.Target>

            <Menu.Dropdown>
                <Menu.Label>Application</Menu.Label>
                <Menu.Item icon={<IconSettings size={14} />}>
                    Settings
                </Menu.Item>
                <Menu.Item icon={<IconMessageCircle size={14} />}>
                    Messages
                </Menu.Item>
                <Menu.Item icon={<IconPhoto size={14} />}>Gallery</Menu.Item>

                <Menu.Divider />
            </Menu.Dropdown>
        </Menu>
    );
};

export const ResponsiveNav = ({ links = linksMock.links, activeLink }) => {
    const [opened, { toggle, close }] = useDisclosure(false);
    const [active, setActive] = useState(activeLink);
    const { classes, cx } = useStyles();

    const items = links.map((link) => (
        <Link
            key={link.label}
            href={link.link}
            className={cx(classes.link, {
                [classes.linkActive]: active === link.link,
            })}
            onClick={(event) => {
                setActive(link.link);
                close();
            }}
        >
            {link.label}
        </Link>
    ));

    return (
        <Header className={classes.headerCont}>
            <Container className={classes.header} size="xl">
                <Group spacing={5} className={classes.links} position="apart">
                    <Title c="white" order={3} mx="xl">
                        Famtree
                    </Title>
                    {items}
                </Group>
                <Burger
                    opened={opened}
                    onClick={toggle}
                    className={classes.burger}
                    size="sm"
                />
                <Transition
                    transition="pop-top-right"
                    duration={200}
                    mounted={opened}
                >
                    {(styles) => (
                        <Paper
                            className={classes.dropdown}
                            withBorder
                            style={styles}
                        >
                            {items}
                        </Paper>
                    )}
                </Transition>
                <Group>
                    <ActionIcon variant="transparent">
                        <IconBell size={30} color={"white"} />
                    </ActionIcon>
                    <AvatarWithMenu />
                </Group>
            </Container>
        </Header>
    );
};

/*export default function NavBar() {
    const { data: session } = useSession();
    console.log(session);
    if (session) {
        return (
            <>
                <div>Signed In as {session.user.email}</div>
                <div>
                    <Link
                        href="/api/auth/signout"
                        onClick={(e) => {
                            e.preventDefault();
                            signOut();
                        }}
                    >
                        signout
                    </Link>
                    <button onClick={() => console.log(session)}>
                        sesssion
                    </button>
                </div>
            </>
        );
    }
    return (
        <>
            <div>
                <Link
                    href="/api/auth/signin"
                    onClick={(e) => {
                        e.preventDefault();
                        signIn();
                    }}
                >
                    signin
                </Link>
            </div>
        </>
    );
}
*/
