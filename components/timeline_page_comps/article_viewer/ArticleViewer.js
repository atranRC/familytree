import {
    ActionIcon,
    Button,
    Container,
    CopyButton,
    Divider,
    Group,
    Loader,
    Modal,
    NativeSelect,
    Paper,
    Stack,
    Text,
    Textarea,
    Title,
    Tooltip,
    Notification,
} from "@mantine/core";
import { IconCheck, IconFlag, IconShare } from "@tabler/icons";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import styles from "./ArticleViewer.module.css";

function FlagArticleComp({ articleId, articleTitle, setFlaggedArticleObj }) {
    const [flagType, setFlagType] = useState("");
    const [message, setMessage] = useState("");
    const [flaggedNotificationOpen, setFlaggedNotificationOpened] =
        useState(false);
    const flagTypes = [
        { value: "", label: "Select" },
        { value: "inaccurate", label: "Inaccurate Information" },
        { value: "spam", label: "Spam" },
        { value: "hateful", label: "Hateful Content" },
        { value: "irrelevant", label: "Irrelevant Information" },
    ];

    const { isLoading, isFetching, data, refetch, isError, error } = useQuery({
        queryKey: "flag-article",
        queryFn: () => {
            const bod = {
                articleId: articleId,
                articleTitle: articleTitle,
                type: flagType,
                description: message,
            };
            return axios.post("/api/flagged-articles", bod);
        },
        enabled: false,
        onSuccess: (d) => {
            //console.log("article flagged", d.data.data);
            //save flagged article to localStorage
            let existingFlags = JSON.parse(
                localStorage.getItem("flaggedArticles")
            );
            if (existingFlags == null) existingFlags = [];
            console.log("exisexis", existingFlags);
            existingFlags.push({
                articleId: articleId,
                flagId: d.data.data._id.toString(),
            });
            localStorage.setItem(
                "flaggedArticles",
                JSON.stringify(existingFlags)
            );

            setFlaggedArticleObj(d.data.data);

            setFlaggedNotificationOpened(true);
            setMessage("");
            setFlagType("");
        },
    });
    return (
        <Stack>
            <NativeSelect
                data={flagTypes}
                label="What's wrong with this article?"
                description="Select One"
                withAsterisk
                value={flagType}
                onChange={(event) => setFlagType(event.currentTarget.value)}
            />
            <Textarea
                placeholder="Your message..."
                label="Add a message (optional)"
                value={message}
                onChange={(event) => setMessage(event.currentTarget.value)}
            />
            {flaggedNotificationOpen && (
                <Notification
                    title="Article Flagged"
                    onClose={() => setFlaggedNotificationOpened(false)}
                >
                    You have reported this article.
                </Notification>
            )}
            <Button
                color="red"
                disabled={flagType === "" || message === ""}
                onClick={() => {
                    refetch();
                }}
                loading={isLoading || isFetching}
            >
                Report
            </Button>
        </Stack>
    );
}

export function ArticleViewer({ articleId }) {
    const router = useRouter();
    const [viewMode, setViewMode] = useState("article");
    const [flagModalOpened, setFlagModalOpened] = useState(false);
    const [flaggedArticleObj, setFlaggedArticleObj] = useState(null);

    const { isLoading, isFetching, data, refetch, isError, error } = useQuery({
        queryKey: "fetch-article",
        queryFn: () => {
            return axios.get(`/api/articles/${articleId}`);
        },
        enabled: false,
        onSuccess: (d) => {
            console.log("article ", d.data.data);
            //setFlaggedArticleObj(null);
        },
    });

    const {
        isLoading: isLoadingUnflag,
        isFetching: isFetchingUnflag,
        data: dataUnflag,
        refetch: refetchUnflag,
    } = useQuery({
        queryKey: "unflag-article",
        queryFn: () => {
            return axios.get(
                `/api/flagged-articles/${flaggedArticleObj.flagId.toString()}`
            );
        },
        enabled: false,
        onSuccess: (d) => {
            console.log("article ", d.data.data);

            //remove flag from local storage
            const existingFlags = JSON.parse(
                localStorage.getItem("flaggedArticles")
            );

            const updatedFlags = existingFlags.filter(
                (flag) =>
                    flag.flagId.toString() !==
                    flaggedArticleObj.flagId.toString()
            );

            localStorage.setItem(
                "flaggedArticles",
                JSON.stringify(updatedFlags)
            );

            setFlaggedArticleObj(null);
        },
    });

    useEffect(() => {
        refetch();
        //get flagged articles from localStorage
        const existingFlags = JSON.parse(
            localStorage.getItem("flaggedArticles")
        );
        console.log("existingFlags", existingFlags);
        if (existingFlags) {
            console.log("existinggg", existingFlags.length);
            const flaggedArticle = existingFlags.filter(
                (flag) => flag.articleId === articleId
            );

            if (flaggedArticle.length > 0) {
                setFlaggedArticleObj(flaggedArticle[0]);
            } else {
                setFlaggedArticleObj(null);
            }
        }
    }, [articleId]);

    const handleUnflag = () => {
        console.log("unflagging", flaggedArticleObj);
        refetchUnflag();
    };
    return (
        <div className={styles.container}>
            {data && (
                <Container size="lg" p="sm">
                    <Stack>
                        <Paper p="md" withBorder>
                            {isLoading || isFetching ? (
                                <Loader />
                            ) : (
                                <Group position="apart">
                                    <Group>
                                        <Title> {data.data.data.title} </Title>
                                        <CopyButton
                                            value={`/timeline?articleId=${articleId}`}
                                            timeout={2000}
                                        >
                                            {({ copied, copy }) => (
                                                <Tooltip
                                                    label={
                                                        copied
                                                            ? "Copied"
                                                            : "Copy"
                                                    }
                                                    withArrow
                                                    position="right"
                                                >
                                                    <ActionIcon
                                                        color={
                                                            copied
                                                                ? "teal"
                                                                : "gray"
                                                        }
                                                        onClick={copy}
                                                    >
                                                        {copied ? (
                                                            <IconCheck
                                                                size="1rem"
                                                                color="green"
                                                            />
                                                        ) : (
                                                            <IconShare
                                                                size="1rem"
                                                                color="green"
                                                            />
                                                        )}
                                                    </ActionIcon>
                                                </Tooltip>
                                            )}
                                        </CopyButton>
                                        <Divider orientation="vertical" />
                                        {flaggedArticleObj ? (
                                            <Text fs="italic" fz="sm">
                                                you've flagged this article{" "}
                                                {" - "}
                                                <Text
                                                    span
                                                    color="blue"
                                                    onClick={handleUnflag}
                                                    style={{
                                                        cursor: "pointer",
                                                    }}
                                                >
                                                    unflag
                                                </Text>
                                            </Text>
                                        ) : (
                                            <ActionIcon
                                                color="red"
                                                onClick={() =>
                                                    setFlagModalOpened(true)
                                                }
                                            >
                                                <IconFlag size="1.125rem" />
                                            </ActionIcon>
                                        )}
                                    </Group>
                                    <Group>
                                        <Text
                                            fz="sm"
                                            className={styles.articleDiscussion}
                                            onClick={() =>
                                                setViewMode("article")
                                            }
                                            style={{
                                                textDecoration:
                                                    viewMode === "article" &&
                                                    "underline",
                                                color:
                                                    viewMode === "article" &&
                                                    "black",
                                            }}
                                        >
                                            Article
                                        </Text>
                                        <Divider orientation="vertical" />
                                        <Text
                                            fz="sm"
                                            className={styles.articleDiscussion}
                                            onClick={() =>
                                                setViewMode("discussion")
                                            }
                                            style={{
                                                textDecoration:
                                                    viewMode === "discussion" &&
                                                    "underline",
                                                color:
                                                    viewMode === "discussion" &&
                                                    "black",
                                            }}
                                        >
                                            Discussion
                                        </Text>
                                    </Group>
                                </Group>
                            )}
                        </Paper>

                        {/*<Paper p="md" withBorder>
                            {viewMode === "article" ? (
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: data.data.data.content,
                                    }}
                                ></div>
                            ) : (
                                <div>Discussion page</div>
                            )}
                        </Paper>*/}
                        {/*<Button
                            onClick={() =>
                                router.push(
                                    "/timeline?articleId=63f8f72e6b1c43d472fd4ec4#atran2"
                                )
                            }
                        >
                            anc
                        </Button>*/}
                    </Stack>
                </Container>
            )}
            <Modal
                opened={flagModalOpened}
                onClose={() => setFlagModalOpened(false)}
                title="Flag this article?"
                centered
            >
                {data ? (
                    <FlagArticleComp
                        articleId={articleId}
                        articleTitle={data.data.data.title}
                        setFlaggedArticleObj={setFlaggedArticleObj}
                    />
                ) : (
                    <Loader />
                )}
            </Modal>
            {data &&
                (viewMode === "article" ? (
                    <div
                        className={styles.articleSection}
                        dangerouslySetInnerHTML={{
                            __html: data.data.data.content,
                        }}
                    ></div>
                ) : (
                    <div>Discussion page</div>
                ))}
        </div>
    );
}
