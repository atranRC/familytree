import { Image, Loader, Stack, Text } from "@mantine/core";
import { IconMoodEmpty, IconMoodHappy } from "@tabler/icons";
import { useStyles } from "./EmailNotFoundWithInviteStyles";
import { useMutation } from "react-query";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function EmailNotFoundWithInvite({
    treeMemberDocumentId = null,
    email,
    treeId,
    invitationType,
}) {
    //
    const [sent, setSent] = useState(false);
    const { classes } = useStyles();

    const notifySentSuccess = () => toast.success("Invitation sent");
    const notifySentError = () => toast.error("Invitation failed");

    const inviteMutation = useMutation({
        mutationFn: () => {
            const bod = {
                /*inviterId: session.user.id,
                inviterName: session.user.name,*/
                inviteeEmail: email,
                invitationType: invitationType,
                /*treeId: tree._id,
                treeName: tree.tree_name,*/
                treeMemberDocumentId: treeMemberDocumentId,
            };
            return axios.post(`/api/invitations?treeId=${treeId}`, bod);
        },
        onSuccess: () => {
            setSent(true);
            notifySentSuccess();
            //setShowErrorNotification(false);
        },
        onError: () => {
            notifySentError();
        },
    });

    /*if (status === "loading") {
        return (
            <Stack justify="center" align="center">
                ⌛️
            </Stack>
        );
    }*/

    return (
        <div className={classes.cont}>
            <Stack align="center" spacing={3}>
                {!sent && (
                    <Image
                        width={100}
                        src="/statics/pyramids.gif"
                        alt="no_data"
                    />
                )}
                {sent && <IconMoodHappy color="teal" size={32} />}
                <Text c="gray">
                    {!sent && (
                        <div>
                            No users found.{" "}
                            {!inviteMutation.isLoading ? (
                                <span
                                    className={classes.inviteLink}
                                    onClick={() => {
                                        inviteMutation.mutate();
                                    }}
                                >
                                    Click here
                                </span>
                            ) : (
                                <Loader size="sm" variant="dots" />
                            )}{" "}
                            to send them an invite via Email.
                        </div>
                    )}
                    {sent && <div>Invitation sent</div>}
                </Text>
            </Stack>
            <Toaster />
        </div>
    );
}
