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
    Box,
    createStyles,
    Popover,
} from "@mantine/core";
import {
    IconChartTreemap,
    IconCheck,
    IconFlag,
    IconListSearch,
    IconMenu2,
    IconShare,
    IconWriting,
    IconX,
} from "@tabler/icons";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useSession } from "next-auth/react";
import styles from "./WikiViewer.module.css";

function FlagArticleComp({
    articleId,
    articleTitle,
    setFlaggedArticleObj,
    setIsFlagged,
}) {
    const { data: session, status } = useSession();
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
        queryKey: "flag-wiki",
        queryFn: () => {
            const bod = {
                wikiId: articleId,
                flaggedBy: session.user.email,
                wikiTitle: articleTitle,
                type: flagType,
                description: message,
            };
            return axios.post(`/api/flagged-wikis/`, bod);
        },
        enabled: false,
        onSuccess: (d) => {
            setFlaggedArticleObj(d.data.data);

            setFlaggedNotificationOpened(true);
            setMessage("");
            setFlagType("");
            setIsFlagged(true);
        },
    });

    if (!session) {
        return <div>Sign in to flag this page</div>;
    }

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

export function OldWikiViewer({ articleId }) {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [viewMode, setViewMode] = useState("article");
    const [flagModalOpened, setFlagModalOpened] = useState(false);
    const [flaggedArticleObj, setFlaggedArticleObj] = useState(null);
    const [tableOfContents, setTableOfContents] = useState(null);
    const [showTableOfContents, setShowTableOfContents] = useState(false);
    const [isFlagged, setIsFlagged] = useState(false);

    const [signInToFlagPopover, setSignInToFlagPopover] = useState(false);

    const { isLoading, isFetching, data, refetch, isError, error } = useQuery({
        queryKey: "fetch_wiki",
        queryFn: () => {
            return axios.get(`/api/wikis/${articleId}`);
        },
        enabled: false,
        onSuccess: (d) => {
            //setFlaggedArticleObj(null);
        },
    });

    const {
        isLoading: isLoadingUnflag,
        isFetching: isFetchingUnflag,
        data: dataUnflag,
        refetch: refetchUnflag,
    } = useQuery({
        queryKey: "unflag_wiki",
        queryFn: () => {
            return axios.delete(
                `/api/flagged-wikis/user-has-flagged/${articleId}?email=${session.user.email}`
            );
        },
        enabled: false,
        onSuccess: (d) => {
            //console.log(d);
            setIsFlagged(false);
        },
    });

    const {
        isLoading: isLoadingIsFlagged,
        isFetching: isFetchingIsFlagged,
        data: dataIsFlagged,
        refetch: refetchIsFlagged,
    } = useQuery({
        queryKey: "check_is_flagged",
        queryFn: () => {
            return axios.get(
                `/api/flagged-wikis/user-has-flagged/${articleId}?email=${session.user.email}`
            );
        },
        enabled: false,
        onSuccess: (d) => {
            console.log(d.data);
            if (d.data.isFlaggedByUser) {
                setIsFlagged(true);
                setFlaggedArticleObj(d.data.data);
            } else {
                setIsFlagged(false);
            }
        },
    });

    useEffect(() => {
        function refetchFun() {
            refetch();
        }
        refetchFun();
    }, [articleId, refetch]);

    useEffect(() => {
        function refetchIsFlaggedFun() {
            refetchIsFlagged();
        }
        if (session) {
            refetchIsFlaggedFun();
        }
    }, [session, refetchIsFlagged]);

    const handleUnflag = () => {
        console.log(session);
        refetchUnflag();
    };

    if (isLoading || isFetching) {
        return (
            <div>
                <Loader />
            </div>
        );
    }

    return (
        <div>
            {data && (
                <Container size="xl" p="sm">
                    <Stack>
                        <Paper p="md">
                            {isLoading || isFetching ? (
                                <Loader />
                            ) : (
                                <Group position="apart">
                                    <Group>
                                        <Popover
                                            width={200}
                                            position="bottom"
                                            withArrow
                                            shadow="md"
                                        >
                                            <Popover.Target>
                                                <ActionIcon>
                                                    <IconMenu2 />
                                                </ActionIcon>
                                            </Popover.Target>
                                            <Popover.Dropdown>
                                                <ContentMenu />
                                            </Popover.Dropdown>
                                        </Popover>

                                        <Title color="darkgreen" size={50}>
                                            {data.data.data.title}{" "}
                                        </Title>
                                        <CopyButton
                                            value={`/wikis/${articleId}`}
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
                                        {isFlagged ? (
                                            <Text fs="italic" fz="sm">
                                                you&apos;ve flagged this article{" "}
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
                                        <Group position="center">
                                            <IconWriting
                                                color="brown"
                                                size={25}
                                                spacing={0}
                                            />
                                            <Text
                                                fz="sm"
                                                className={
                                                    styles.articleDiscussion
                                                }
                                                onClick={() =>
                                                    setViewMode("article")
                                                }
                                                style={{
                                                    textDecoration:
                                                        viewMode ===
                                                            "article" &&
                                                        "underline",
                                                    color:
                                                        viewMode ===
                                                            "article" &&
                                                        "black",
                                                }}
                                            >
                                                Article
                                            </Text>
                                        </Group>
                                        <Divider orientation="vertical" />
                                        <Group position="center">
                                            {/*<IconChartTreemap
                                                color="teal"
                                                size={25}
                                                spacing={0}
                                            />
                                            <Text
                                                fz="sm"
                                                className={
                                                    styles.articleDiscussion
                                                }
                                                onClick={() =>
                                                    setViewMode("discussion")
                                                }
                                                style={{
                                                    textDecoration:
                                                        viewMode ===
                                                            "discussion" &&
                                                        "underline",
                                                    color:
                                                        viewMode ===
                                                            "discussion" &&
                                                        "black",
                                                }}
                                            >
                                                Discussion
                                            </Text>*/}
                                        </Group>
                                    </Group>
                                </Group>
                            )}
                        </Paper>
                        <Divider />
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
                        setIsFlagged={setIsFlagged}
                    />
                ) : (
                    <Loader />
                )}
            </Modal>
            {data &&
                (viewMode === "article" ? (
                    <Group>
                        <div
                            className={styles.articleSection}
                            dangerouslySetInnerHTML={{
                                __html: data.data.data.content,
                            }}
                        ></div>
                    </Group>
                ) : (
                    <div>Discussion page</div>
                ))}
        </div>
    );
}

function ContentMenu({ active = "" }) {
    const useStyles = createStyles((theme) => ({
        link: {
            ...theme.fn.focusStyles(),
            display: "block",
            textDecoration: "none",
            color:
                theme.colorScheme === "dark"
                    ? theme.colors.dark[0]
                    : theme.black,
            lineHeight: 1.2,
            fontSize: theme.fontSizes.sm,
            padding: theme.spacing.xs,
            borderTopRightRadius: theme.radius.sm,
            borderBottomRightRadius: theme.radius.sm,
            borderLeft: `1rem solid ${
                theme.colorScheme === "dark"
                    ? theme.colors.dark[4]
                    : theme.colors.gray[3]
            }`,

            "&:hover": {
                backgroundColor:
                    theme.colorScheme === "dark"
                        ? theme.colors.dark[6]
                        : theme.colors.gray[0],
            },
        },

        linkActive: {
            fontWeight: 500,
            borderLeftColor:
                theme.colors[theme.primaryColor][
                    theme.colorScheme === "dark" ? 6 : 7
                ],
            color: theme.colors[theme.primaryColor][
                theme.colorScheme === "dark" ? 2 : 7
            ],

            "&, &:hover": {
                backgroundColor:
                    theme.colorScheme === "dark"
                        ? theme.fn.rgba(
                              theme.colors[theme.primaryColor][9],
                              0.25
                          )
                        : theme.colors[theme.primaryColor][0],
            },
        },
    }));

    const { classes, cx } = useStyles();

    const [tableOfContents, setTableOfContents] = useState(null);

    useEffect(() => {
        console.log("listing h1");
        //var headers = Array.from(document.getElementsByTagName("h1"));
        //const slicedArray = headers.slice(2);
        let headerIds = [];
        //var headers = document.getElementsByTagName("h1");

        var headers = document.querySelectorAll("h1, h2");
        //console.log(headers3);

        /*for (var i = 1; i <= 2; i++) {
            var headers = document.getElementsByTagName("h" + i);
            let j = 0;
            if (i === 1) {
                j = 2;
            }
            for (; j < headers.length; j++) {
                let newIdVal = `${j}_1`;
                if (i === 2) {
                    newIdVal = `${j}_2`;
                }
                headers[j].id = newIdVal;
                headerIds.push({
                    key: newIdVal,
                    label: headers[j].innerHTML,
                    link: newIdVal, //headers[j].innerHTML,
                    order: i !== 1 ? 2 : 1, //headers[j].nodeName.at(-1),
                });
            }
        }*/

        for (var j = 2; j < headers.length; j++) {
            let newIdVal = `${j}_1`;
            let o = 1;

            if (headers[j].nodeName.toLocaleLowerCase() === "h2") {
                newIdVal = `${j}_2`;
                o = 2;
            }
            headers[j].id = newIdVal;
            //headerIds.push(headers[j].innerHTML);
            headerIds.push({
                key: newIdVal,
                label: headers[j].innerHTML,
                link: newIdVal, //headers[j].innerHTML,
                order: o, //headers[j].nodeName.at(-1),
            });
        }

        /*var headers2 = document.getElementsByTagName("h2");
        console.log("h222", headers2);
        for (var j = 0; j < headers2.length; j++) {
            headers2[j].id = `${j}_2`;
            //headerIds.push(headers[j].innerHTML);
            headerIds.push({
                key: `${j}_2`,
                label: headers2[j].innerHTML,
                link: `${j}_2`, //headers[j].innerHTML,
                order: 2, //headers[j].nodeName.at(-1),
            });
        }*/

        console.log(headerIds);
        setTableOfContents(headerIds);
        //document.getElementsByTagName("h1")[2].id = "atran";

        //document.getElementById(headerIds[0]).scrollIntoView();

        //console.log(headers.slice(2));
        /*for (var i = 1; i <= 6; i++) {
                var headers = document.getElementsByTagName("h" + i);
                //for (j=0; j<headers.length; j++) {
                  //  headers[j].className = 'h';
               // }
                console.log(headers);
            }*/
    }, []);

    if (!tableOfContents) {
        return <Loader />;
    }

    return (
        <div>
            <Text>Table of contents</Text>

            {tableOfContents.map((item) => (
                <Box
                    onClick={() =>
                        document.getElementById(item.link).scrollIntoView()
                    }
                    key={item.key}
                    className={cx(classes.link, {
                        [classes.linkActive]: active === item.link,
                    })}
                    style={{ paddingLeft: item.order !== 1 ? "10px" : "0px" }}
                    /*sx={(theme) => ({
                        paddingLeft: `calc(${item.order} * ${theme.spacing.md})`,
                    })}*/
                >
                    {item.label}
                </Box>
            ))}
        </div>
    );
}
