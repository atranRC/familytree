import { Loader, Paper, Stack, Title } from "@mantine/core";

export function LookingForScreen({ searchTerm }) {
    return (
        <Paper withBorder p="md">
            <Stack
                align="center"
                justify="center"
                style={{ paddingTop: "50px" }}
            >
                <Loader />
                <Title c="dimmed" fw={500} order={6} align="center" mb="sm">
                    Please wait while we look for {searchTerm}.
                </Title>
            </Stack>
        </Paper>
    );
}
