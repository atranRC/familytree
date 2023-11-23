import { Button, Checkbox, Group, Paper, Stack } from "@mantine/core";
import axios from "axios";
import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";

export default function PublicSharedStoryEditor({
    sharedStory,
    setModalOpened,
}) {
    const [isAnnon, setIsAnnon] = useState(sharedStory.isAnnon);
    const queryClient = useQueryClient();
    const docsMutate = useMutation({
        mutationFn: async () => {
            return axios.put(
                `/api/article-shared-written-stories/${sharedStory?._id}`,
                { isAnnon: isAnnon }
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: "my-article-shared-stories",
            });
            setModalOpened(false);
        },
    });
    return (
        <Paper withBorder p="md">
            <Stack align="center">
                <Checkbox
                    label="Share Annonymously"
                    description="Choose whether to share name the person whose story this is"
                    checked={isAnnon}
                    onChange={(event) =>
                        setIsAnnon(event.currentTarget.checked)
                    }
                />
                <Group grow>
                    <Button
                        color="green"
                        onClick={() => docsMutate.mutate()}
                        loading={docsMutate.isLoading}
                    >
                        Save
                    </Button>
                    <Button color="gray" onClick={() => setModalOpened(false)}>
                        Cancel
                    </Button>
                </Group>
            </Stack>
        </Paper>
    );
}
