import { Badge, Button, Group, Paper, Stack, Text } from "@mantine/core";
import axios from "axios";
import { useMutation, useQueryClient } from "react-query";

import { getPillColorClaimReq } from "../../../utils/utils";
import { useState } from "react";
import moment from "moment";

export default function ClaimRequestApproveOrDecline({
    claimRequest,
    onClose,
    onApproveSuccess,
    onDeclineSuccess,
    onError,
}) {
    const queryClient = useQueryClient();

    const [migrationStatus, setMigrationStatus] = useState("");

    const approvedStatusMutation = useMutation({
        mutationFn: () => {
            setMigrationStatus("finishing up...");
            return axios.put(
                `/api/claim-requests-api/v2/${claimRequest._id}?unclaimedProfileId=${claimRequest.targetId}`,
                {
                    status: "approved",
                }
            );
        },
        onSuccess: (res) => {
            setMigrationStatus("done!");
            queryClient.invalidateQueries({
                queryKey: ["get-claim-requests"],
            });
            onApproveSuccess();
        },
        onError: () => {
            setMigrationStatus("ERROR...");
            onError();
        },
    });

    /**
     * on accept
     *  1. migrate tree memberships
     *  2. migrate events
     *  3. migrate written stories
     *  4. migrate audio stories
     *  5. update claim request status to accepted
     */
    const treeMigrateMutation = useMutation({
        mutationFn: () => {
            return axios.put(
                `/api/claim-requests-api/v2/migrate-approved/tree-member-tagged-user?unclaimedProfileId=${claimRequest.targetId}&claimerId=${claimRequest.userId}`
            );
        },
    });
    const eventsMigrateMutation = useMutation({
        mutationFn: () => {
            return axios.put(
                `/api/claim-requests-api/v2/migrate-approved/stories-events?unclaimedProfileId=${claimRequest.targetId}&claimerId=${claimRequest.userId}&type=events`
            );
        },
    });
    const writtenStoriesMigrateMutation = useMutation({
        mutationFn: () => {
            return axios.put(
                `/api/claim-requests-api/v2/migrate-approved/stories-events?unclaimedProfileId=${claimRequest.targetId}&claimerId=${claimRequest.userId}&type=writtenStories`
            );
        },
    });
    const audioStoriesMigrateMutation = useMutation({
        mutationFn: () => {
            return axios.put(
                `/api/claim-requests-api/v2/migrate-approved/stories-events?unclaimedProfileId=${claimRequest.targetId}&claimerId=${claimRequest.userId}&type=audioStories`
            );
        },
    });

    const handleMigrationMutation = useMutation({
        mutationFn: () => {
            setMigrationStatus("migrating data...");
            return Promise.all([
                treeMigrateMutation.mutateAsync(),
                eventsMigrateMutation.mutateAsync(),
                writtenStoriesMigrateMutation.mutateAsync(),
                audioStoriesMigrateMutation.mutateAsync(),
            ]);
        },

        onSuccess: (res) => {
            //console.log(res);
            approvedStatusMutation.mutate();
        },
        onError: () => {
            setMigrationStatus("ERROR");
            console.log("migration err");
        },
    });

    const declineMutation = useMutation({
        mutationFn: () => {
            return axios.put(
                `/api/claim-requests-api/v2/${claimRequest._id}?unclaimedProfileId=${claimRequest.targetId}`,
                {
                    status: "declined",
                }
            );
        },
        onSuccess: (res) => {
            onDeclineSuccess();
            queryClient.invalidateQueries({
                queryKey: ["get-claim-requests"],
            });
        },
        onError: () => {
            //notifyError();
            onError();
        },
    });

    return (
        <Paper bg="#F8F9FA" withBorder radius="xl">
            <Stack p="md">
                <Paper withBorder radius="lg" p="md">
                    <Group grow>
                        <Text fw="bold" c="gray">
                            Claimed By
                        </Text>
                        <Text>{claimRequest?.claimerName}</Text>
                    </Group>
                    <Group grow>
                        <Text fw="bold" c="gray">
                            Claimed On
                        </Text>
                        <Text>
                            {claimRequest.createdAt ? (
                                moment(claimRequest.createdAt).format(
                                    "YYYY-MM-DD"
                                )
                            ) : (
                                <>-</>
                            )}
                        </Text>
                    </Group>
                    <Group grow>
                        <Text fw="bold" c="gray">
                            Message
                        </Text>
                        <Text>{claimRequest?.message}</Text>
                    </Group>
                    <Group grow>
                        <Text fw="bold" c="gray">
                            Status
                        </Text>
                        <Text>
                            <Badge
                                color={getPillColorClaimReq(
                                    claimRequest?.status
                                )}
                            >
                                {claimRequest?.status}
                            </Badge>
                        </Text>
                    </Group>
                </Paper>
                <Text color="gray" align="center" size="sm">
                    Approving this request will transfer all Events, Writen
                    Stories, Audio Stories, and Tree Memberships to{" "}
                    <Text span italic>
                        {claimRequest?.claimerName}
                    </Text>
                </Text>
                <Stack spacing={3}>
                    <Text c="dimmed" size="sm">
                        {migrationStatus}
                    </Text>
                    <Group grow>
                        {claimRequest.status !== "approved" && (
                            <Button
                                color="green"
                                loading={handleMigrationMutation.isLoading}
                                onClick={() => handleMigrationMutation.mutate()}
                                disabled={
                                    declineMutation.isLoading ||
                                    approvedStatusMutation.isLoading
                                }
                                radius="lg"
                            >
                                Approve
                            </Button>
                        )}
                        {claimRequest.status !== "declined" && (
                            <Button
                                color="red"
                                onClick={() => declineMutation.mutate()}
                                loading={declineMutation.isLoading}
                                disabled={
                                    handleMigrationMutation.isLoading ||
                                    approvedStatusMutation.isLoading
                                }
                                radius="lg"
                            >
                                Decline
                            </Button>
                        )}
                    </Group>
                    <Button
                        color="gray"
                        onClick={onClose}
                        disabled={
                            declineMutation.isLoading ||
                            handleMigrationMutation.isLoading ||
                            approvedStatusMutation.isLoading
                        }
                        radius="lg"
                    >
                        Cancel
                    </Button>
                </Stack>
            </Stack>
        </Paper>
    );
}
