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
import { useQuery } from "react-query";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

export function ClaimTargetView({ targetAccountId }) {
    const { data: session } = useSession();

    const accountAlbum = [
        "https://images.unsplash.com/photo-1672327114747-261be18f4907?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=449&q=80",
        "https://images.unsplash.com/photo-1671826638399-54ac6a5447ba?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
        "https://images.unsplash.com/photo-1664575602807-e002fc20892c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
        "https://plus.unsplash.com/premium_photo-1668127296901-0e01aab056f0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=435&q=80",
        "https://images.unsplash.com/photo-1672259391793-84ea24f38810?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=869&q=80",
    ];
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

    const {
        isLoading: isLoadingCreateRequest,
        isFetching: isFetchingCreateRequest,
        data: dataCreateRequest,
        refetch: refetchCreateRequest,
        isError: isErrorCreateRequest,
        error: errorCreateRequest,
    } = useQuery({
        queryKey: "create-request",
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
            console.log(bod);
            return axios.post("/api/claim-requests-api/", bod);
        },
        enabled: false,
        onSuccess: (d) => {
            setClaimButtonDisabled(true);
            console.log("target fetched", d.data.data);
            router.push("/demo/auth-demo");
        },
    });

    const createClaimRequestHandler = () => {
        if (message === "") {
            setMessageError(true);
        } else {
            refetchCreateRequest();
        }
    };

    return (
        <>
            {dataTargetAccount ? (
                <Stack
                    width="100%"
                    spacing={10}
                    align={"center"}
                    className={classes.stack}
                    p="md"
                >
                    <Avatar size="xl" src={dataTargetAccount.data.data.image} />
                    <Title order={2}>
                        {dataTargetAccount.data.data.name}{" "}
                        {dataTargetAccount.data.data.fathers_name}{" "}
                        {dataTargetAccount.data.data.last_name}
                    </Title>
                    <Title c="dimmed" fw={500} order={6} align="center" mb="sm">
                        {dataTargetAccount.data.data.current_residence.value}
                    </Title>

                    <Group spacing="xl">
                        <div>
                            <Title order={5} color="dimmed" weight={500}>
                                Born
                            </Title>

                            {dataTargetAccount.data.data.birthday && (
                                <Text fw={500}>
                                    {
                                        dataTargetAccount.data.data.birthday
                                            .toString()
                                            .split("T")[0]
                                    }
                                </Text>
                            )}
                        </div>

                        <div>
                            <Title order={5} color="dimmed" weight={500}>
                                Nicknames
                            </Title>

                            <Text fw={500}>
                                {dataTargetAccount.data.data.nicknames}
                            </Text>
                        </div>
                    </Group>

                    <Title order={5} color="dimmed" weight={500}>
                        Photos
                    </Title>
                    <Carousel
                        withIndicators
                        height={200}
                        slideSize="33.333333%"
                        slideGap="md"
                        speed={20}
                        align="start"
                        loop
                        breakpoints={[
                            {
                                maxWidth: "md",
                                slideSize: "50%",
                            },
                            {
                                maxWidth: "sm",
                                slideSize: "100%",
                                slideGap: 0,
                            },
                        ]}
                    >
                        {accountAlbum.map((accAl) => {
                            return (
                                <Carousel.Slide key={accAl}>
                                    <Image src={accAl} />
                                </Carousel.Slide>
                            );
                        })}
                    </Carousel>
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
                        loading={
                            isFetchingCreateRequest || isLoadingCreateRequest
                        }
                        disabled={claimButtonDisabled}
                    >
                        Claim Account
                    </Button>
                </Stack>
            ) : (
                <Loader />
            )}
        </>
    );
}
