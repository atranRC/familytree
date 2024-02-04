import { Button, Image, Paper, Stack, Text, Title } from "@mantine/core";
import axios from "axios";
import { useMutation } from "react-query";
import { useQueryClient } from "react-query";
import NoDataToShow from "../../empty_data_comps/NoDataToShow";

export default function RemoveTaggedUser({ treeMember, onSuccess, onError }) {
    const queryClient = useQueryClient();

    const removeTaggedrMutation = useMutation({
        mutationFn: () => {
            return axios.put(
                `/api/family-tree-api/tree-members-b/v2/${treeMember._id.toString()}?treeId=${treeMember.treeId.toString()}`,
                { taggedUser: null }
            );
        },
        onSuccess: (res) => {
            //console.log(res.data);
            queryClient.invalidateQueries({
                queryKey: ["get_treemember_balkanid_treeid"],
            });
            onSuccess("Tagged user removed from tree");
        },
        onError: (err) => {
            onError();
        },
    });

    if (!treeMember.taggedUser) {
        return <NoDataToShow message="No tagged user" />;
    }

    return (
        <Paper p="md">
            <Stack align="center" justify="center">
                <Image width={100} src="/statics/delete.gif" alt="delete_gif" />
                <Title order={2} align="center">
                    Remove Tagged Profile from Tree?
                </Title>
                <Text c="dimmed" size="sm" align="center">
                    Events, Written Stories, and Audio Stories
                    <br />
                    of this profile will no longer be visible on this
                    <br />
                    Family Tree&apos;s timeline
                </Text>
                <Button
                    color="red"
                    onClick={() => removeTaggedrMutation.mutate()}
                    loading={removeTaggedrMutation.isLoading}
                >
                    Remove
                </Button>
            </Stack>
        </Paper>
    );
}
