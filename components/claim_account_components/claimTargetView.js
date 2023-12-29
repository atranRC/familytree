import { Carousel } from "@mantine/carousel";
import {
    Avatar,
    SimpleGrid,
    Stack,
    Title,
    Text,
    Button,
    Loader,
    createStyles,
    Image,
    TextInput,
    Group,
    Paper,
} from "@mantine/core";
import axios from "axios";
import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import moment from "moment";
import toast, { Toaster } from "react-hot-toast";

export function ClaimTargetView({
    targetAccountId,
    name,
    fathersName,
    grandFathersName,
    nicknames,
    birthday,
    sex,
    selectedLocation,
    selectedLocation2,
}) {
    const { data: session } = useSession();

    const notifyError = () => toast.error("Something went wrong");

    const useStyles = createStyles((theme) => ({
        stack: {
            backgroundColor:
                theme.colorScheme === "dark"
                    ? theme.colors.dark[8]
                    : theme.colors.gray[0],
        },
    }));
    const { classes } = useStyles();
    const router = useRouter();
    const [claimButtonDisabled, setClaimButtonDisabled] = useState(false);
    const [message, setMessage] = useState("");
    const [messageError, setMessageError] = useState(false);

    const {
        isLoading: isLoadingTargetAccount,
        isFetching: isFetchingWithTargetAccount,
        data: dataTargetAccount,
        refetch: refetchTargetAccount,
        isError: isErrorTargetAccount,
        error: errorTargetAccount,
    } = useQuery({
        queryKey: "get-target-account",
        queryFn: () => {
            return axios.get("/api/users/" + targetAccountId);
        },
        onSuccess: (d) => {
            console.log("target fetched", d.data.data);
        },
    });

    const {
        isLoading: isLoadingNewUser,
        isFetching: isFetchingNewUser,
        data: dataNewUser,
        refetch: refetchNewUser,
        isError: isErrorNewUser,
        error: errorNewUser,
    } = useQuery({
        queryKey: "get-new-user",
        queryFn: () => {
            return axios.get("/api/users/users-mongoose/" + session.user.email);
        },
        onSuccess: (d) => {
            console.log("new user fetched", d.data.data);
        },
    });

    /*const {
        isLoading: isLoadingCreateRequest,
        isFetching: isFetchingCreateRequest,
        data: dataCreateRequest,
        refetch: refetchCreateRequest,
        isError: isErrorCreateRequest,
        error: errorCreateRequest,
    } = useQuery({
        queryKey: "create-claim-request",
        queryFn: () => {
            const bod = {
                userId: dataNewUser.data.data._id.toString(),
                targetId: dataTargetAccount.data.data._id.toString(),
                targetOwnerId: dataTargetAccount.data.data.owner
                    ? dataTargetAccount.data.data.owner
                    : "none",
                name: dataTargetAccount.data.data.name,
                claimerName: dataNewUser.data.data.name,
                message: message,
                status: "pending",
            };
            
            return axios.post("/api/claim-requests-api/", bod);
        },
        enabled: false,
        onSuccess: (d) => {
            setClaimButtonDisabled(true);
            //console.log("target fetched", d.data.data);
            router.push("/family-tree/tree/my-trees");
        },
    });*/

    const createClaimMutation = useMutation({
        mutationFn: () => {
            const bod = {
                userId: dataNewUser.data.data._id.toString(),
                targetId: dataTargetAccount.data.data._id.toString(),
                targetOwnerId: dataTargetAccount.data.data.owner
                    ? dataTargetAccount.data.data.owner
                    : "none",
                name: dataTargetAccount.data.data.name,
                claimerName: dataNewUser.data.data.name,
                message: message,
                status: "pending",
            };

            return axios.post("/api/claim-requests-api/v2", bod);
        },
        onSuccess: (res) => {
            setClaimButtonDisabled(true);
            router.push("/family-tree/tree/my-trees");
        },
        onError: () => {
            notifyError();
        },
    });

    const updateUserInfo = useQuery({
        queryKey: "update-new-user-info",
        queryFn: () => {
            return axios.put(
                "/api/users/add-new-user-info/" + session.user.email,
                {
                    name: name.value,
                    birth_place: {
                        value: selectedLocation2.value,
                        lon: selectedLocation2.lon
                            ? selectedLocation2.lon
                            : "39.476826",
                        lat: selectedLocation2.lat
                            ? selectedLocation2.lat
                            : "13.496664",
                    },
                    birthday: birthday,
                    owner: "self",
                    current_residence: {
                        value: selectedLocation.value,
                        lon: selectedLocation.lon
                            ? selectedLocation.lon
                            : "39.476826",
                        lat: selectedLocation.lat
                            ? selectedLocation.lat
                            : "13.496664",
                    },
                    fathers_name: fathersName.value,
                    last_name: grandFathersName,
                    nicknames: nicknames,
                    sex: sex,
                    isHistorian: false,
                    isBlocked: false,
                }
            );
        },
        enabled: false,
        onSuccess: (d) => {
            setClaimButtonDisabled(true);
            createClaimMutation.mutate();
            //console.log("target fetched", d.data.data);
        },
    });

    const createClaimRequestHandler = () => {
        if (message === "") {
            setMessageError(true);
        } else {
            updateUserInfo.refetch();
        }
    };

    return (
        <>
            {dataTargetAccount ? (
                <Stack
                    sx={{
                        backgroundColor: "#F8F9FA",

                        borderRadius: "1.5rem",
                    }}
                    p="sm"
                >
                    <Stack justify="center" align="center">
                        <Avatar
                            src={dataTargetAccount.data?.data?.image}
                            alt="it's me"
                            size="xl"
                            color="teal"
                            radius="xl"
                        />
                    </Stack>

                    <Stack justify="center" align="center">
                        <h1
                            style={{ color: "darkgreen", textAlign: "center" }}
                        >{`${dataTargetAccount.data?.data?.name} ${dataTargetAccount.data?.data?.fathers_name} ${dataTargetAccount.data?.data?.last_name}`}</h1>
                    </Stack>

                    <Paper withBorder p="sm" radius="1.5rem">
                        <Stack>
                            <Stack justify="center" align="center" spacing={1}>
                                <Title order={4}>
                                    {moment(
                                        dataTargetAccount.data?.data?.birthday
                                    ).format("YYYY-MM-DD")}
                                </Title>
                                <Text color="teal">Born</Text>
                            </Stack>
                            <Stack justify="center" align="center" spacing={1}>
                                <Title order={4}>
                                    {
                                        dataTargetAccount.data?.data
                                            ?.birth_place?.value
                                    }
                                </Title>
                                <Text color="teal">Birthplace</Text>
                            </Stack>
                            {dataTargetAccount.data?.data
                                ?.current_residence && (
                                <Stack
                                    justify="center"
                                    align="center"
                                    spacing={1}
                                >
                                    <Title order={4}>
                                        {
                                            dataTargetAccount.data?.data
                                                ?.current_residence?.value
                                        }
                                    </Title>
                                    <Text color="teal">Current residence</Text>
                                </Stack>
                            )}
                            <Stack></Stack>
                            {dataTargetAccount.data?.data?.nicknames && (
                                <Stack
                                    justify="center"
                                    align="center"
                                    spacing={1}
                                >
                                    <Title order={4}>
                                        {
                                            dataTargetAccount.data?.data
                                                ?.nicknames
                                        }
                                    </Title>
                                    <Text color="teal">Nicknames</Text>
                                </Stack>
                            )}
                        </Stack>
                    </Paper>
                    {/*<Button
                        variant="outline"
                        radius="1.5rem"
                        onClick={() =>
                            window.open(
                                `/profiles/${dataTargetAccount.data?.data?._id.toString()}/events`,
                                "_blank",
                                "noopener noreferrer"
                            )
                        }
                    >
                        view profile
                    </Button>*/}

                    <TextInput
                        label="Message"
                        placeholder="your short message"
                        description="Send a message to the current owner of this unclaimed account"
                        inputWrapperOrder={[
                            "label",
                            "description",
                            "error",
                            "input",
                        ]}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        error={messageError && "please enter message"}
                        onFocus={() => setMessageError(false)}
                    />
                    <Button
                        fullWidth
                        mt="xl"
                        size="md"
                        onClick={createClaimRequestHandler}
                        loading={createClaimMutation.isLoading}
                        disabled={claimButtonDisabled}
                    >
                        Claim Account
                    </Button>
                    <Toaster />
                </Stack>
            ) : (
                <Loader />
            )}
        </>
    );
}
