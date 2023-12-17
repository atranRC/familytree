import { ActionIcon, Group, Paper, Stack, Text } from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons";
import { useStyles } from "./InvitationCardStyles";
import moment from "moment";
import { useMutation, useQueryClient } from "react-query";
import { useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { truncateWord } from "../../../../utils/utils";

//on accept > add collabs doc > update invitation status

export default function InvitationCard({ invitation, onSuccess, onErr }) {
    const { data: session, status } = useSession();
    const { classes } = useStyles();
    //const [updatedStatus, setUpdatedStatus] = useState();
    const queryClient = useQueryClient();
    //

    const docMutation = useMutation({
        mutationFn: (updatedStatus) => {
            const bod = {
                //collabId: session.user.id,
                treeId: invitation.treeId,
                //collabName: session.user.name,
                collabRole: "editor",
                invitationId: invitation._id,
                status: updatedStatus,
                invitationType: invitation.invitationType,
                treeMemberDocumentId: invitation.treeMemberDocumentId,
            };
            return axios.put("/api/invitations/my-invitations", bod);
        },
        onSuccess: (res) => {
            console.log(res);
            if (res.data?.status === "accepted") onSuccess();
            queryClient.invalidateQueries({ queryKey: "invitations-list" });
        },
        onError: (err) => {
            onerror();
        },
    });

    if (status === "loading") return <div>⏳</div>;

    return (
        <div className={classes.cont}>
            <Group position="center">
                <Stack align="left" spacing={0}>
                    <Text fw={600}>
                        {truncateWord(invitation?.treeName, 10)}
                    </Text>
                    <Text c="gray" size="sm">
                        {invitation?.invitationType}
                    </Text>
                </Stack>
                <Stack align="left" spacing={0}>
                    <Text c="gray">
                        {truncateWord(invitation?.inviterName, 10)}
                    </Text>
                    <Text c="gray" size="sm">
                        {moment(invitation?.updatedAt).format("YYYY-MM-DD")}
                    </Text>
                </Stack>
                <Group position="right" grow>
                    <ActionIcon
                        variant="subtle"
                        c="blue"
                        onClick={() => {
                            //setUpdatedStatus("accepted");
                            docMutation.mutate("accepted");
                        }}
                        loading={docMutation.isLoading}
                    >
                        <IconCheck size={18} />
                    </ActionIcon>

                    <ActionIcon
                        variant="subtle"
                        c="red"
                        onClick={() => {
                            //setUpdatedStatus("declined");
                            docMutation.mutate("declined");
                        }}
                        loading={docMutation.isLoading}
                    >
                        <IconX size={18} />
                    </ActionIcon>
                </Group>
            </Group>
        </div>
    );
}
