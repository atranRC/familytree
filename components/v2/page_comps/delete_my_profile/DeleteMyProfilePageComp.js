import { useContext, useState } from "react";
import {
    ProfileSettingsPageNotificationContext,
    ProfileSettingsPageProfileContext,
} from "../../../../contexts/profileSettingsPageContext";
import {
    Button,
    Group,
    Image,
    Modal,
    Paper,
    Stack,
    Text,
    TextInput,
    Title,
} from "@mantine/core";
import { useRouter } from "next/router";
import { useMutation } from "react-query";
import axios from "axios";
import { signOut } from "next-auth/react";

export default function DeleteMyProfilePageComp() {
    const router = useRouter();
    const profile = useContext(ProfileSettingsPageProfileContext);
    const notify = useContext(ProfileSettingsPageNotificationContext);
    const [nameInput, setNameInput] = useState("");
    const [modalOpened, setModalOpened] = useState(false);

    const deleteMutation = useMutation({
        mutationFn: (owner) => {
            //console.log("body sent", form.values);

            return axios.delete(`/api/v2/delete-account`);
        },
        onSuccess: (res) => {
            console.log("del", res);
            notify.success("Profile deleted successfully");
            signOut({ callbackUrl: "/" });
            //profile.refetch();
            //console.log("info update stage", res.data);
        },
        onError: () => {
            notify.error("could not update your profile information");
        },
    });

    return (
        <Paper p="xl" w="100%" withBorder radius="1.5em">
            <Stack align="center" p="xl" w="100%" justify="center">
                <Image width={100} src="/statics/delete.gif" alt="delete" />
                <Title order={2} align="center">
                    Delete Your Profile?
                </Title>
                <Text c="dimmed" size="sm" align="center">
                    All your Events, Written Stories, and Audio Stories
                    <br />
                    will no longer be available
                </Text>
                <Button
                    color="red"
                    onClick={() => setModalOpened(true)}
                    //loading={removeTaggedrMutation.isLoading}
                >
                    Delete
                </Button>
            </Stack>
            <Modal
                opened={modalOpened}
                onClose={() => setModalOpened(false)}
                radius="xl"
                padding="xs"
                withCloseButton={false}
                closeOnClickOutside={false}
            >
                <Stack
                    sx={{
                        backgroundColor:
                            profile.data.name.toLowerCase() === nameInput
                                ? "green"
                                : "red",
                        borderRadius: "1.5em",
                        padding: "5px",
                    }}
                >
                    <Title order={2} align="center" c="white">
                        Confirm Deletion
                    </Title>
                    <Paper withBorder p={"md"} radius={"1.5em"}>
                        <Stack justify="center" align="center">
                            <Text color="dimmed" align="center">
                                This action can not be undone. Are you sure you
                                want to continue?
                            </Text>
                            <TextInput
                                value={nameInput}
                                onChange={(e) =>
                                    setNameInput(e.currentTarget.value)
                                }
                                label={`To continue, type '${profile.data.name.toLowerCase()}' below`}
                                placeholder={profile.data.name.toLowerCase()}
                            />
                            <Group>
                                <Button
                                    color="red"
                                    onClick={() => deleteMutation.mutate()}
                                    disabled={
                                        !(
                                            profile.data.name.toLowerCase() ===
                                            nameInput
                                        )
                                    }
                                    loading={deleteMutation.isLoading}
                                >
                                    Continue
                                </Button>
                                <Button onClick={() => setModalOpened(false)}>
                                    Cancel
                                </Button>
                            </Group>
                        </Stack>
                    </Paper>
                </Stack>
            </Modal>
        </Paper>
    );
}
