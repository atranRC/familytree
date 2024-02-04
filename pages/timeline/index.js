import {
    Box,
    Container,
    Divider,
    Group,
    Image,
    MediaQuery,
    Paper,
    Stack,
    Text,
    Title,
    createStyles,
} from "@mantine/core";
import WikiNavBar from "../../components/v2/nav/wiki_navbar/WikiNavbar";
import { FooterCentered } from "../../components/appFooter/appFooter";
import { mockData } from "../../components/appFooter/mockData";
import { useState } from "react";
import { useRouter } from "next/router";
import Tl from "../../components/timelineComp";
import dynamic from "next/dynamic";
import FeaturedEventWikisGrid from "../../components/v2/grids/featured_event_wikis/FeaturedEventWikiGrid";
import { IconAnchor } from "@tabler/icons";
import TimelineSelectArticlePrompt from "../../components/v2/help/TimelineSelectArticlePrompt";
import WikiArticleViewer from "../../components/v2/viewers/wiki_article/WikiArticleViewer";
import { useQuery } from "react-query";
import axios from "axios";

/*const Tl = dynamic(() => import("../../components/timelineComp"), {
    ssr: false,
});*/

const useStyles = createStyles((theme) => ({
    //#F7F7F7 -gray
    timelineCont: {
        marginTop: "60px",
    },
}));

export default function TimelinePage() {
    const router = useRouter();
    const { classes } = useStyles();
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [range, setRange] = useState([Date.now(), Date.now()]);
    const [items, setItems] = useState([]);

    const timelineEventsQuery = useQuery({
        queryKey: ["fetch-timeline-events", range, router.query],
        queryFn: () => {
            return axios.get(
                `/api/public-timeline?gt=${range[0]}&lt=${range[1]}&tag=${router.query.type}`
            );
        },
        refetchOnWindowFocus: false,
        onSuccess: (res) => {
            setItems(res.data);
        },
    });

    const handleTimelineItemSelect = (id) => {
        router.push(
            {
                //...router,
                query: {
                    ...router.query,
                    articleId: id,
                },
            },
            undefined,
            { shallow: true }
        );
    };

    //if (!router.isReady) return <div>loading</div>;
    return (
        <div>
            <WikiNavBar searchPage={router?.query.type} />

            <div className={classes.timelineCont}>
                <Tl
                    timelineItems={items}
                    selectedArticle={selectedArticle}
                    setSelectedArticle={setSelectedArticle}
                    setRange={setRange}
                    onItemSelect={handleTimelineItemSelect}
                />
            </div>

            <Container
                size="md"
                mt={60}
                mb={60}
                //w="100%"
                //mih="200vh"
                p={0}
                sx={{
                    "@media (max-width: 800px)": {
                        //fontSize: "1.5rem",
                        //marginBottom: "-1rem",
                        //display: "none",
                        //maxWidth: "100%",
                        padding: "10px",
                    },
                }}
            >
                <Stack spacing="xl">
                    {!router.query.articleId && !router.query.type && (
                        <TimelineSelectArticlePrompt />
                    )}
                    {!router.query.articleId && router.query.type === "gen" && (
                        <Stack>
                            <TimelineSelectArticlePrompt />
                            <Title
                                mt="xl"
                                //pl={10}
                                order={2}
                                sx={{
                                    //minWidth: "300px",
                                    //maxWidth: "300px",
                                    fontFamily: "Lora, serif",
                                    fontWeight: "200",
                                }}
                            >
                                Events From the Tigray Genocide
                            </Title>
                            <Divider />
                            <FeaturedEventWikisGrid type={router.query.type} />
                        </Stack>
                    )}
                    {!router.query.articleId && router.query.type === "his" && (
                        <Stack>
                            <TimelineSelectArticlePrompt />
                            <Title
                                mt="xl"
                                //pl={10}
                                order={2}
                                sx={{
                                    //minWidth: "300px",
                                    //maxWidth: "300px",
                                    fontFamily: "Lora, serif",
                                    fontWeight: "200",
                                }}
                            >
                                Featured Events From the Tigray History Timeline
                            </Title>
                            <Divider />
                            <FeaturedEventWikisGrid type={router.query.type} />
                        </Stack>
                    )}
                    {router.query.articleId && <WikiArticleViewer />}
                </Stack>
            </Container>
            <FooterCentered links={mockData.links} />
        </div>
    );
}
