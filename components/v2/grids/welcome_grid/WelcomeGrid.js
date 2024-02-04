import {
    Button,
    Divider,
    Group,
    Image,
    Stack,
    Text,
    Title,
    createStyles,
} from "@mantine/core";
import { IconExternalLink, IconLink, IconPlant2 } from "@tabler/icons";
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
    articlesCont: {
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: "60%",
        minHeight: "100%",
        display: "flex",
        flexDirection: "column",
        //add reversed column

        justifyContent: "space-between",
    },
    articleCard: {
        minWidth: "250px",
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        padding: "10px",
        borderRadius: "10px",
        "&:hover": {
            background: "#F7F7F7",
            cursor: "pointer",
            transition: "all 0.2s ease-in-out",
        },
    },
    articleCardImage: {
        backgroundPosition: "center",
        backgroundSize: "cover",
        width: "100%",
        height: "100px",
        transition: "all 0.2s ease-in-out",

        borderRadius: "5px",
        overflow: "hidden",
    },
    herosCont: {
        //border: "1px solid yellow",
        flexGrow: 3,
        //flexShrink: 1,
        "@media (max-width: 800px)": {
            //fontSize: "1.5rem",
            //marginBottom: "-1rem",
            //display: "none",
            //paddingLeft: "1em",
            //paddingRight: "1em",
        },
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: "1em",
    },
    timelineCard: {
        //maxWidth: "40%",
        padding: "10px",
        background: "#F7F7F7",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1em",
        borderRadius: "10px",
        border: "1px solid #E8E8E8",
        "&:hover": {
            background: "white",
        },
    },

    famTreeCard: {
        //maxWidth: "40%",
        padding: "10px",
        background: "#F7F7F7",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1em",
        borderRadius: "10px",
        border: "1px solid #E8E8E8",
        "&:hover": {
            background: "white",
        },
    },
}));

export default function WelcomeGrid() {
    const router = useRouter();
    const { classes } = useStyles();

    const historyEventsQuery = useQuery({
        queryKey: ["fetch-featured-timeline-events"],
        queryFn: () => {
            return axios.get(`/api/articles/featured?type=his`);
        },
        refetchOnWindowFocus: false,
        onSuccess: (res) => {
            //setItems(res.data);
            console.log(res.data);
        },
    });
    return (
        <div className={classes.cont}>
            <div className={classes.articlesCont}>
                <div
                    className={classes.articleCard}
                    onClick={() =>
                        router.push(
                            `/timeline?type=his&articleId=${historyEventsQuery.data?.data[0]._id}`
                        )
                    }
                >
                    {/*<div
                        className={classes.articleCardImage}
                        style={{
                            backgroundImage: `url("https://images.unsplash.com/photo-1683009427500-71296178737f?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")`,
                        }}
                    ></div>*/}
                    <Image
                        className={classes.articleCardImage}
                        style={{
                            backgroundImage: `url(${
                                /*featureTimelineEventsQuery.data?.data[0]
                                .coverImage ||*/
                                "/statics/default_cover.png"
                            })`,
                        }}
                        //alt=""
                        src={historyEventsQuery.data?.data[0].coverImage}
                        alt="cover image"
                    />
                    <Title order={3} sx={{ fontFamily: "Lora, serif" }}>
                        {historyEventsQuery.data?.data[0].title || (
                            <div>loading article...</div>
                        )}
                    </Title>
                    <Text color="dimmed" size="sm" lineClamp={4}>
                        {historyEventsQuery.data?.data[0].description || (
                            <div>loading article...</div>
                        )}
                    </Text>
                </div>
                <div
                    className={classes.articleCard}
                    onClick={() =>
                        router.push(
                            `/timeline?type=his&articleId=${historyEventsQuery.data?.data[1]._id}`
                        )
                    }
                >
                    <Image
                        className={classes.articleCardImage}
                        style={{
                            backgroundImage: `url(${
                                /*featureTimelineEventsQuery.data?.data[0]
                                .coverImage ||*/
                                "/statics/default_cover.png"
                            })`,
                        }}
                        //alt=""
                        src={historyEventsQuery.data?.data[1].coverImage}
                        alt="cover image"
                    />
                    <Title order={3} sx={{ fontFamily: "Lora, serif" }}>
                        {historyEventsQuery.data?.data[1].title || (
                            <div>loading article...</div>
                        )}
                    </Title>
                    <Text color="dimmed" size="sm" lineClamp={4}>
                        {historyEventsQuery.data?.data[1].description || (
                            <div>loading article...</div>
                        )}
                    </Text>
                </div>
            </div>
            <div className={classes.herosCont}>
                <Stack spacing={0}>
                    <Title
                        align="center"
                        //color="dimmed"
                        sx={{
                            //minWidth: "300px",
                            //maxWidth: "300px",
                            fontFamily: "Playfair Display, serif",

                            fontWeight: "700",
                            fontSize: "2.5rem",
                        }}
                    >
                        Welcome to TigrayWiki
                    </Title>
                    <Title
                        align="center"
                        //color="dimmed"
                        order={4}
                        sx={{
                            //minWidth: "300px",
                            //maxWidth: "300px",
                            fontFamily: "Playfair Display, serif",

                            fontWeight: "200",
                            fontStyle: "italic",
                        }}
                    >
                        the encyclopedia for everything Tigray
                    </Title>
                </Stack>
                <Divider
                    label={<IconPlant2 color="gray" />}
                    labelPosition="center"
                />
                <div className={classes.timelineCard}>
                    <Title
                        align="center"
                        order={2}
                        sx={{
                            //minWidth: "300px",
                            //maxWidth: "300px",
                            fontFamily: "Lora, serif",
                            fontWeight: "200",
                        }}
                    >
                        The Tigray Timeline
                    </Title>
                    <Text size="sm" align="center" color="#474747">
                        Explore the events and consequences of the Tigray
                        Genocide, one of the most horrific atrocities of the
                        21th century. Learn about the causes and stages of the
                        genocide, which has so far claimed the lives of more
                        than 500,000 Tigrayans. Experience the severity of the
                        violence and suffering that the victims and survivors
                        endured. Read stories from the people of Tigray how the
                        genocide has affected their lives, their society, and
                        their hopes for the future.
                    </Text>
                    <Divider />
                    <Group>
                        <Button
                            compact
                            variant="subtle"
                            color="grape"
                            rightIcon={<IconExternalLink size={18} />}
                            onClick={() => router.push("/timeline?type=gen")}
                        >
                            Visit the Tigray Genocide Timeline
                        </Button>
                        <Button
                            compact
                            variant="subtle"
                            color="violet"
                            rightIcon={<IconExternalLink size={18} />}
                            onClick={() => router.push("/timeline?type=his")}
                        >
                            Visit the Tigray History Timeline
                        </Button>
                    </Group>
                </div>
                <div className={classes.famTreeCard}>
                    <Title
                        align="center"
                        order={2}
                        sx={{
                            //minWidth: "300px",
                            //maxWidth: "300px",
                            fontFamily: "Lora, serif",
                            fontWeight: "200",
                        }}
                    >
                        Family Tree
                    </Title>
                    <Text size="sm" align="center" color="#474747">
                        Build your family trees with the help of your relatives.
                        Document and share important moments of your life with
                        your loved ones. Share Written or Audio Stories and
                        learn more about your ancestors, your heritage, and
                        yourself. Explore and celebrate your family history.
                    </Text>
                    <Divider />
                    <Group>
                        <Button
                            compact
                            variant="subtle"
                            color="grape"
                            rightIcon={<IconExternalLink size={18} />}
                            onClick={() =>
                                router.push("/family-tree/my-trees-v2")
                            }
                        >
                            Build your Family Tree
                        </Button>
                        <Button
                            compact
                            variant="subtle"
                            color="violet"
                            rightIcon={<IconExternalLink size={18} />}
                            disabled
                        >
                            Learn More
                        </Button>
                    </Group>
                </div>
            </div>
            <div className={classes.articlesCont}>
                <div
                    className={classes.articleCard}
                    onClick={() =>
                        router.push(
                            `/timeline?type=his&articleId=${historyEventsQuery.data?.data[2]._id}`
                        )
                    }
                >
                    <Image
                        className={classes.articleCardImage}
                        style={{
                            backgroundImage: `url(${
                                /*featureTimelineEventsQuery.data?.data[0]
                                .coverImage ||*/
                                "/statics/default_cover.png"
                            })`,
                        }}
                        //alt=""
                        src={historyEventsQuery.data?.data[2].coverImage}
                        alt="cover image"
                    />
                    <Title order={3} sx={{ fontFamily: "Lora, serif" }}>
                        {historyEventsQuery.data?.data[2].title || (
                            <div>loading article...</div>
                        )}
                    </Title>
                    <Text color="dimmed" size="sm" lineClamp={4}>
                        {historyEventsQuery.data?.data[2].description || (
                            <div>loading article...</div>
                        )}
                    </Text>
                </div>
                <div
                    className={classes.articleCard}
                    onClick={() =>
                        router.push(
                            `/timeline?type=his&articleId=${historyEventsQuery.data?.data[3]._id}`
                        )
                    }
                >
                    <Image
                        className={classes.articleCardImage}
                        style={{
                            backgroundImage: `url(${
                                /*featureTimelineEventsQuery.data?.data[0]
                                .coverImage ||*/
                                "/statics/default_cover.png"
                            })`,
                        }}
                        //alt=""
                        src={historyEventsQuery.data?.data[3].coverImage}
                        alt="cover image"
                    />
                    <Title order={3} sx={{ fontFamily: "Lora, serif" }}>
                        {historyEventsQuery.data?.data[3].title || (
                            <div>loading article...</div>
                        )}
                    </Title>
                    <Text color="dimmed" size="sm" lineClamp={4}>
                        {historyEventsQuery.data?.data[3].description || (
                            <div>loading article...</div>
                        )}
                    </Text>
                </div>
            </div>
        </div>
    );
}
