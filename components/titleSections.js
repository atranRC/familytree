import {
    Avatar,
    Group,
    Paper,
    Stack,
    Title,
    Text,
    Button,
    createStyles,
} from "@mantine/core";
import { useSession } from "next-auth/react";
import { useContext } from "react";
import { FamtreePageContext } from "../contexts/contexts";
import useFamTreePageStore from "../lib/stores/famtreePageStore";

export function TitleSection({ children }) {
    const { drawerOpened } = useFamTreePageStore((state) => state.drawerOpened);
    const { setDrawerOpened } = useFamTreePageStore(
        (state) => state.setDrawerOpened
    );
    const { data: session } = useSession();
    //console.log("this sesssssion", session);
    return (
        <Paper mb="md" p="md" withBorder>
            <Group mb="md">
                {session && (
                    <Avatar src={session.user.image} radius="xl" size="lg" />
                )}
                <Stack spacing={0}>
                    {children}
                    {session && <Text>Signed In as {session.user.email}</Text>}
                    {/*<Button onClick={() => setDrawerOpened(true)}>
                        drawer
                    </Button>*/}
                </Stack>
            </Group>
        </Paper>
    );
}

export function ProfileTitleSection({ picUrl, children }) {
    const useStyles = createStyles((theme) => ({
        b: {
            backgroundImage:
                "url('https://img.freepik.com/free-vector/hand-drawn-minimal-background_23-2149009155.jpg')",
        },
        s: {
            backgroundColor: "rgba(100,100,100,.2)",
            color: "green",
        },
    }));
    const { classes } = useStyles();
    return (
        <Paper mb="md" p="md" withBorder className={classes.b}>
            <Stack
                spacing={0}
                align="center"
                justify="center"
                className={classes.s}
            >
                <Avatar src={picUrl} radius={120} size={120} />
                {children}
            </Stack>
        </Paper>
    );
}

export function TreePageTitleSection({ picUrl, children }) {
    const useStyles = createStyles((theme) => ({
        b: {
            backgroundImage:
                "url('https://img.freepik.com/free-vector/hand-drawn-minimal-background_23-2149017896.jpg')",
        },
        s: {
            backgroundColor: "rgba(100,100,100,.2)",
            color: "green",
        },
    }));
    const { classes } = useStyles();
    return (
        <Paper mb="md" p="md" withBorder className={classes.b}>
            <Stack
                spacing={0}
                align="center"
                justify="center"
                className={classes.s}
            >
                <Avatar src={picUrl} radius={120} size={120} />
                {children}
            </Stack>
        </Paper>
    );
}
