import { Group, Loader, Paper, Skeleton, Stack } from "@mantine/core";
import AppShellContainer from "../../../appShell";

export default function ProfileLoadingScreen({ children }) {
    return (
        <AppShellContainer>
            {/*<Stack justify="center" align="center" spacing={100}>
                <Stack justify="center" align="center" spacing="lg">
                    <Skeleton height={200} circle mt="xl" />
                    <Skeleton height="20px" width="500px" radius="xl" />
                    <Stack spacing={10} align="center" justify="center">
                        <Skeleton height="0.5rem" width="250px" radius="xl" />
                        <Skeleton height="0.5rem" width="200px" radius="xl" />
                        <Skeleton height="0.5rem" width="150px" radius="xl" />
                    </Stack>
                </Stack>

                <Group position="center" spacing="xl">
                    <Skeleton
                        height="30px"
                        radius="xl"
                        width={100}
                        color="violet"
                    />
                    <Skeleton height="30px" radius="xl" width={100} />
                    <Skeleton height="30px" radius="xl" width={100} />
                    <Skeleton height="30px" radius="xl" width={100} />
                </Group>
            </Stack>*/}
            <Stack justify="center" align="center" spacing={100}>
                <Loader size="xl" color="yellow" variant="bars" />
            </Stack>

            {children}
        </AppShellContainer>
    );
}
