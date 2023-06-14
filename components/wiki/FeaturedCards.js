import {
    Container,
    Grid,
    SimpleGrid,
    Skeleton,
    useMantineTheme,
    Stack,
    createStyles,
    Card,
    Image,
    Text,
    Group,
    MediaQuery,
    Title,
    Button,
    Paper,
    Loader,
} from "@mantine/core";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";

const PRIMARY_COL_HEIGHT = "50vh";

export default function FeaturedCards() {
    const theme = useMantineTheme();
    //const SECONDARY_COL_HEIGHT = `calc(${PRIMARY_COL_HEIGHT} / 2 - ${theme.spacing.md} / 2)`;
    const SECONDARY_COL_HEIGHT = `calc(${PRIMARY_COL_HEIGHT}/2 - 0.5rem)`;
    const desc =
        "Father Assefa, 64, has climbed a 1,000-foot sheer cliff to reach the Abuna Yemata Guh church every day for 50 years. Tigray was one of the worlds first bastions of Christianity, and the church dates back to its Orthodox Church, one of Christianitys oldest sects. The regions arid climate has preserved the churchs 6th-century paintings, made from animal fat.";
    const desc2 =
        "Mulu Gebreegziabher (fighters name Kashi Gebru; 1962-1982) was a Tigrayan feminist and freedom fighter. She is best remembered for testifying her anti-feudal and anti-patriarchal convictions in front of a camera";
    return (
        <SimpleGrid
            cols={2}
            spacing="md"
            mih="50vh"
            breakpoints={[{ maxWidth: "lg", cols: 1 }]}
        >
            <FeaturedMainCard
                title="The Church In The Sky"
                description={desc}
                image="https://bloximages.newyork1.vip.townnews.com/unionleader.com/content/tncms/assets/v3/editorial/1/f0/1f0c3039-eddb-52ff-80f0-45144f43bd82/5de43a3b07ef0.image.jpg?resize=1396%2C1047"
                category="Articles"
            />
            {/*<Skeleton height={PRIMARY_COL_HEIGHT} radius="md" />*/}
            <SimpleGrid
                cols={2}
                spacing="md"
                breakpoints={[{ maxWidth: "md", cols: 1 }]}
            >
                <Stack>
                    <FeaturedSmallCard tag="martyr" />
                    <FeaturedSmallCard tag="public_figure" />
                    {/*<Skeleton height={SECONDARY_COL_HEIGHT} radius="md" />*/}
                </Stack>

                <FeaturedTallCard
                    title="Qeshi Gebru"
                    category="Heroes"
                    description={desc2}
                    image="https://i.pinimg.com/originals/08/f7/52/08f7527528cddc6c51a6e4e91e965fa0.jpg"
                />
            </SimpleGrid>
        </SimpleGrid>
    );
}

function FeaturedSmallCard({ tag }) {
    const useStyles = createStyles((theme) => ({
        card: {
            minHeight: "50%",
            backgroundColor:
                theme.colorScheme === "dark"
                    ? theme.colors.dark[7]
                    : theme.white,
        },

        title: {
            fontWeight: 700,
            fontFamily: `Greycliff CF, ${theme.fontFamily}`,
            lineHeight: 1.2,
            "&:hover": {
                //border: "1px solid",
                textDecoration: "underline",
                transition: "0.5s",
                cursor: "pointer",
            },
        },

        body: {
            padding: theme.spacing.md,
        },
    }));

    const { classes } = useStyles();
    const [featuredWiki, setFeaturedWiki] = useState(null);

    const { isLoading, isFetching, data, refetch, isError, error } = useQuery({
        queryKey: "fetch_featured_wiki_small_card" + tag,
        queryFn: () => {
            return axios.get(`/api/wikis/featured/${tag}`);
        },
        enabled: false,
        onSuccess: (d) => {
            //console.log("wikis by ", d.data.data);
        },
    });

    const {
        isLoading: isLoadingArticle,
        isFetching: isFetchingArticle,
        data: dataArticle,
        refetch: refetchArticle,
        isError: isErrorArticle,
        error: errorArticle,
    } = useQuery({
        queryKey: "fetch_wiki_small_card" + tag,
        queryFn: () => {
            return axios.get(`/api/wikis/${data.data.data[0].wikiId}`);
        },
        enabled: data ? true : false,
        onSuccess: (d) => {
            //console.log("hehe by ", d.data.data);
            setFeaturedWiki(d.data.data);
        },
    });

    useEffect(() => {
        function refetchFun() {
            refetch();
        }
        refetchFun();
    }, [refetch]);

    if (isLoading || isFetching || !featuredWiki) {
        return <Loader />;
    }

    return (
        <Card withBorder radius="md" p={0} className={classes.card}>
            <Group spacing={0}>
                <MediaQuery largerThan="md" styles={{ width: "100%" }}>
                    <Image
                        src={featuredWiki.coverImage}
                        height={140}
                        alt="img eight"
                    />
                </MediaQuery>
                <div className={classes.body}>
                    <Text
                        transform="uppercase"
                        color="dimmed"
                        weight={700}
                        size="xs"
                    >
                        {tag}
                    </Text>
                    <Link
                        //legacyBehavior
                        href={`/wiki/${featuredWiki._id.toString()}`}
                        rel="noopener noreferrer"
                        target="_blank"
                        //className={classes.treeLink}
                        style={{ textDecoration: "none" }}
                    >
                        <Text className={classes.title} mt="xs" mb="md">
                            {featuredWiki.title}
                        </Text>
                    </Link>
                    <Group noWrap spacing="xs">
                        {/*<Group spacing="xs" noWrap>
                            <Text size="xs">{author}</Text>
                        </Group>
                        <Text size="xs" color="dimmed">
                            •
                        </Text>*/}
                        <Text size="xs" color="dimmed">
                            {featuredWiki.createdAt.toString().split("T")[0]}
                        </Text>
                    </Group>
                </div>
            </Group>
        </Card>
    );
}

function FeaturedTallCard({ image, title, category, description }) {
    const useStyles = createStyles((theme) => ({
        card: {
            minHeight: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "flex-start",
            backgroundSize: "cover",
            backgroundPosition: "center",
        },

        title: {
            fontFamily: `Greycliff CF ${theme.fontFamily}`,
            fontWeight: 900,
            color: theme.white,
            lineHeight: 1.2,
            fontSize: "rem(32)",
            marginTop: theme.spacing.xs,
            "&:hover": {
                //border: "1px solid",
                textDecoration: "underline",
                transition: "0.5s",
                cursor: "pointer",
            },
        },

        category: {
            color: "white",
            opacity: 0.9,
            fontWeight: 700,
            textTransform: "uppercase",
        },
    }));

    const { classes } = useStyles();
    const [featuredWiki, setFeaturedWiki] = useState(null);

    const { isLoading, isFetching, data, refetch, isError, error } = useQuery({
        queryKey: "fetch_featured_wiki_hero",
        queryFn: () => {
            return axios.get("/api/wikis/featured/hero");
        },
        enabled: false,
        onSuccess: (d) => {
            //console.log("wikis by ", d.data.data);
        },
    });

    const {
        isLoading: isLoadingArticle,
        isFetching: isFetchingArticle,
        data: dataArticle,
        refetch: refetchArticle,
        isError: isErrorArticle,
        error: errorArticle,
    } = useQuery({
        queryKey: "fetch_wiki_hero",
        queryFn: () => {
            return axios.get(`/api/wikis/${data.data.data[0].wikiId}`);
        },
        enabled: data ? true : false,
        onSuccess: (d) => {
            //console.log("hehe by ", d.data.data);
            setFeaturedWiki(d.data.data);
        },
    });

    useEffect(() => {
        function refetchFun() {
            refetch();
        }
        refetchFun();
    }, [refetch]);

    if (isLoading || isFetching || !featuredWiki) {
        return <Loader />;
    }

    return (
        <Paper
            shadow="md"
            p="xl"
            radius="md"
            sx={{ backgroundImage: `url(${featuredWiki.coverImage})` }}
            className={classes.card}
        >
            <div
                style={{
                    backgroundColor: "rgba(0, 0, 0, .4)",
                    padding: ".5rem",
                    width: "100%",
                    margin: ".5rem",
                }}
            >
                <Text className={classes.category} size="sm">
                    {featuredWiki.tag}
                </Text>
                <Link
                    //legacyBehavior
                    href={`/wiki/${featuredWiki._id.toString()}`}
                    rel="noopener noreferrer"
                    target="_blank"
                    //className={classes.treeLink}
                    style={{ textDecoration: "none" }}
                >
                    <Title order={1} className={classes.title}>
                        {featuredWiki.title}
                    </Title>
                </Link>
                <Text fz="sm" color="white" lineClamp={4}>
                    {featuredWiki.description}
                </Text>
            </div>
            {/*<Button variant="white" color="dark">
                Read More
            </Button>*/}
        </Paper>
    );
}

function FeaturedMainCard({ image, title, category, description }) {
    const useStyles = createStyles((theme) => ({
        card: {
            minHeight: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "flex-start",
            backgroundSize: "cover",
            backgroundPosition: "center",
        },

        title: {
            fontFamily: `Greycliff CF ${theme.fontFamily}`,
            fontWeight: 900,
            color: theme.white,
            lineHeight: 1.2,
            fontSize: "rem(32)",
            marginTop: theme.spacing.xs,
            "&:hover": {
                //border: "1px solid",
                textDecoration: "underline",
                transition: "0.5s",
                cursor: "pointer",
            },
        },

        category: {
            color: "white",
            opacity: 0.9,
            fontWeight: 700,
            textTransform: "uppercase",
        },
    }));

    const { classes } = useStyles();
    const [featuredArticle, setFeaturedArticle] = useState(null);

    const { isLoading, isFetching, data, refetch, isError, error } = useQuery({
        queryKey: "fetch_featured_main",
        queryFn: () => {
            return axios.get("/api/articles/featured/his");
        },
        enabled: false,
        onSuccess: (d) => {
            //console.log("wikis by ", d.data.data);
        },
    });

    const {
        isLoading: isLoadingArticle,
        isFetching: isFetchingArticle,
        data: dataArticle,
        refetch: refetchArticle,
        isError: isErrorArticle,
        error: errorArticle,
    } = useQuery({
        queryKey: "fetch_featured_article",
        queryFn: () => {
            return axios.get(`/api/articles/${data.data.data[0].articleId}`);
        },
        enabled: data ? true : false,
        onSuccess: (d) => {
            //console.log("wikis by ", d.data.data);
            setFeaturedArticle(d.data.data);
        },
    });

    useEffect(() => {
        function refetchFun() {
            refetch();
        }
        refetchFun();
    }, [refetch]);

    if (isLoading || isFetching || !featuredArticle) {
        return <Loader />;
    }

    return (
        <Paper
            shadow="md"
            p="xl"
            radius="md"
            sx={{ backgroundImage: `url(${featuredArticle.coverImage})` }}
            className={classes.card}
        >
            <div
                style={{
                    backgroundColor: "rgba(0, 0, 0, .4)",
                    padding: ".5rem",
                    width: "100%",
                    margin: ".5rem",
                }}
            >
                <Text className={classes.category} size="sm">
                    {featuredArticle.tag}
                </Text>

                <Link
                    //legacyBehavior
                    href={`/timeline?articleId=${featuredArticle._id.toString()}`}
                    rel="noopener noreferrer"
                    target="_blank"
                    //className={classes.treeLink}
                    style={{ textDecoration: "none" }}
                >
                    <Title order={1} className={classes.title}>
                        {featuredArticle.title}
                    </Title>
                </Link>

                <Text fz="sm" color="white" lineClamp={4}>
                    {featuredArticle.description}
                </Text>
            </div>
            {/*<Button variant="white" color="dark">
                Read More
            </Button>*/}
        </Paper>
    );
}
