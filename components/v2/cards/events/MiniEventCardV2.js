import {
    Divider,
    Group,
    Paper,
    Stack,
    Text,
    createStyles,
} from "@mantine/core";
import { get_auto_title } from "../../../../lib/static_lists";

export default function MiniEventCardV2({ event, index = 0, onClick }) {
    const useStyles = createStyles((theme) => ({
        treeLink: {
            textDecoration: "none",
            "&:hover": {
                //border: "1px solid",
                textDecoration: "underline",
                transition: "0.5s",
            },
        },
        card: {
            cursor: "pointer",
            /*border:
                selectedEvent &&
                viewMode !== "add" &&
                event._id.toString() === selectedEvent._id.toString()
                    ? "1px solid"
                    : "",*/
            "&:hover": {
                border: "1px solid",
                textDecoration: "underline",
                transition: "0.5s",
            },
        },
    }));
    const { classes } = useStyles();

    return (
        <Paper
            className={classes.card}
            withBorder
            p="md"
            onClick={() => {
                /*setViewMode("view");
                setSelectedEvent(event);
                setDrawerOpened(true);*/
                onClick(index, event);
            }}
        >
            <Stack spacing={2}>
                <Text size="sm" c="dimmed">
                    {get_auto_title(
                        event.type,
                        event.userName,
                        event.location.value,
                        event.eventDate.toString().split("T")[0]
                    )}
                </Text>
                <Group>
                    <Text size="sm">{event.authorName}</Text>
                    <Divider orientation="vertical" />
                    <Text size="sm">
                        {event.eventDate.toString().split("T")[0]}
                    </Text>
                </Group>
            </Stack>
        </Paper>
    );
}
