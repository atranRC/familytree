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
import FeaturedPeopleGrid from "../../components/v2/grids/featured_people/FeaturedPeopleGrid";
import { FooterCentered } from "../../components/appFooter/appFooter";

import WikiNavBar from "../../components/v2/nav/wiki_navbar/WikiNavbar";
import { useRouter } from "next/router";
import { mockData } from "../../components/appFooter/mockData";
import { useQuery } from "react-query";
import axios from "axios";

const tags = [
    //hero, martyr, public_figure, artefact, heritage
    {
        value: "hero",
        label: "Heroes",
    },
    {
        value: "martyr",
        label: "Martyrs",
    },
    {
        value: "public_figure",
        label: "Public Figures",
    },
    {
        value: "artefact",
        label: "Artefacts",
    },
    {
        value: "heritage",
        label: "Tigrayan Heritage",
    },
];
const useStyles = createStyles((theme) => ({
    //#F7F7F7 -gray
    //https://dev.to/clairecodes/how-to-make-a-sticky-sidebar-with-two-lines-of-css-2ki7
    mainHeaderPic: {
        backgroundImage:
            "url('https://richmix.org.uk/wp-content/uploads/2022/12/image00138-1308x872.jpg')",
        backgroundPosition: "center",
        height: "40vh",
        //width: "100%",
        //overflowX: "auto",
    },
    pageTitleCont: {
        //border: "1px solid #F7F7F7",
        height: "40vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        //alignItems: "flex-end",
        overflowX: "auto",
        overflowY: "hidden",
    },

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
        //height: "150px",
        /*"@media (max-width: 800px)": {
            //flexDirection: "column",
            //flexWrap: "wrap",
            minWidth: "100%",
        },*/
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
    tagsCont: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "10px",
    },
    tag: {
        //pill div
        borderRadius: "1.5em",
        border: "1px solid #F7F7F7",
        backgroundColor: "#F7F7F7",
        paddingTop: "8px",
        paddingBottom: "8px",
        paddingLeft: "20px",
        paddingRight: "20px",

        cursor: "pointer",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
            //border: "1px solid #F7F7F7",
            backgroundColor: "white",
        },
    },
}));

export default function WikiHome() {
    const router = useRouter();
    const { classes } = useStyles();

    const handleTagChange = (tag) => {
        router.push(
            {
                //...router,
                query: {
                    ...router.query,
                    tag: tag,
                },
            },
            undefined,
            { shallow: true }
        );
    };

    const getPageTitle = () => {
        //if (!router.query.tag) return "People";
        if (router.query.tag === "hero") return "#Heroes";
        if (router.query.tag === "martyr") return "#Martyrs";
        if (router.query.tag === "public_figure") return "#PublicFigures";
        if (router.query.tag === "artefact") return "#Artefacts";
        if (router.query.tag === "heritage") return "#TigrayanHeritage";

        return "TigrayWiki";
    };

    const wikisQuery = useQuery({
        queryKey: ["fetch-wikis", router.query.tag],
        queryFn: () => {
            return axios.get(
                `/api/wikis/get-list?tag=${router.query.tag || "hero"}`
            );
        },
        refetchOnWindowFocus: false,
        onSuccess: (res) => {
            //setItems(res.data);
            console.log("gotem", res.data);
        },
    });

    return (
        <div>
            <WikiNavBar searchPage="wiki" />
            <div className={classes.mainHeaderPic}>
                <Container
                    size="lg"
                    mt={60}
                    //w="100%"
                    p={0}
                >
                    <div className={classes.pageTitleCont}>
                        <Title size={100} weight={900} color="white">
                            {getPageTitle()}
                        </Title>
                    </div>
                </Container>
            </div>

            <Container
                size="lg"
                mt={60}
                //w="100%"
                p={0}
            >
                <FeaturedPeopleGrid
                    header="Featured Today on TigrayWiki"
                    tag={router.query.tag}
                />
            </Container>
            <Divider mt="xl" mb="xl" />
            <Container
                size="lg"
                mt={60}
                //w="100%"
                p={0}
                //mah={"100vh"}
                className={classes.main}
            >
                <div className={classes.content}>
                    {wikisQuery.data?.data[0].data.map((article, i) => {
                        return (
                            <div
                                className={classes.smallArticleCard}
                                onClick={() =>
                                    router.push(`/wiki/${article._id}`)
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
                                    >
                                        {article?.title || (
                                            <div>loading small article...</div>
                                        )}
                                    </Title>
                                    <Text
                                        size="sm"
                                        color="dimmed"
                                        lineClamp={3}
                                    >
                                        {article?.description || (
                                            <div>loading small article...</div>
                                        )}
                                    </Text>
                                </Stack>
                                <Image
                                    className={classes.smallArticleCardImage}
                                    style={{
                                        backgroundImage: `url(${
                                            /*featureTimelineEventsQuery.data?.data[0]
                                .coverImage ||*/
                                            "/statics/default_cover.png"
                                        })`,
                                    }}
                                    //alt=""
                                    src={article?.coverImage}
                                    alt="cover image"
                                    height="150px"
                                    /*width="100%"*/
                                    fit="cover"
                                />
                            </div>
                        );
                    })}
                </div>
                <div className={classes.side}>
                    <Title fz={24} fw={200} sx={{ fontFamily: "Lora, serif" }}>
                        Discover Tigray Wiki
                    </Title>
                    <div className={classes.tagsCont}>
                        {tags.map((tag) => {
                            return (
                                <Text
                                    size="sm"
                                    className={classes.tag}
                                    key={tag.value}
                                    onClick={() => handleTagChange(tag.value)}
                                    sx={{
                                        border:
                                            router.query.tag === tag.value &&
                                            "1px solid #000000",
                                    }}
                                >
                                    {tag.label}
                                </Text>
                            );
                        })}
                    </div>
                    <FooterCentered links={mockData.links} />
                </div>
            </Container>
        </div>
    );
}
