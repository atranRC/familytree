import {
    Divider,
    Image,
    Stack,
    Text,
    Title,
    createStyles,
} from "@mantine/core";
import axios from "axios";
import { useRouter } from "next/router";
import { useQuery } from "react-query";

const useStyles = createStyles((theme) => ({
    cont: {
        width: "100%",
        //height: "500px",
        display: "flex",
        justifyContent: "space-between",
        gap: "2em",
        "@media (max-width: 800px)": {
            //flexDirection: "column",
            flexWrap: "wrap",
        },
    },
    bigArticleCard: {
        flexBasis: "50%",
        display: "flex",
        flexDirection: "column",
        gap: "1em",
        padding: "10px",
        borderRadius: "10px",
        "&:hover": {
            background: "#F7F7F7",
            cursor: "pointer",
            transition: "all 0.2s ease-in-out",
        },
        "@media (max-width: 800px)": {
            //flexDirection: "column",
            //flexWrap: "wrap",
            minWidth: "100%",
        },
        //height: "500px",
    },
    bigArticleCardImage: {
        backgroundPosition: "center",
        backgroundSize: "cover",
        width: "100%",
        height: "300px",
        transition: "all 0.2s ease-in-out",
        borderRadius: "5px",
        overflow: "hidden",
    },
    smallArticlesCont: {
        flexBasis: "50%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: "1em",
        "@media (max-width: 800px)": {
            //flexDirection: "column",
            //flexWrap: "wrap",
            minWidth: "100%",
        },
    },
    smallArticleCard: {
        display: "flex",
        justifyContent: "space-between",
        gap: "1em",
        padding: "10px",
        borderRadius: "10px",
        "&:hover": {
            background: "#F7F7F7",
            cursor: "pointer",
            transition: "all 0.2s ease-in-out",
        },
        height: "auto",
        "@media (max-width: 800px)": {
            //flexDirection: "column",
            //flexWrap: "wrap",
            minWidth: "100%",
        },
    },
    smallArticleCardImage: {
        flexBasis: "100%",
        backgroundPosition: "center",
        backgroundSize: "cover",
        //height: "100%",
        transition: "all 0.2s ease-in-out",
        borderRadius: "5px",
        overflow: "hidden",
        maxWidth: "30%",
        minWidth: "30%",
    },
}));

export default function FeaturedEventWikisGrid({ type }) {
    const router = useRouter();
    const { classes } = useStyles();

    const featureTimelineEventsQuery = useQuery({
        queryKey: ["fetch-featured-timeline-events", type],
        queryFn: () => {
            return axios.get(`/api/articles/featured?type=${type}`);
        },
        refetchOnWindowFocus: false,
        onSuccess: (res) => {
            //setItems(res.data);
            console.log("type: ", type, res.data);
        },
    });

    return (
        <div className={classes.cont}>
            <div
                className={classes.bigArticleCard}
                onClick={() =>
                    router.push(
                        `/timeline?type=${featureTimelineEventsQuery.data?.data[0].tag}&articleId=${featureTimelineEventsQuery.data?.data[0]._id}`
                    )
                }
            >
                <Image
                    //fit="unset"
                    className={classes.bigArticleCardImage}
                    style={{
                        backgroundImage: `url(${
                            /*featureTimelineEventsQuery.data?.data[0]
                                .coverImage ||*/
                            "/statics/default_cover.png"
                        })`,
                    }}
                    //alt=""
                    src={featureTimelineEventsQuery.data?.data[0].coverImage}
                    alt="cover image"
                />
                <Title
                    align="center"
                    order={2}
                    sx={{
                        //minWidth: "300px",
                        //maxWidth: "300px",
                        fontFamily: "Lora, serif",
                        fontWeight: "200",
                    }}
                    lineClamp={3}
                >
                    {featureTimelineEventsQuery.data?.data[0].title || (
                        <div>loading big article...</div>
                    )}
                </Title>
                <Text size="md" align="center" color="dimmed" lineClamp={5}>
                    {featureTimelineEventsQuery.data?.data[0].description || (
                        <div>loading big article...</div>
                    )}
                </Text>
            </div>

            <div className={classes.smallArticlesCont}>
                {featureTimelineEventsQuery.data?.data
                    .slice(1)
                    .map((article, i) => {
                        return (
                            <div key={article._id}>
                                <div
                                    className={classes.smallArticleCard}
                                    onClick={() =>
                                        router.push(
                                            `/timeline?type=${
                                                featureTimelineEventsQuery.data
                                                    ?.data[i + 1].tag
                                            }&articleId=${
                                                featureTimelineEventsQuery.data
                                                    ?.data[i + 1]._id
                                            }`
                                        )
                                    }
                                >
                                    <Stack align="left">
                                        <Title
                                            order={3}
                                            sx={{
                                                //minWidth: "300px",
                                                //maxWidth: "300px",
                                                fontFamily: "Lora, serif",
                                                fontWeight: "200",
                                            }}
                                            lineClamp={3}
                                        >
                                            {article.title || (
                                                <div>
                                                    loading small article...
                                                </div>
                                            )}
                                        </Title>
                                        <Text
                                            size="sm"
                                            color="dimmed"
                                            lineClamp={3}
                                        >
                                            {article.description || (
                                                <div>
                                                    loading small article...
                                                </div>
                                            )}
                                        </Text>
                                    </Stack>
                                    {/*<div
                                        className={
                                            classes.smallArticleCardImage
                                        }
                                        style={{
                                            backgroundImage: `url(${
                                                article?.coverImage ||
                                                "https://img.freepik.com/free-vector/vector-illustration-mountain-landscape_1441-72.jpg"
                                            })`,
                                        }}
                                    ></div>*/}
                                    <Image
                                        className={
                                            classes.smallArticleCardImage
                                        }
                                        style={{
                                            backgroundImage: `url(${
                                                /*featureTimelineEventsQuery.data?.data[0]
                                .coverImage ||*/
                                                "/statics/default_cover.png"
                                            })`,
                                        }}
                                        //alt=""
                                        src={article.coverImage}
                                        alt="cover image"
                                        height="150px"
                                        /*width="100%"*/
                                        fit="cover"
                                    />
                                </div>

                                <Divider />
                            </div>
                        );
                    })}
            </div>
        </div>
    );
}
