import {
    Divider,
    Paper,
    Stack,
    Text,
    Title,
    createStyles,
} from "@mantine/core";
import { IconAffiliate } from "@tabler/icons";
import { truncateWord } from "../../../../utils/utils";
import { useQuery } from "react-query";
import axios from "axios";
import { useState } from "react";

const useStyles = createStyles((theme) => ({
    treesSection: {
        marginTop: "2em",
        display: "flex",
        alignItems: "center",
        width: "100%",
        gap: "1em",
        //flexWrap: "wrap",
        overflowY: "auto",
    },
    card: {
        alignSelf: "flex-start",
        "&:hover": {
            background: "#F7F7F7",
            cursor: "pointer",
            transition: "all 0.2s ease-in-out",
        },
    },
}));
export default function ArticleStoriesFromPeopleGrid({ articleId }) {
    const { classes } = useStyles();
    const [selectedStory, setSelectedStory] = useState(null);
    const storiesQuery = useQuery({
        queryKey: ["fetch-featured-stories"],
        queryFn: () => {
            return axios.get(
                `/api/article-shared-written-stories/written-stories-of-article/${articleId}`
            );
        },
        refetchOnWindowFocus: false,
        onSuccess: (res) => {
            //setItems(res.data);
            console.log("stories", res.data);
        },
    });
    return (
        <div className={classes.treesSection}>
            <Stack align="center" spacing={3}>
                <Title
                    align="right"
                    sx={{
                        minWidth: "300px",
                        maxWidth: "300px",
                        fontFamily: "Lora, serif",
                        fontWeight: "200",
                    }}
                >
                    Stories from the People of Tigray
                </Title>
            </Stack>
            <Divider orientation="vertical" ml="md" mr="md" />
            {storiesQuery.data?.data.data.storiesDocs.map((story, i) => {
                return (
                    <Paper
                        withBorder
                        p={10}
                        key={i}
                        miw={350}
                        mih={selectedStory === story._id && 350}
                        className={classes.card}
                        onClick={() =>
                            selectedStory
                                ? setSelectedStory(null)
                                : setSelectedStory(story._id)
                        }
                    >
                        <Stack spacing={3}>
                            <Title
                                align="left"
                                order={4}
                                sx={{
                                    fontFamily: "Lora, serif",
                                    fontWeight: "200",
                                }}
                            >
                                {truncateWord(story?.title, 50) || "loading"}
                            </Title>
                            <Text
                                lineClamp={selectedStory === story._id ? "" : 3}
                                size="sm"
                                color="dimmed"
                            >
                                {story?.content || "loading"}
                            </Text>
                            <Text lineClamp={3} size="xs" color="dimmed">
                                by{" "}
                                <Text span italic>
                                    {story?.isAnnon
                                        ? "Anonymous"
                                        : story?.userName}
                                </Text>
                            </Text>
                        </Stack>
                    </Paper>
                );
            }) || <div>loading...</div>}
        </div>
    );
}
