import { Stack, Text, createStyles } from "@mantine/core";
import { IconMoodEmpty } from "@tabler/icons";
const useStyles = createStyles((theme) => ({
    cont: {
        padding: "15px",
        border: "1px solid pink",
        borderRadius: "10px",
        //backgroundColor: "#f7e6ee",
        "&:hover": {
            backgroundColor: "white",
        },
    },
}));

export default function NoDataToShow({ message }) {
    const { classes } = useStyles();

    return (
        <div className={classes.cont}>
            <Stack align="center" spacing={3}>
                <IconMoodEmpty color="gray" size={64} />
                <Text c="gray">{message}</Text>
            </Stack>
        </div>
    );
}
