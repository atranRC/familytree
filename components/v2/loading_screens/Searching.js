import { Image, Paper, Stack, Text } from "@mantine/core";

export default function Searching({ message }) {
    return (
        <Paper withBorder p="2em" radius="1.5em" w="100%">
            <Stack align="center" spacing={2}>
                <Image width={100} src="/statics/home_smoke.gif" />
                <Text size="sm" color="dimmed">
                    {message}
                </Text>
            </Stack>
        </Paper>
    );
}
