import { Indicator, Menu, Stack, Title } from "@mantine/core";
import { IconBell } from "@tabler/icons";
import axios from "axios";
import { useState } from "react";
import { useQuery } from "react-query";
import NotificationsList from "../../lists/notifications_list/NotificationsList";

export default function NotificationIndicator() {
    const [opened, setOpened] = useState(false);
    const unreadQuery = useQuery({
        queryKey: ["get-my-unread-count"],
        //refetchOnWindowFocus: true,
        refetchInterval: 10000,
        queryFn: () => {
            return axios.get("/api/v2/notifications/get-unread");
        },
        onSuccess: (res) => {},
    });
    return (
        <Menu
            shadow="md"
            width={300}
            opened={opened}
            onChange={setOpened}
            styles={{ zIndex: 100 }}
            radius="1.5em"
        >
            <Menu.Target>
                <Indicator
                    label={unreadQuery.data?.data}
                    showZero={false}
                    dot={false}
                    inline
                    size={16}
                    overflowCount={10}
                >
                    <IconBell stroke={1.5} />
                </Indicator>
            </Menu.Target>

            {opened && (
                <Menu.Dropdown bg="#F8F9FA" mt="xs">
                    <Stack>
                        <Title order={5} color="dimmed" align="center">
                            Your Notifications
                        </Title>
                        <NotificationsList />
                    </Stack>
                </Menu.Dropdown>
            )}
            <Menu.Divider />
        </Menu>
    );
}
