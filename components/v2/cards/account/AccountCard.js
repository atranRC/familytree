import { Avatar, Badge, Text, createStyles } from "@mantine/core";

const useStyles = createStyles((theme) => ({
    cont: {
        display: "flex",
        gap: "1em",
        alignItems: "center",
        padding: "10px",
        backgroundColor: "white",
        border: "1px solid #E8E8E8",
        borderRadius: "1.5em",
    },
    rightSection: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        justifyContent: "center",
    },
}));
export default function AccountCard({
    img = "",
    name,
    email = "-",
    isPrivate,
}) {
    const { classes } = useStyles();
    return (
        <div className={classes.cont}>
            <Avatar radius="xl" src={img} />
            <div className={classes.rightSection}>
                <Text fw={700}>{name}</Text>
                <Text color="dimmed">{email}</Text>
                {isPrivate ? (
                    <Badge color="blue">private</Badge>
                ) : (
                    <Badge color="green">public</Badge>
                )}
            </div>
        </div>
    );
}
