import { useState } from "react";
import ArticleSharedStoryPreviewCard from "../../story_cards/ArticleSharedStoryPreviewCard/ArticleSharedStoryPreviewCard";
import { useQuery } from "react-query";
import axios from "axios";
import NoArticleSharedStories from "../../empty_data_comps/no_shared_stories/NoArticleSharedStories";
import { Modal, Pagination, Skeleton, Stack } from "@mantine/core";
import WrittenStoryViwerV2 from "../../story_viewers/WrittenStoryViewerV2";

export default function ArticleSharedStoriesGrid({ articleId }) {
    const [page, setPage] = useState(1);
    const [storyModalOpened, setStoryModalOpened] = useState(false);
    const [selectedStory, setSelectedStory] = useState();

    const docsQuery = useQuery({
        queryKey: ["article-shared-stories-query", articleId, page],
        //enabled: false,
        refetchOnWindowFocus: false,
        queryFn: async () => {
            return axios.get(
                `/api/article-shared-written-stories/written-stories-of-article/${articleId}?p=${page}`
            );
        },
        onSuccess: (result) => {
            console.log(result.data?.data?.storiesDocs);
        },
    });

    if (docsQuery.isLoading)
        return (
            <div
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    //border: "1px solid",
                }}
            >
                {Array.from({ length: 5 }).map((_, index) => (
                    <Skeleton
                        key={index}
                        m="md"
                        height={200}
                        width={350}
                        radius="xl"
                    />
                ))}
            </div>
        );
    if (docsQuery.isError) return <div>ERROR</div>;
    if (docsQuery.data?.data?.data?.pagination?.count < 1)
        return <NoArticleSharedStories />;

    return (
        <Stack>
            <div
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    //border: "1px solid",
                }}
            >
                {docsQuery.data?.data?.data?.storiesDocs.map((story) => (
                    <ArticleSharedStoryPreviewCard
                        key={story._id}
                        story={story}
                        onReadMore={() => {
                            setSelectedStory(story);
                            setStoryModalOpened(true);
                        }}
                    />
                ))}
            </div>
            <Pagination
                page={page}
                onChange={setPage}
                total={docsQuery.data?.data?.data?.pagination?.pageCount}
                siblings={1}
                initialPage={1}
                position="center"
            />
            <Modal
                opened={storyModalOpened}
                onClose={() => setStoryModalOpened(false)}
                //title="This is fullscreen modal!"
                size="xl"
                overflow="inside"
            >
                <WrittenStoryViwerV2 storyId={selectedStory?.writtenStoryId} />
            </Modal>
        </Stack>
    );
}
