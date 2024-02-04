import {
    Divider,
    Group,
    Paper,
    Stack,
    Text,
    Title,
    createStyles,
} from "@mantine/core";

export default function MiniAudioStoryCardV2({ story, onClick }) {
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
                selectedstory &&
                viewMode !== "add" &&
                story._id.toString() === selectedstory._id.toString()
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
                setSelectedstory(story);
                setDrawerOpened(true);*/
                onClick(story);
            }}
        >
            <Stack spacing={2}>
                <Title order={5} fw={500} c="blue">
                    {story.title}
                </Title>
                <Text lineClamp={3}>{story.description}</Text>
                <Group>
                    <Text c="dimmed">{story.authorName}</Text>
                </Group>
            </Stack>
        </Paper>
    );
}
