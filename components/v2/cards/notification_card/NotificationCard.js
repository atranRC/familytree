import { Group, Paper, Stack, Text, Title } from "@mantine/core";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import { useMutation } from "react-query";

export default function NotificationCard({ notification }) {
    const router = useRouter();
    const updateStatusMutation = useMutation({
        mutationFn: () => {
            return axios.put(`/api/v2/notifications?id=${notification._id}`, {
                status: "read",
            });
        },
        onSuccess: (res) => {
            router.push(notification.url);
        },
        onError: () => {
            router.push(notification.url);
        },
    });
    return (
        <Paper
            withBorder
            radius="1.5em"
            p="md"
            onClick={() => {
                updateStatusMutation.mutate();
            }}
            sx={{ width: "100%", "&:hover": { backgroundColor: "#FCFCFC" } }}
        >
            <Stack spacing={3}>
                <Group grow>
                    <Title
                        order={5}
                        color={notification?.status === "read" && "dimmed"}
                    >
                        {notification?.sourceUserName}
                    </Title>
                    <Text color="dimmed" size="xs" align="right">
                        {notification?.createdAt ? (
                            moment(notification?.createdAt).format("YYYY-MM-DD")
                        ) : (
                            <>-</>
                        )}
                    </Text>
                </Group>

                <Text
                    size="sm"
                    color={notification?.status === "read" && "dimmed"}
                >
                    {notification?.message}
                </Text>
            </Stack>
        </Paper>
    );
}
