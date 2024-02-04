import {
    ActionIcon,
    Box,
    Container,
    Divider,
    Group,
    Image,
    MediaQuery,
    Paper,
    Stack,
    Text,
    TextInput,
    Title,
    createStyles,
} from "@mantine/core";
import FeaturedPeopleGrid from "../components/v2/grids/featured_people/FeaturedPeopleGrid";
import { FooterCentered } from "../components/appFooter/appFooter";

import WikiNavBar from "../components/v2/nav/wiki_navbar/WikiNavbar";
import { useRouter } from "next/router";
import { mockData } from "../components/appFooter/mockData";
import { useQuery } from "react-query";
import axios from "axios";
import BigArticleCard from "../components/v2/cards/articles/BigArticleCard";
import SmallArticleCard from "../components/v2/cards/articles/SmallArticleCard";
import { useState } from "react";
import { IconSearch } from "@tabler/icons";

const tabs = [
    //hero, martyr, public_figure, artefact, heritage
    {
        value: "his",
        label: "Tigray History",
    },
    {
        value: "gen",
        label: "Tigray Genocide",
    },
    {
        value: "wiki",
        label: "Wiki",
    },
];
const useStyles = createStyles((theme) => ({
    //#F7F7F7 -gray
    //https://dev.to/clairecodes/how-to-make-a-sticky-sidebar-with-two-lines-of-css-2ki7

    main: {
        //border: "1px solid blue",
        display: "flex",
        justifyContent: "space-between",
        //minHeight: "1000px",
        //overflowY: "auto",
    },
    content: {
        //border: "1px solid red",
        padding: "1em",
        width: "60%",
        height: "100%",
        "@media (max-width: 800px)": {
            //flexDirection: "column",
            //flexWrap: "wrap",
            width: "100%",
        },
        //overflowY: "hidden",
    },

    side: {
        //border: "1px solid red",
        width: "35%",
        //height: "25vh",
        height: "100%",
        position: "-webkit-sticky",
        position: "sticky",

        top: 100,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: "1em",
        alignItems: "center",
        "@media (max-width: 800px)": {
            //flexDirection: "column",
            //flexWrap: "wrap",
            //minWidth: "100%",
            display: "none",
        },
    },

    searchTabscont: {
        display: "flex",
        gap: "2em",
        //paddingBottom: "5px",
        borderBottom: "1px solid lightgray",
        overflowX: "auto",
    },

    tab: {
        cursor: "pointer",
        "&:hover": {
            color: "black",
        },
        paddingBottom: "10px",
    },
    noSearchTerm: {
        //marginTop: "60px",
        height: "100vh",
        //border: "1px solid red",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "1em",
    },
}));

export default function SearchPage() {
    const router = useRouter();
    //const [searchTerm, setSearchTerm] = useState("");
    //const [tab, setTab] = useState(router.query.type || "wiki");
    const [searchKey, setSearchKey] = useState("");
    const { classes } = useStyles();

    const searchQuery = useQuery({
        queryKey: ["fetch-search", router.query.searchTerm, router.query.type],
        queryFn: () => {
            if (router.query.type === "wiki") {
                return axios.get(
                    `/api/v2/wiki-search?searchTerm=${router.query.searchTerm}`
                );
            }
            return axios.get(
                `/api/v2/timeline-search?searchTerm=${router.query?.searchTerm}&tag=${router.query.type}`
            );
        },
        refetchOnWindowFocus: false,
        enabled: router.isReady,
        onSuccess: (res) => {
            //setItems(res.data);
            console.log("gotem", res.data);
        },
    });

    const recQuery = useQuery({
        queryKey: ["fetch-rec", router.query.type],
        queryFn: () => {
            if (router.query.type === "his") {
                return axios.get(`/api/articles/featured?type=his`);
            }
            if (router.query.type === "gen") {
                return axios.get(`/api/articles/featured?type=gen`);
            }
            const a = [
                "hero",
                "public_figure",
                "artefact",
                "heritage",
                "martyr",
            ];
            return axios.get(
                `/api/wikis/featured?tag=${
                    a[Math.floor(Math.random() * a.length)]
                }`
            );
        },
        refetchOnWindowFocus: false,
        enabled: router.isReady,
        onSuccess: (res) => {
            //setItems(res.data);
            console.log("recs", res.data);
        },
    });

    if (!router?.query.searchTerm) {
        return (
            <div>
                <WikiNavBar searchPage={router?.query.type || "wiki"} />
            </div>
        );
    }
    return (
        <div>
            <WikiNavBar searchPage={router?.query.type || "wiki"} />

            <Container
                size="lg"
                mt={60}
                //w="100%"
                p={0}
                //mah={"100vh"}
                className={classes.main}
            >
                <div className={classes.content}>
                    <div
                        style={{
                            //borderBottom: "1px solid #F7F7F7",
                            paddingBottom: "5px",
                            marginBottom: "2em",
                        }}
                    >
                        <Stack>
                            <Group>
                                <Title
                                    color="dimmed"
                                    sx={{
                                        //minWidth: "300px",
                                        //maxWidth: "300px",
                                        fontFamily: "Lora, serif",
                                        fontWeight: "200",
                                        fontSize: "50px",
                                    }}
                                >
                                    results for
                                </Title>
                                <Title
                                    italic
                                    sx={{
                                        //minWidth: "300px",
                                        //maxWidth: "300px",
                                        fontFamily: "Lora, serif",
                                        fontWeight: "200",
                                        fontSize: "50px",
                                    }}
                                >
                                    {` ${router?.query.searchTerm || ""}`}
                                </Title>
                            </Group>
                            <div className={classes.searchTabscont}>
                                {tabs.map((t) => (
                                    <Text
                                        size="sm"
                                        color={
                                            router.query?.type === t.value
                                                ? "2px solid black"
                                                : "dimmed"
                                        }
                                        className={classes.tab}
                                        key={t.value}
                                        onClick={() => {
                                            router.push(
                                                {
                                                    //...router,
                                                    query: {
                                                        ...router.query,
                                                        type: t.value,
                                                    },
                                                },
                                                undefined,
                                                { shallow: true }
                                            );
                                        }}
                                        sx={{
                                            borderBottom:
                                                router?.query.type === t.value
                                                    ? "2px solid black"
                                                    : "none",
                                        }}
                                    >
                                        {t.label}
                                    </Text>
                                ))}
                            </div>
                        </Stack>
                    </div>
                    {searchQuery.data?.data[0]?.data.map((article, i) => {
                        return (
                            <SmallArticleCard
                                key={i}
                                article={article}
                                url={
                                    router.query.type === "wiki"
                                        ? `/wiki/${article._id}`
                                        : `/timeline?type=${router.query.type}&articleId=${article._id}`
                                }
                            />
                        );
                    })}
                    {searchQuery.isLoading && <div>loading...</div>}
                    {!searchQuery.isLoading && !searchQuery.data?.data[0] && (
                        <div>no results</div>
                    )}
                </div>
                <div className={classes.side}>
                    <Title fz={24} fw={200} sx={{ fontFamily: "Lora, serif" }}>
                        Can&apos;t decide what to read? Try:
                    </Title>

                    <BigArticleCard
                        article={recQuery.data?.data[0]}
                        url={
                            router.query.type === "wiki"
                                ? `/wiki/${recQuery.data?.data[0]._id}`
                                : `/timeline?type=${router.query.type}&articleId=${recQuery.data?.data[0]._id}`
                        }
                    />
                    <FooterCentered links={mockData.links} />
                </div>
            </Container>
        </div>
    );
}
