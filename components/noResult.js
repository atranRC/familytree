import { Button, Stack, ThemeIcon, Title } from "@mantine/core";
import { IconMoodConfuzed } from "@tabler/icons";

export default function NoAccounts({ searchTerm }) {
    return (
        <Stack
            align="center"
            justify="center"
            style={{ paddingTop: "50px" }}
            spacing={2}
        >
            <ThemeIcon variant="light" radius="xl" size={80} color="gray">
                <IconMoodConfuzed size={80} />
            </ThemeIcon>

            <Title c="dimmed" fw={500} order={4} align="center" mb="sm">
                We couldn't find results that match {searchTerm}.
            </Title>
            <Title c="dimmed" fw={500} order={6} align="center" mb="sm">
                You can create an unclaimed account for {searchTerm} in the
                'All' tab.
            </Title>
        </Stack>
    );
}
