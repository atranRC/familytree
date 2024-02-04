import {
    ActionIcon,
    Box,
    Burger,
    Divider,
    Group,
    Image,
    Loader,
    Menu,
    NavLink,
    Stack,
    Text,
    Title,
} from "@mantine/core";
import { useEffect, useState } from "react";
import ReactHtmlParser, {
    processNodes,
    convertNodeToElement,
    htmlparser2,
} from "react-html-parser";

import styles from "./wikiArticleViewer.module.css";
import { IconCopy, IconFlag, IconMenu, IconShare } from "@tabler/icons";
import Link from "next/link";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import axios from "axios";
import FeaturedStoriesFromPeopleGrid from "../../grids/stories_from_people/FeaturedStoriesFromPeopleGrid";
import ArticleStoriesFromPeopleGrid from "../../grids/stories_from_people/ArticleStoriesFromPeopleGrid";
import moment from "moment";
import ArticleLocationViewer from "../../page_comps/ArticleLocationViewer";

const getImagePosition = (node) => {
    if (node.attribs.style) {
        if (node.attribs.style.includes("left")) {
            return "left";
        } else if (node.attribs.style.includes("right")) {
            return "right";
        } else {
            return "center";
        }
    }
};

export default function WikiArticleViewer({ id }) {
    const router = useRouter();
    const [headers, setHeaders] = useState([]);
    const [showMenu, setShowMenu] = useState(false);
    const [loadingMenu, setLoadingMenu] = useState();
    const [contentMenuOpened, setContentMenuOpened] = useState(false);
    let h = [];

    const { data, isLoading } = useQuery({
        queryKey: ["fetch-wiki-article", router.query.articleId],
        queryFn: () => {
            return axios.get(`/api/articles/${router.query.articleId}`);
        },
        refetchOnWindowFocus: false,
        enabled: router.isReady,
        onSuccess: (d) => {
            console.log("article loaded", d.data.data);
        },
    });

    useEffect(() => {
        function getMenu() {
            if (data) {
                setHeaders([]);
                setLoadingMenu(true);
                ReactHtmlParser(data.data.data.content, {
                    transform: (node, index) => {
                        if (node.name === "h1" || node.name === "h2") {
                            setHeaders((h) => [
                                ...h,
                                {
                                    //n: node.name,
                                    id: index,
                                    title:
                                        node.children[0].data ||
                                        node.children[0].children[0].data,
                                    //link: `#${node.children[0].data.toLowerCase().replace(/ /g, "-")}`
                                },
                            ]);
                        }
                    },
                });
                setLoadingMenu(false);
            }
        }
        getMenu();
    }, [data]);

    if (isLoading) {
        return (
            <Stack align="center">
                <Loader variant="dots" color="gray" />
            </Stack>
        );
    }

    return (
        <div>
            {ReactHtmlParser(data.data.data.content, {
                transform: function transform(node, index) {
                    if (node.name === "h1") {
                        //console.log("we got title", index, node);
                        return (
                            <Stack key={index}>
                                <Group
                                    noWrap
                                    sx={{ borderBottom: "1px solid #ccc" }}
                                >
                                    <Menu
                                        width={200}
                                        shadow="md"
                                        position="bottom-start"
                                        closeOnClickOutside
                                        onClose={() =>
                                            setContentMenuOpened(false)
                                        }
                                    >
                                        <Menu.Target>
                                            <Burger
                                                opened={contentMenuOpened}
                                                onClick={() => {
                                                    setContentMenuOpened(
                                                        !contentMenuOpened
                                                    );
                                                }}
                                                size="sm"
                                                mt={20}
                                            />
                                        </Menu.Target>

                                        <Menu.Dropdown
                                            sx={{ marginTop: "5px" }}
                                        >
                                            {headers.map((h, i) => (
                                                <Link
                                                    href={`/timeline?articleId=${router.query.articleId}#${h.id}`}
                                                    style={{
                                                        textDecoration: "none",
                                                    }}
                                                    key={i}
                                                >
                                                    <NavLink
                                                        label={`${i}. ${h.title}`}
                                                        c="indigo"
                                                        /*className={
                                                            classes.navLink
                                                        }*/
                                                    />
                                                </Link>
                                            ))}
                                        </Menu.Dropdown>
                                    </Menu>
                                    <Title
                                        id={index}
                                        mt="xl"
                                        order={1}
                                        sx={{
                                            //minWidth: "300px",
                                            //maxWidth: "300px",
                                            fontFamily: "Lora, serif",
                                            fontWeight: "400",
                                            width: "100%",
                                            //borderBottom: "1px solid #ccc",
                                        }}
                                    >
                                        {node.children[0].data ||
                                            node.children[0].children[0].data}
                                    </Title>
                                </Group>
                                {index === 0 && (
                                    <div>
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                borderBottom: "1px solid #ccc",
                                                marginBottom: "2em",
                                                gap: "2em",
                                                maxWidth: "100%",
                                                minWidth: "100%",
                                                overflowX: "auto",
                                                whiteSpace: "nowrap",
                                            }}
                                        >
                                            <Text
                                                size="sm"
                                                color={
                                                    !router.query.tabSection
                                                        ? "black"
                                                        : "dimmed"
                                                }
                                                sx={{
                                                    "&:hover": {
                                                        cursor: "pointer",
                                                        color: "black",
                                                    },
                                                }}
                                                onClick={() => {
                                                    router.push(
                                                        {
                                                            //...router,
                                                            query: {
                                                                ...router.query,
                                                                tabSection: "",
                                                            },
                                                        },
                                                        undefined,
                                                        { shallow: true }
                                                    );
                                                }}
                                            >
                                                Article
                                            </Text>
                                            <Text
                                                color={
                                                    router.query.tabSection ===
                                                    "stories"
                                                        ? "black"
                                                        : "dimmed"
                                                }
                                                sx={{
                                                    "&:hover": {
                                                        cursor: "pointer",
                                                        color: "black",
                                                    },
                                                }}
                                                size="sm"
                                                onClick={() => {
                                                    router.push(
                                                        {
                                                            //...router,
                                                            query: {
                                                                ...router.query,
                                                                tabSection:
                                                                    "stories",
                                                            },
                                                        },
                                                        undefined,
                                                        { shallow: true }
                                                    );
                                                }}
                                            >
                                                Stories from Tigray
                                            </Text>
                                            <Text
                                                color={
                                                    router.query.tabSection ===
                                                    "maps"
                                                        ? "black"
                                                        : "dimmed"
                                                }
                                                sx={{
                                                    "&:hover": {
                                                        cursor: "pointer",
                                                        color: "black",
                                                    },
                                                }}
                                                size="sm"
                                                onClick={() => {
                                                    router.push(
                                                        {
                                                            //...router,
                                                            query: {
                                                                ...router.query,
                                                                tabSection:
                                                                    "maps",
                                                            },
                                                        },
                                                        undefined,
                                                        { shallow: true }
                                                    );
                                                }}
                                            >
                                                Maps
                                            </Text>
                                            <Group ml="auto" p={5} noWrap>
                                                <Text size="sm" ml="auto">
                                                    {data.data?.data.date ? (
                                                        moment(
                                                            data.data?.data.date
                                                        ).format("YYYY-MM-DD")
                                                    ) : (
                                                        <>-</>
                                                    )}
                                                </Text>
                                                <Divider />
                                                <ActionIcon
                                                    color="gray"
                                                    onClick={() =>
                                                        navigator.clipboard.writeText(
                                                            window.location
                                                        )
                                                    }
                                                    ml="auto"
                                                >
                                                    <IconCopy size={14} />
                                                </ActionIcon>
                                                <ActionIcon
                                                    color="red"
                                                    disabled
                                                >
                                                    <IconFlag size={14} />
                                                </ActionIcon>
                                            </Group>
                                        </div>
                                        {router.query.tabSection ===
                                            "stories" && (
                                            <ArticleStoriesFromPeopleGrid
                                                articleId={
                                                    router.query.articleId
                                                }
                                            />
                                        )}
                                        {router.query.tabSection === "maps" && (
                                            <ArticleLocationViewer
                                                article={data?.data.data}
                                            />
                                        )}
                                    </div>
                                )}
                            </Stack>
                        );
                    }
                    if (node.name === "h2") {
                        //console.log(index, node.children[0].children[0].data);
                        return (
                            <Title
                                key={index}
                                id={index}
                                mt="xl"
                                order={2}
                                underline
                                sx={{
                                    //minWidth: "300px",
                                    //maxWidth: "300px",
                                    fontFamily: "Lora, serif",
                                    fontWeight: "200",
                                }}
                            >
                                {node.children[0].data ||
                                    node.children[0].children[0].data}
                            </Title>
                        );
                    }

                    if (node.name === "table") {
                        console.log("we have table", node);
                        if (node.attribs)
                            node.attribs = {
                                ...node.attribs,
                                cellpadding: "10px",
                            };

                        return (
                            <div style={{ maxWidth: "100%", overflow: "auto" }}>
                                {convertNodeToElement(node, index, transform)}
                            </div>
                        );
                    }

                    if (node.name === "img") {
                        console.log("we have image", node.attribs);
                        return (
                            <Box
                                key={index}
                                style={{
                                    border: "1px solid gray",
                                    margin: "10px",
                                    marginBottom: "2em",
                                    marginTop: "2em",
                                    padding: "10px",
                                    float: getImagePosition(node),

                                    backgroundColor: "#f7f7f7",
                                    borderRadius: "10px",
                                    flexShrink: 1,
                                }}
                                id={index}
                            >
                                <Stack>
                                    <Image
                                        src={node.attribs.src}
                                        //width={parseInt(node.attribs.width)}
                                        height={parseInt(node.attribs.height)}
                                        radius={10}
                                        //style={JSON.parse(node.attribs.style)}
                                        sx={{
                                            "@media (min-width: 800px)": {
                                                //fontSize: "1.5rem",
                                                //marginBottom: "-1rem",
                                                //display: "none",
                                                maxWidth: "100%",
                                            },
                                        }}
                                    />
                                    <Text size="sm" italic color="dimmed">
                                        {node.attribs?.alt}
                                    </Text>
                                </Stack>
                            </Box>
                        );
                    }
                },
            })}
        </div>
    );
}
