import { Divider, Paper, Stack, Text, Title } from "@mantine/core";
import { IconAnchor } from "@tabler/icons";

export default function TimelineSelectArticlePrompt() {
    return (
        <Paper withBorder radius={10} p={10} bg="#F7F7F7">
            <Stack align="center" spacing={10}>
                <Title
                    align="center"
                    order={2}
                    sx={{
                        //minWidth: "300px",
                        //maxWidth: "300px",
                        fontFamily: "Lora, serif",
                        fontWeight: "200",
                    }}
                >
                    Welcome to the Tigray Wiki Timeline
                </Title>
                <Divider
                    label={<IconAnchor color="gray" />}
                    labelPosition="center"
                />
                <Text color="dimmed">
                    Select an Article from the Timeline above
                </Text>
                <Text c="dimmed">- Or -</Text>
                <Text color="dimmed">Read from our Picks below</Text>
            </Stack>
        </Paper>
    );
}
