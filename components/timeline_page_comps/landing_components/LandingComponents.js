import {
    Container,
    Paper,
    Stack,
    Text,
    SimpleGrid,
    Skeleton,
    useMantineTheme,
    Card,
    Group,
    Center,
    Title,
    Button,
    createStyles,
    getStylesRef,
    Loader,
    Divider,
} from "@mantine/core";
import { IconClick } from "@tabler/icons";
import axios from "axios";
import Link from "next/link";
import { useEffect } from "react";
import { useQuery } from "react-query";

//select event banner component
export function SelectEventBanner() {
    return (
        <Container size="xl" p="xl">
            <Paper withBorder bg="lightcyan" p="xl">
                <Stack justify="center" align="center" spacing="xs">
                    <IconClick size={70} color="gray" />
                    <h1 style={{ textAlign: "center" }}>
                        Welcome to Tigray Timeline
                    </h1>
                    <Stack spacing={2}>
                        <Text c="dimmed">
                            👉 Select an Event from the above Timeline to start
                            reading
                        </Text>
                        <Text c="dimmed">
                            👉 Drag Timeline Left or Right to navigate back and
                            forth in time
                        </Text>
                        <Text c="dimmed">
                            👉 Drag Timeline Up or Down to navigate Stacked
                            Events
                        </Text>
                    </Stack>
                </Stack>
            </Paper>
        </Container>
    );
}
/**
 
 */

export function LastFourFeaturedTimelineEvents() {
    const getChild = (height) => <Skeleton height={height} radius="md" />;
    const BASE_HEIGHT = 360;
    const getSubHeight = (children, spacing) =>
        BASE_HEIGHT / children - spacing * ((children - 1) / children);

    const theme = useMantineTheme();

    const { isLoading, isFetching, data, refetch, isError, error } = useQuery({
        queryKey: "fetch_featured_timeline_landing",
        queryFn: () => {
            return axios.get("/api/articles/featured/his");
        },
        enabled: false,
        onSuccess: (d) => {
            //console.log("wikis by ", d.data.data);
        },
    });

    useEffect(() => {
        function refetchFun() {
            refetch();
        }
        refetchFun();
    }, []);

    if (isLoading || isFetching) {
        return (
            <Container my="md">
                <Divider
                    label={<h1>Read from Our Picks</h1>}
                    size="lg"
                    c="cyan"
                />
                <SimpleGrid
                    cols={3}
                    breakpoints={[{ maxWidth: "sm", cols: 1 }]}
                >
                    {getChild(BASE_HEIGHT)}

                    <Stack>
                        {getChild(getSubHeight(2, theme.spacing.md))}
                        {getChild(getSubHeight(2, theme.spacing.md))}
                    </Stack>

                    {getChild(BASE_HEIGHT)}
                </SimpleGrid>
            </Container>
        );
    }

    if (data) {
        return (
            <Container my="md">
                <Divider
                    label={<h1>Read from Our Picks</h1>}
                    size="lg"
                    c="cyan"
                />

                <SimpleGrid
                    cols={3}
                    breakpoints={[{ maxWidth: "sm", cols: 1 }]}
                >
                    {/*getChild(BASE_HEIGHT)*/}
                    <FeaturedCard
                        cardHeight="31rem"
                        articleId={data.data.data[0].articleId}
                    />
                    <Stack>
                        {/*getChild(getSubHeight(2, theme.spacing.md))*/}
                        <FeaturedCard
                            cardHeight="15rem"
                            articleId={data.data.data[1].articleId}
                        />
                        {/*getChild(getSubHeight(2, theme.spacing.md))*/}
                        <FeaturedCard
                            cardHeight="15rem"
                            articleId={data.data.data[2].articleId}
                        />
                    </Stack>

                    {/*getChild(BASE_HEIGHT)*/}
                    <FeaturedCard
                        cardHeight="31rem"
                        articleId={data.data.data[3].articleId}
                    />
                </SimpleGrid>
            </Container>
        );
    }
}

function FeaturedCard({ cardHeight, articleId }) {
    const imgProp = {
        image: "https://images.unsplash.com/photo-1508193638397-1c4234db14d8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80",
        title: "Best forests to visit in North America",
        category: "nature",
    };
    const useStyles = createStyles((theme) => ({
        card: {
            height: cardHeight,
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
            fontSize: "2rem",
            marginTop: theme.spacing.xs,
            "&:hover": {
                //border: "1px solid",
                textDecoration: "underline",
                transition: "0.5s",
                cursor: "pointer",
            },
        },

        category: {
            color: theme.white,
            opacity: 0.7,
            fontWeight: 700,
            textTransform: "uppercase",
        },
    }));

    const { classes } = useStyles();

    const { isLoading, isFetching, data, refetch, isError, error } = useQuery({
        queryKey: `fetch_timeline_event_featured_landing${articleId}`,
        queryFn: () => {
            return axios.get(`/api/articles/${articleId}`);
        },
        enabled: false,
        onSuccess: (d) => {
            //console.log("wikis by ", d.data.data);
        },
    });

    useEffect(() => {
        function refetchFun() {
            refetch();
        }
        refetchFun();
    }, []);

    if (isLoading || isFetching) {
        return <Loader />;
    }

    if (data) {
        return (
            <Paper
                shadow="md"
                p="xl"
                radius="md"
                sx={{
                    backgroundImage: `url(${data.data.data.coverImage})`,
                    backgroundSize: "300%",
                    "&:hover": {
                        backgroundSize: "350%",
                        transition: "0.2s",
                    },
                }}
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
                    <Text className={classes.category} size="xs">
                        {data.data.data.tag}
                    </Text>
                    <Link
                        href={`/timeline?articleId=${data.data.data._id.toString()}`}
                        style={{ textDecoration: "none" }}
                        rel="noopener noreferrer"
                        target="_blank"
                    >
                        <Title order={3} className={classes.title}>
                            {data.data.data.title}
                        </Title>
                    </Link>
                    <Text fz="sm" color="white" lineClamp={3}>
                        {data.data.data.description}
                    </Text>
                </div>
            </Paper>
        );
    }
}
