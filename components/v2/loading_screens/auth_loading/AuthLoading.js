import { Loader, Stack } from "@mantine/core";

export default function AuthLoading() {
    return (
        <Stack justify="center" align="center" mih="100vh">
            <Loader variant="dots" color="teal" />
        </Stack>
    );
}
