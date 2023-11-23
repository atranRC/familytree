import { useState } from "react";
import { useStyles } from "./ArticleSharedStoryPreviewCardStyles";
import { useQuery } from "react-query";
import axios from "axios";
import { ActionIcon, Button, Group, Skeleton, Text } from "@mantine/core";
import {
    IconArrowsMaximize,
    IconArrowsMinimize,
    IconExternalLink,
} from "@tabler/icons";

export default function ArticleSharedStoryPreviewCard({ story, onReadMore }) {
    const [expanded, setExpanded] = useState(false);
    const { classes } = useStyles({ expanded });

    /*const docsQuery = useQuery({
        queryKey: ["article-shared-story-query", story._id],
        //enabled: false,
        refetchOnWindowFocus: false,
        queryFn: async () => {
            return axios.get(`/api/written-stories/${story.writtenStoryId}`);
        },
        onSuccess: (result) => {
            //console.log(result.data?.data?.stories);
        },
    });

    if (docsQuery.isLoading)
        return <Skeleton m="md" height={200} width={350} radius="xl" />;
    if (docsQuery.isError) return <div>ERROR</div>;*/

    return (
        <div style={{ padding: "10px", height: "100%" }}>
            <div className={classes.div1}>
                <div className={classes.whiteBg}></div>
                <div className={classes.nameCont}>
                    <div className={classes.name}>{story.userName}</div>
                </div>

                <div className={classes.div2}>
                    <Group>
                        <ActionIcon
                            variant="outline"
                            onClick={() => setExpanded(!expanded)}
                            ml="sm"
                            mt="sm"
                            size="md"
                        >
                            {!expanded ? (
                                <IconArrowsMaximize color="white" />
                            ) : (
                                <IconArrowsMinimize color="white" />
                            )}
                        </ActionIcon>

                        <Button
                            mt="sm"
                            compact
                            rightIcon={<IconExternalLink />}
                            onClick={onReadMore}
                        >
                            read
                        </Button>
                    </Group>

                    {expanded ? (
                        <div className={classes.contentPreview}>
                            {story?.content}
                        </div>
                    ) : (
                        <div className={classes.title}>{story?.title}</div>
                    )}
                </div>
            </div>
        </div>
    );
}
