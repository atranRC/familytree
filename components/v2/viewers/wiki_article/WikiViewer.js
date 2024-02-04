import {
    ActionIcon,
    Box,
    Burger,
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
import { IconMenu } from "@tabler/icons";
import Link from "next/link";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import axios from "axios";
import FeaturedStoriesFromPeopleGrid from "../../grids/stories_from_people/FeaturedStoriesFromPeopleGrid";
import ArticleStoriesFromPeopleGrid from "../../grids/stories_from_people/ArticleStoriesFromPeopleGrid";
import moment from "moment";
import parse, { domToReact } from "html-react-parser";

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

export default function WikiViewer({ id }) {
    const router = useRouter();
    const [headers, setHeaders] = useState([]);
    const [showMenu, setShowMenu] = useState(false);
    const [loadingMenu, setLoadingMenu] = useState();
    const [contentMenuOpened, setContentMenuOpened] = useState(false);
    let h = [];

    const { data, isLoading } = useQuery({
        queryKey: ["fetch-wiki"],
        queryFn: () => {
            return axios.get(`/api/wikis/${router.query.id}`);
        },
        refetchOnWindowFocus: false,
        enabled: router.isReady,
        onSuccess: (d) => {
            //console.log("wiki loaded", d.data.data);
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

            /*
            if (data) {
                setHeaders([]);
                setLoadingMenu(true);
                parse(`${data.data.data.content}`, {
                    transform: (reactNode, domNode, index) => {
                        if (domNode.name === "h1" || domNode.name === "h2") {
                            setHeaders((h) => [
                                ...h,
                                {
                                    //n: node.name,
                                    id: index,
                                    title: domToReact(
                                        domNode.children
                                        //options
                                    ).props.children,
                                    //link: `#${node.children[0].data.toLowerCase().replace(/ /g, "-")}`
                                },
                            ]);
                        }
                    },
                });
                setLoadingMenu(false);
            }*/
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
            {ReactHtmlParser(data?.data?.data.content, {
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
                                                    href={`/wiki/${router.query.id}#${h.id}`}
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
                                                borderBottom: "1px solid #ccc",
                                                marginBottom: "2em",
                                                gap: "2em",
                                            }}
                                        >
                                            <Text
                                                size="sm"
                                                color="dimmed"
                                                sx={{
                                                    "&:hover": {
                                                        cursor: "pointer",
                                                        color: "black",
                                                    },
                                                }}
                                            >
                                                Wiki
                                            </Text>

                                            <Text
                                                size="sm"
                                                ml="auto"
                                                color="dimmed"
                                            >
                                                {`Last updated ${
                                                    data.data?.data
                                                        .updatedAt ? (
                                                        moment(
                                                            data.data?.data
                                                                .updatedAt
                                                        ).format("YYYY-MM-DD")
                                                    ) : (
                                                        <>-</>
                                                    )
                                                }`}
                                            </Text>
                                        </div>
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

                    if (node.name === "img") {
                        // console.log("we have image", node.attribs);
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
                                        alt="article_img"
                                    />
                                    <Text size="sm" italic color="dimmed">
                                        {node.attribs?.alt}
                                    </Text>
                                </Stack>
                            </Box>
                        );
                    }
                    if (node.name === "table") {
                        //console.log("we have table", node);
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

                    if (node.name === "p") {
                        node.attribs.style = node.attribs.style
                            ? node.attribs.style + " font-size: 14.5px;"
                            : "font-size: 14.5px;";
                        //console.log("found p", node);
                    }
                },
            })}
        </div>
    );
}
