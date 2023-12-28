import { Paper, Skeleton, Stack } from "@mantine/core";
import AppShellContainer from "../../../appShell";

export default function ProfileLoadingScreen({ children }) {
    return (
        <AppShellContainer>
            <Paper withBorder p="md" h="35vh">
                <Stack justify="center" align="center">
                    <Skeleton height={100} circle mt="xl" />
                    <Skeleton height="1rem" width="3rem" radius="xl" />
                    <Skeleton height="0.5rem" width="5em" radius="xl" />
                </Stack>
            </Paper>
            <Paper withBorder p="md" h="10vh" mt="md">
                <Stack align="center" justify="center">
                    <Skeleton height="1rem" radius="xl" />
                </Stack>
            </Paper>
            {children}
        </AppShellContainer>
    );
}
