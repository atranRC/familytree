import { useQuery } from "react-query";
import NotificationCard from "../../cards/notification_card/NotificationCard";
import axios from "axios";
import { Loader, Pagination, Stack } from "@mantine/core";
import { useState } from "react";

export default function NotificationsList() {
    const [page, setPage] = useState(1);

    const notificationsQuery = useQuery({
        queryKey: ["get-my-notifications", page],
        refetchOnWindowFocus: false,
        queryFn: () => {
            return axios.get(`/api/v2/notifications?page=${page}`);
        },
        onSuccess: (res) => {
            console.log("my nots", res.data[0]?.data);
        },
    });

    if (notificationsQuery.isError) return <div>error</div>;
    if (notificationsQuery.isLoading)
        return (
            <Stack align="center">
                <Loader size="sm" />
            </Stack>
        );
    return (
        <Stack align="center" sx={{ height: "60vh", overflowY: "auto" }}>
            {notificationsQuery.data?.data[0]?.data.map((notification) => (
                <NotificationCard
                    notification={notification}
                    key={notification._id}
                />
            ))}
            {!notificationsQuery.data?.data[0]?.data && (
                <div>all caught up</div>
            )}
            {!notificationsQuery.isLoading && (
                <Pagination
                    size="xs"
                    page={page}
                    onChange={setPage}
                    total={
                        parseInt(notificationsQuery.data?.data[0]?.count / 10) +
                        1
                    }
                    radius="md"
                    withEdges
                />
            )}
        </Stack>
    );
}
