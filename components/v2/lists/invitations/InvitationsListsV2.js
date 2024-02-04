import {
    Box,
    Button,
    Divider,
    Group,
    Image,
    Paper,
    Stack,
    Text,
    Title,
} from "@mantine/core";
import InvitationsLists from "./InvitationsLists";
import { signIn, useSession } from "next-auth/react";
import AuthLoading from "../../loading_screens/auth_loading/AuthLoading";
import { createStyles } from "@mantine/core";
import Link from "next/link";

const useStyles = createStyles((theme) => ({
    welcomeSec: {
        //flexGrow: 1,
        //width: "100%",
        //maxHeight: "100vh",
        //overflowY: "auto",
        height: "100%",
        // width: "50%",

        width: "100%",
        //maxWidth: "70%",

        border: "1px solid red",
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        borderRadius: "1.5em",
        padding: "2em",
        "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            transition: ".2s ease-in-out",
        },
        "@media (max-width: 800px)": {
            paddingLeft: "10px",
            paddingRight: "10px",
            minWidth: "100%",
        },
    },
    instructionsCont: {
        width: "100%",
        padding: "15px",
        border: "1px solid lightblue",
        borderRadius: "10px",
        marginTop: "5px",
        backgroundColor: "#F1F3F4",
        "&:hover": {
            backgroundColor: "white",
        },
    },
}));

export default function InvitationsListsV2() {
    const { data: session, status } = useSession();
    const { classes } = useStyles();

    if (status === "loading")
        return (
            <Paper withBorder className={classes.welcomeSec}>
                <AuthLoading />
            </Paper>
        );
    if (status === "unauthenticated") signIn();
    return (
        <div className={classes.welcomeSec}>
            <Stack justify="center" align="center">
                <Title weight={900} color="#3c414a">
                    Your Invitations
                </Title>
                <Stack align="center" spacing={0} mb="md">
                    <div className={classes.instructionsCont}>
                        <Text fw={400} c="gray">
                            👉 You can accept invitations down below.
                        </Text>

                        <Text fw={400} c="gray">
                            👉 When you&apos;re done,{" "}
                            <Link
                                href={`/profiles/${session.user.id}/overview`}
                            >
                                click here
                            </Link>{" "}
                            to proceed
                        </Text>
                    </div>
                </Stack>

                <Text fw={700} c="gray">
                    Your Invitations to Collaborate
                </Text>
                <InvitationsLists email={session?.user?.email} type="collab" />
                <Text fw={700} c="gray">
                    Your Invitations to Join Trees
                </Text>
                <InvitationsLists email={session?.user?.email} type="member" />
            </Stack>
        </div>
    );
}
