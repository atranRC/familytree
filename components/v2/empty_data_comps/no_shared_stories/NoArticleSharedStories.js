import { Stack, ThemeIcon, Text, Paper } from "@mantine/core";
import { IconMoodEmpty } from "@tabler/icons";

export default function NoArticleSharedStories() {
    return (
        <Paper withBorder m="xl" p="md">
            <Stack align="center" justify="center" spacing={0}>
                <ThemeIcon radius="xl" size="xl" color="gray">
                    <IconMoodEmpty size={40} />
                </ThemeIcon>
                <Text color="gray" size="lg">
                    No stories have been shared yet
                </Text>
                <Text color="gray">Please check back later</Text>
            </Stack>
        </Paper>
    );
}
