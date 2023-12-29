import {
    Button,
    Group,
    Loader,
    Paper,
    Stack,
    createStyles,
} from "@mantine/core";
import { IconBrandGoogle } from "@tabler/icons";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";

const useStyles = createStyles((theme) => ({
    cont: {
        minHeight: "100vh",
        minWidth: "100vw",
        border: "1px solid white",
        padding: "10px",

        backgroundImage:
            "url('https://res.cloudinary.com/dcgnu3a5s/image/upload/v1702024150/statics/ax_fzjlrl.jpg')",
        backgroundRepeat: "repeat",
        backgroundPosition: "center",
    },
    heading: {
        fontFamily: "'Playfair Display', serif",
        color: "white",
        fontSize: "5rem",
        marginBottom: "-2rem",
        "@media (max-width: 800px)": {
            fontSize: "4rem",
            marginBottom: "-1rem",
        },
    },

    slogan: {
        fontFamily: "'Playfair Display', serif",
        color: "white",
        //fontSize: "2rem",
        fontStyle: "italic",
        fontWeight: "500",
        "@media (max-width: 800px)": {
            fontSize: "1rem",
        },
    },
    headingBg: {
        backgroundColor: "rgba(1, 50, 32, 0.5)",
        //add dark green color

        padding: "1rem",
        border: "1px solid lightgray",
        borderRadius: "10px",
        //add transition
        transition: "all 0.3s ease-in-out",
        "&:hover": {
            //make rgba color black

            backgroundColor: "rgba(0, 0, 0, 0.3)",
            //add transition
            transition: "all 0.3s ease-in-out",
        },
    },
    t: {
        color: "yellow",
    },
    w: {
        color: "red",
        fontStyle: "italic",
        //textDecoration: "underline",
    },
    separator: {
        color: "white",
        borderColor: "white",
        border: "0",
        height: " 1px",
        backgroundImage:
            "linear-gradient(to right,rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.75),rgba(255, 255, 255, 0))",
        width: "100%",
        marginBottom: "2rem",
    },
}));

export default function CustomSigninPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const { classes } = useStyles();

    if (status === "loading")
        return (
            <Stack justify="center" align="center">
                <Loader variant="bars" />
            </Stack>
        );
    return (
        <div className={classes.cont}>
            <Stack align="center" justify="center" p="md" mih={"100vh"}>
                <div className={classes.headingBg}>
                    <Stack spacing={0} align="center">
                        <h1 className={classes.heading}>
                            <span className={classes.t}> Tigray</span>
                            <span className={classes.w}>Wiki</span>
                            <span className={classes.t}>.</span>
                        </h1>

                        <h3 className={classes.slogan}>
                            - the encyclopedia for everything Tigray -
                        </h3>
                        <hr className={classes.separator} />
                        {!session && (
                            <Button
                                size="xl"
                                variant="gradient"
                                gradient={{ from: "teal", to: "blue", deg: 60 }}
                                onClick={() =>
                                    signIn("google", {
                                        callbackUrl:
                                            router.query["callBackUrl"] || "/",
                                    })
                                }
                            >
                                <Group>
                                    <IconBrandGoogle color="yellow" />
                                    Signin with Google
                                </Group>
                            </Button>
                        )}
                        {session && (
                            <Button color="gray" onClick={() => signOut()}>
                                Signout
                            </Button>
                        )}
                    </Stack>
                </div>
            </Stack>
        </div>
    );
}
