import { Skeleton, Stack } from "@mantine/core";

export function DraftsTableSkeleton() {
    return (
        <div>
            <Stack>
                <Skeleton height={8} mt={6} width="20%" radius="xl" />
                <Stack spacing="xs">
                    <Skeleton height={8} mt={6} radius="xl" />
                    <Skeleton height={8} mt={6} radius="xl" />
                    <Skeleton height={8} mt={6} radius="xl" />
                    <Skeleton height={8} mt={6} radius="xl" />
                </Stack>
            </Stack>
        </div>
    );
}
