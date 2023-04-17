import {
    ActionIcon,
    Autocomplete,
    Button,
    Divider,
    Group,
    Paper,
    Skeleton,
    Stack,
    Text,
    TextInput,
    Textarea,
    Title,
    createStyles,
    Notification,
    Image,
} from "@mantine/core";
import {
    IconAlertOctagon,
    IconAnchor,
    IconCheck,
    IconMicrophone,
    IconPencil,
    IconPlant2,
    IconShare,
    IconTrash,
    IconX,
} from "@tabler/icons";
import axios from "axios";
import { useEffect, useState } from "react";
//import { AudioRecorder, useAudioRecorder } from "react-audio-voice-recorder";
import { useQuery } from "react-query";
//import { ReactMic } from "react-mic";

export function MiniAudioStoryCard({
    story,
    setDrawerOpened,
    selectedStory,
    setSelectedStory,
    setViewMode,
    viewMode,
}) {
    const useStyles = createStyles((theme) => ({
        treeLink: {
            textDecoration: "none",
            "&:hover": {
                //border: "1px solid",
                textDecoration: "underline",
                transition: "0.5s",
            },
        },
        card: {
            cursor: "pointer",
            border:
                selectedStory &&
                viewMode !== "add" &&
                story._id.toString() === selectedStory._id.toString()
                    ? "1px solid"
                    : "",
            "&:hover": {
                border: "1px solid",
                textDecoration: "underline",
                transition: "0.5s",
            },
        },
    }));
    const { classes } = useStyles();
    return (
        <Paper
            className={classes.card}
            withBorder
            p="md"
            onClick={() => {
                setViewMode("view");
                setSelectedStory(story);
                setDrawerOpened(true);
            }}
        >
            <Stack spacing={2}>
                <Title order={5} fw={500} c="blue">
                    {story.title}
                </Title>
                <Group>
                    <Text c="dimmed">{story.authorName}</Text>
                </Group>
            </Stack>
        </Paper>
    );
}

export function MiniAudioStoryCardSkeleton() {
    return (
        <Paper withBorder p="md">
            <Stack spacing={2}>
                <Skeleton height={8} radius="xl" />
                <Skeleton height={8} mt={6} radius="xl" />
                <Skeleton height={8} mt={6} radius="xl" />
                <Skeleton height={8} mt={6} width="70%" radius="xl" />
                <Group>
                    <Skeleton height={8} mt={6} width="30%" radius="xl" />
                    <Skeleton height={8} mt={6} width="30%" radius="xl" />
                </Group>
            </Stack>
        </Paper>
    );
}

export function MiniAddAudioStoryCard({
    setViewMode,
    viewMode,
    setDrawerOpened,
}) {
    const useStyles = createStyles((theme) => ({
        card: {
            cursor: "pointer",
            border: viewMode === "add" && "1px solid",
            "&:hover": {
                border: "1px solid",
                textDecoration: "underline",
                transition: "0.5s",
            },
        },
    }));
    const { classes } = useStyles();
    return (
        <Paper
            withBorder
            p="md"
            className={classes.card}
            onClick={() => {
                setDrawerOpened(true);

                setViewMode("add");
            }}
        >
            <Group>
                <IconMicrophone size={20} color="green" />
                <Title order={5} fw={500} c="blue">
                    Record a story
                </Title>
            </Group>
        </Paper>
    );
}
