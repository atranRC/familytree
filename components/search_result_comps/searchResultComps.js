import {
    Divider,
    Paper,
    ScrollArea,
    SimpleGrid,
    Stack,
    Title,
    Text,
    ThemeIcon,
    Image,
    Pagination,
} from "@mantine/core";
import { SmallSearchResultUserCard } from "../user_view_cards/userInfoCard";
import useFamTreePageStore from "../../lib/stores/famtreePageStore";
import { useEffect, useState } from "react";

export function SomethingWentWrong({ type }) {
    const setNewRelativeUserToView = useFamTreePageStore(
        (state) => state.setNewRelativeUserToView
    );
    const newRelativeChosenMethod = useFamTreePageStore(
        (state) => state.newRelativeChosenMethod
    );
    const setActiveStep = useFamTreePageStore((state) => state.setActiveStep);
    const setNewRelativeUserToCreate = useFamTreePageStore(
        (state) => state.setNewRelativeUserToCreate
    );
    const handleCreate = () => {
        //set new relative to create to true
        setNewRelativeUserToCreate(true);
        //set active step to 2
        setActiveStep(2);
    };
    return (
        <Paper withBorder p="lg">
            <Stack spacing={0} align="center" justify="center" mb="xl">
                {type === "error" ? (
                    <>
                        <ThemeIcon color="dimmed" radius="xl" size={300}>
                            <Image
                                p={10}
                                src="https://img.freepik.com/free-vector/yes-no-concept-illustration_114360-7960.jpg"
                            />
                        </ThemeIcon>
                        <Title c="skyblue" fw={500} order={3} align="center">
                            Something went wrong 😕
                        </Title>
                    </>
                ) : (
                    <>
                        <ThemeIcon color="dimmed" radius="xl" size={300}>
                            <Image
                                p={10}
                                src="https://img.freepik.com/free-vector/yes-no-concept-illustration_114360-7960.jpg"
                            />
                        </ThemeIcon>
                        <Title c="skyblue" fw={500} order={3} align="center">
                            No similar profiles in our database 😕
                        </Title>
                    </>
                )}

                <Title order={6} fw={500} c="dimmed" align="center">
                    We couldn't find the person you were looking for.{" "}
                    <Text
                        span
                        style={{
                            color: "blue",
                            textDecoration: "underline",
                            cursor: "pointer",
                        }}
                        onClick={() => setActiveStep(0)}
                    >
                        Go back
                    </Text>{" "}
                    to search or{" "}
                    {newRelativeChosenMethod === "info" ? (
                        <Text
                            span
                            style={{
                                color: "blue",
                                textDecoration: "underline",
                                cursor: "pointer",
                            }}
                            onClick={handleCreate}
                        >
                            Create
                        </Text>
                    ) : (
                        "create"
                    )}{" "}
                    a profile for them.
                </Title>
            </Stack>
        </Paper>
    );
}

export function AddFamilyMemberSearchResult({ userList }) {
    const setNewRelativeUserToView = useFamTreePageStore(
        (state) => state.setNewRelativeUserToView
    );
    const newRelativeChosenMethod = useFamTreePageStore(
        (state) => state.newRelativeChosenMethod
    );
    const setActiveStep = useFamTreePageStore((state) => state.setActiveStep);
    const setNewRelativeUserToCreate = useFamTreePageStore(
        (state) => state.setNewRelativeUserToCreate
    );
    const handleCardClick = (user) => {
        setNewRelativeUserToCreate(false);
        console.log("hello");
        setNewRelativeUserToView(user);
        setActiveStep(2);
    };
    const handleCreate = () => {
        //set new relative to create to true
        setNewRelativeUserToCreate(true);
        //set active step to 2
        setActiveStep(2);
    };

    return (
        <Stack spacing="sm">
            <Paper withBorder p="md">
                <Stack>
                    <Title order={4} color="skyblue" fw={500} align="center">
                        We found the following people in our database:
                    </Title>
                    <Divider />
                    <ScrollArea style={{ height: 350 }}>
                        {Array.isArray(userList) ? (
                            userList.map((user) => {
                                return (
                                    <div
                                        key={user._id.toString()}
                                        onClick={() => handleCardClick(user)}
                                    >
                                        <SmallSearchResultUserCard
                                            user={user}
                                        />
                                    </div>
                                );
                            })
                        ) : (
                            <div onClick={() => handleCardClick(userList)}>
                                <SmallSearchResultUserCard user={userList} />
                            </div>
                        )}
                    </ScrollArea>
                </Stack>
            </Paper>
            <Paper withBorder p="md">
                <Title order={6} fw={500} c="dimmed">
                    Not the person you're looking for?{" "}
                    <Text
                        span
                        style={{
                            color: "blue",
                            textDecoration: "underline",
                            cursor: "pointer",
                        }}
                        onClick={() => setActiveStep(0)}
                    >
                        Go back
                    </Text>{" "}
                    to search or{" "}
                    {newRelativeChosenMethod === "info" ? (
                        <Text
                            span
                            style={{
                                color: "blue",
                                textDecoration: "underline",
                                cursor: "pointer",
                            }}
                            onClick={handleCreate}
                        >
                            Create
                        </Text>
                    ) : (
                        "create"
                    )}{" "}
                    a profile for them.
                </Title>
            </Paper>
        </Stack>
    );
}

export function AddCollabSearchResult({ userList }) {
    const setNewCollabToView = useFamTreePageStore(
        (state) => state.setNewCollabToView
    );
    const setCollabActiveStep = useFamTreePageStore(
        (state) => state.setCollabActiveStep
    );

    const handleCardClick = (user) => {
        setNewCollabToView(user);
        setCollabActiveStep(2);
    };

    return (
        <Stack spacing="sm">
            <Paper withBorder p="md">
                <Stack>
                    <Title order={4} color="skyblue" fw={500} align="center">
                        We found the following people in our database:
                    </Title>
                    <Divider />
                    <ScrollArea style={{ height: 350 }}>
                        {Array.isArray(userList) ? (
                            userList.map((user) => {
                                return (
                                    <div
                                        key={user._id.toString()}
                                        onClick={() => handleCardClick(user)}
                                    >
                                        <SmallSearchResultUserCard
                                            user={user}
                                        />
                                    </div>
                                );
                            })
                        ) : (
                            <div onClick={() => handleCardClick(userList)}>
                                <SmallSearchResultUserCard user={userList} />
                            </div>
                        )}
                    </ScrollArea>
                </Stack>
            </Paper>
        </Stack>
    );
}
