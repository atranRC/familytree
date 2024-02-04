import {
    ActionIcon,
    Button,
    Group,
    Paper,
    Stack,
    Switch,
    Text,
    Title,
} from "@mantine/core";
import axios from "axios";
import moment from "moment";
import { useMutation, useQueryClient } from "react-query";
import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";
import { IconDeviceFloppy } from "@tabler/icons";

export default function TreeMembershipAuthorEditor({ treeMembership }) {
    const [checked, setChecked] = useState(treeMembership.canPost);
    const queryClient = useQueryClient();
    const notifySuccess = () => toast.success("Edited successfully");
    const notifyError = () => toast.error("Could not edit");

    const mutation = useMutation({
        mutationFn: (bod) => {
            return axios.put(
                `/api/family-tree-api/tree-members-b/v2/edit-membership/${treeMembership._id}?profileId=${treeMembership.taggedUser}`,
                bod
            );
        },
        onSuccess: (res) => {
            notifySuccess();
            queryClient.invalidateQueries({
                queryKey: ["get_tree_memberships_profile"],
            });
        },
        onError: () => {
            notifyError();
        },
    });

    return (
        <Stack sx={{ backgroundColor: "#F8F9FA" }} p="md">
            <Paper p="md" withBorder>
                <Stack spacing={0} align="center">
                    <Text fw={500} color="gray">
                        🌱
                    </Text>
                    <Title color="darkgreen">{treeMembership.treeName}</Title>
                    <Text fw={500} color="gray">
                        {`added on ${moment(treeMembership.createdAt).format(
                            "YYYY-MM-DD"
                        )}`}
                    </Text>
                </Stack>
            </Paper>

            <Paper p="md" withBorder>
                <Stack>
                    <Stack align="center">
                        <Text fw={500} color="gray">
                            ✏️
                        </Text>
                    </Stack>

                    <Switch
                        label="Allow Posts"
                        description="Allow members of this tree to post"
                        size="md"
                        checked={checked}
                        onChange={(event) =>
                            setChecked(event.currentTarget.checked)
                        }
                    />
                    <Stack align="center">
                        <ActionIcon
                            size="lg"
                            radius="xl"
                            variant="filled"
                            color="green"
                            disabled={checked === treeMembership.canPost}
                            loading={mutation.isLoading}
                            onClick={() => {
                                mutation.mutate({
                                    canPost: checked,
                                });
                            }}
                        >
                            <IconDeviceFloppy />
                        </ActionIcon>
                    </Stack>
                </Stack>
            </Paper>

            <Stack align="center">
                <Button color="red">{`remove from ${treeMembership.treeName}`}</Button>
            </Stack>

            <Toaster />
        </Stack>
    );
}
