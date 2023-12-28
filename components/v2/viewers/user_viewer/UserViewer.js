import { Avatar, Button, Paper, Stack, Text, Title } from "@mantine/core";
import moment from "moment";

export default function UserViewerV2({ user }) {
    return (
        <Stack
            sx={{
                backgroundColor: "#F8F9FA",

                borderRadius: "1.5rem",
            }}
            p="sm"
        >
            <Stack justify="center" align="center">
                <Avatar
                    src={user?.image}
                    alt="it's me"
                    size="xl"
                    color="teal"
                    radius="xl"
                />
            </Stack>

            <Stack justify="center" align="center">
                <h1
                    style={{ color: "darkgreen", textAlign: "center" }}
                >{`${user.name} ${user?.fathers_name} ${user?.last_name}`}</h1>
            </Stack>

            <Paper withBorder p="sm" radius="1.5rem">
                <Stack>
                    <Stack justify="center" align="center" spacing={1}>
                        <Title order={4}>
                            {moment(user?.birthday).format("YYYY-MM-DD")}
                        </Title>
                        <Text color="teal">Born</Text>
                    </Stack>
                    <Stack justify="center" align="center" spacing={1}>
                        <Title order={4}>{user?.birth_place?.value}</Title>
                        <Text color="teal">Birthplace</Text>
                    </Stack>
                    {user.current_residence && (
                        <Stack justify="center" align="center" spacing={1}>
                            <Title order={4}>
                                {user.current_residence.value}
                            </Title>
                            <Text color="teal">Current residence</Text>
                        </Stack>
                    )}
                    <Stack></Stack>
                    {user.nickname && (
                        <Stack justify="center" align="center" spacing={1}>
                            <Title order={4}>{user.nicknames}</Title>
                            <Text color="teal">Nicknames</Text>
                        </Stack>
                    )}
                </Stack>
            </Paper>
            <Button
                variant="outline"
                radius="1.5rem"
                onClick={() =>
                    window.open(
                        `/profiles/${user._id.toString()}/events`,
                        "_blank",
                        "noopener noreferrer"
                    )
                }
            >
                Go to profile
            </Button>
        </Stack>
    );
}
