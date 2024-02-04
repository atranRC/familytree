import {
    Box,
    Button,
    Divider,
    Group,
    Image,
    Stack,
    Text,
    Title,
} from "@mantine/core";
import InvitationsLists from "../../components/v2/lists/invitations/InvitationsLists";
import { signIn, useSession } from "next-auth/react";
import AuthLoading from "../../components/v2/loading_screens/auth_loading/AuthLoading";
import { createStyles } from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/router";

const useStyles = createStyles((theme) => ({
    cont: {
        display: "flex",
        //justifyContent: "space-between",
        //flexGrow: "3",\

        "@media (max-width: 800px)": {
            justifyContent: "center",
        },
    },
    imgSec: {
        width: "50%",
        height: "100vh",
        //borderRadius: "10px",
        backgroundImage:
            "url('https://res.cloudinary.com/dcgnu3a5s/image/upload/v1702024150/statics/ax_fzjlrl.jpg')",
        backgroundPosition: "center",
        WebkitBackgroundSize: "contain",
        // Static media query
        "@media (max-width: 800px)": {
            display: "none",
        },
    },
    welcomeSec: {
        flexGrow: 1,
        maxHeight: "100vh",
        overflowY: "auto",
    },
    instructionsCont: {
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

export default function InviteOnboardingPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const { classes } = useStyles();

    if (status === "loading") return <AuthLoading />;
    //if (status === "unauthenticated") signIn();
    if (status === "unauthenticated") router.push("/u/signin");
    return (
        <div className={classes.cont}>
            <div>redirecting...</div>
            {/*<div className={classes.imgSec}></div>
            <div className={classes.welcomeSec}>
                <Stack
                    sx={{ minHeight: "100vh" }}
                    justify="center"
                    align="center"
                >
                    <Stack align="center" spacing={0} mb="md">
                        <Title>Welcome, {session.user.name} 👋</Title>
                        <div className={classes.instructionsCont}>
                            <Text fw={400} c="gray">
                                👉 You can accept invitations down below.
                            </Text>

                            <Text fw={400} c="gray">
                                👉 When you&apos;re done,{" "}
                                <Link
                                    href={`/profiles/${session.user.id}/events`}
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
                    <InvitationsLists
                        email={session?.user?.email}
                        type="collab"
                    />
                    <Text fw={700} c="gray">
                        Your Invitations to Join Trees
                    </Text>
                    <InvitationsLists
                        email={session?.user?.email}
                        type="member"
                    />
                </Stack>
            </div>*/}
        </div>
    );
}
