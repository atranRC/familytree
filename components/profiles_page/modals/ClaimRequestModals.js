import {
    Avatar,
    Button,
    Group,
    Loader,
    Paper,
    Stack,
    Title,
    Text,
    Divider,
    Badge,
} from "@mantine/core";
import axios from "axios";
import { useState } from "react";
import { useQuery } from "react-query";

export function ClaimRequestModalContent({ claimRequest }) {
    const [declineButtonDisabled, setDeclineButtonDisabled] = useState(false);
    const [approveButtonDisabled, setApproveButtonDisabled] = useState(false);
    const {
        isLoading: isLoadingClaimer,
        isFetching: isFetchingClaimer,
        data: dataClaimer,
        refetch: refetchClaimer,
        isError: isErrorClaimer,
        error: errorClaimer,
    } = useQuery({
        queryKey: "get-claimer-account",
        queryFn: () => {
            return axios.get("/api/users/" + claimRequest.userId);
        },
        onSuccess: (d) => {
            console.log("claimer fetched", d.data.data);
        },
    });
    const {
        isLoading: isLoadingDecline,
        isFetching: isFetchingDecline,
        data: dataDecline,
        refetch: refetchDecline,
        isError: isErrorDecline,
        error: errorDecline,
    } = useQuery({
        queryKey: "decline-req",
        queryFn: () => {
            const bod = {
                status: "declined",
            };
            return axios.put(
                "/api/claim-requests-api/" + claimRequest._id.toString(),
                bod
            );
        },
        enabled: false,
        onSuccess: (d) => {
            /*Router.reload(
                `/profiles/${claimRequest.targetId}/claim-requests`
            );*/
            setDeclineButtonDisabled(true);
            window.location.reload();
        },
    });
    const {
        isLoading: isLoadingApprove,
        isFetching: isFetchingApprove,
        data: dataApprove,
        refetch: refetchApprove,
        isError: isErrorApprove,
        error: errorApprove,
    } = useQuery({
        queryKey: "approve-req",
        queryFn: () => {
            const bod = {
                filterIdName: {
                    //treemembers id of the unclaimed account
                    id: claimRequest.targetId,
                },
                newDataIdName: {
                    id: claimRequest.userId, //id of the claimer
                    name: claimRequest.claimerName, //name of the claimer
                },
                filterParent: {
                    parent_id: claimRequest.targetId, //id of the unclaimed account
                },
                newDataParent: {
                    parent_id: claimRequest.userId, //id of the new claimer
                },
            };
            return axios.put(
                "/api/claim-requests-api/update-approved-req/",
                bod
            );
        },
        enabled: false,
        onSuccess: (d) => {
            /*Router.reload(
                `/profiles/${claimRequest.targetId}/claim-requests`
            );*/
            setApproveButtonDisabled(true);
            window.location.reload();
        },
    });
    const handleDecline = () => {
        refetchDecline();
    };
    const handleApprove = () => {
        refetchApprove();
    };
    const getBadgeColor = () => {
        let color = "yellow";
        if (claimRequest.status === "approved") {
            color = "green";
        }
        if (claimRequest.status === "declined") {
            color = "red";
        }
        return color;
    };
    return (
        <>
            {dataClaimer ? (
                <>
                    <Stack
                        bg="#f7f9fc"
                        spacing="md"
                        align="center"
                        justify="center"
                        p="sm"
                    >
                        <Paper withBorder w="100%" p="sm">
                            <Stack
                                spacing=" sm"
                                align="center"
                                justify="center"
                            >
                                <Avatar
                                    src={dataClaimer.data.data.image}
                                    radius="lg"
                                    size="lg"
                                />
                                <Title order={4} fw={500}>
                                    {dataClaimer.data.data.name}
                                </Title>
                            </Stack>
                        </Paper>
                        <Paper withBorder w="100%" p="sm">
                            <Title order={5} fw={500} ta="center">
                                Request Details
                            </Title>
                            <Divider my="sm" />
                            <Text>
                                <Text span color="dimmed">
                                    Profile Requested
                                </Text>
                                : {claimRequest.name}
                            </Text>
                            <Text>
                                <Text span color="dimmed">
                                    Request Message
                                </Text>
                                : {claimRequest.message}
                            </Text>
                            <Text>
                                <Text span color="dimmed">
                                    Status
                                </Text>
                                :{" "}
                                <Badge color={getBadgeColor()}>
                                    {claimRequest.status}
                                </Badge>
                            </Text>
                        </Paper>
                        <Paper withBorder w="100%" p="sm">
                            <Group grow>
                                <Button
                                    onClick={handleApprove}
                                    loading={
                                        isLoadingApprove || isFetchingApprove
                                    }
                                    disabled={approveButtonDisabled}
                                >
                                    Approve
                                </Button>
                                <Button
                                    color="red"
                                    onClick={handleDecline}
                                    loading={
                                        isLoadingDecline || isFetchingDecline
                                    }
                                    disabled={declineButtonDisabled}
                                >
                                    Decline
                                </Button>
                            </Group>
                        </Paper>
                    </Stack>
                </>
            ) : (
                <Loader />
            )}
        </>
    );
}
