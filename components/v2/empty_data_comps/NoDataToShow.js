import { Image, Stack, Text, createStyles } from "@mantine/core";
import { IconMoodEmpty } from "@tabler/icons";
const useStyles = createStyles((theme) => ({
    cont: {
        width: "100%",
        height: "100%",
        padding: "15px",
        border: "1px solid pink",
        borderRadius: "10px",
        //backgroundColor: "#f7e6ee",
        "&:hover": {
            backgroundColor: "white",
        },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
}));

export default function NoDataToShow({ children, message = "" }) {
    const { classes } = useStyles();

    return (
        <div className={classes.cont}>
            <Stack align="center" spacing={3}>
                <Image width={100} src="/statics/pyramids.gif" />
                <Text c="gray">{message}</Text>
                {children}
            </Stack>
        </div>
    );
}
