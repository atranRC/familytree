import {
    createStyles,
    Text,
    Title,
    TextInput,
    Button,
    Image,
    Stack,
    Loader,
    Divider,
} from "@mantine/core";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";

/*
    hero banner for featured artefacs on the main landing page
*/

export default function ArtefactBanner() {
    const useStyles = createStyles((theme) => ({
        wrapper: {
            display: "flex",
            alignItems: "center",
            padding: `calc(${theme.spacing.xl} * 2)`,
            borderRadius: theme.radius.md,
            backgroundColor:
                theme.colorScheme === "dark"
                    ? theme.colors.dark[8]
                    : theme.white,
            border: `1px solid ${
                theme.colorScheme === "dark"
                    ? theme.colors.dark[8]
                    : theme.colors.gray[3]
            }`,

            [theme.fn.smallerThan("sm")]: {
                flexDirection: "column-reverse",
                padding: theme.spacing.xl,
            },
        },

        image: {
            maxWidth: "40%",

            [theme.fn.smallerThan("sm")]: {
                maxWidth: "100%",
            },
        },

        body: {
            minWidth: "60%",
            paddingRight: `calc(${theme.spacing.xl} * 4)`,

            [theme.fn.smallerThan("sm")]: {
                paddingRight: 0,
                marginTop: theme.spacing.xl,
            },
        },

        title: {
            color: theme.colorScheme === "dark" ? theme.white : theme.black,
            fontFamily: `Greycliff CF, ${theme.fontFamily}`,
            lineHeight: 1,
            marginBottom: theme.spacing.md,
            "&:hover": {
                //border: "1px solid",
                textDecoration: "underline",
                transition: "0.5s",
                cursor: "pointer",
            },
        },

        controls: {
            display: "flex",
            marginTop: theme.spacing.xl,
        },

        inputWrapper: {
            width: "100%",
            flex: "1",
        },

        input: {
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
            borderRight: 0,
        },

        control: {
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
        },
    }));

    const { classes } = useStyles();
    const [featuredWiki, setFeaturedWiki] = useState(null);

    const { isLoading, isFetching, data, refetch, isError, error } = useQuery({
        queryKey: "fetch_featured_wiki_artefact",
        queryFn: () => {
            return axios.get("/api/wikis/featured/artefact");
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
        queryKey: "fetch_wiki_artefact",
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
    }, []);

    if (isLoading || isFetching || !featuredWiki) {
        return <Loader />;
    }

    return (
        <div className={classes.wrapper}>
            <div className={classes.body}>
                <Stack p="md" spacing="lg">
                    <Divider
                        label="Featured today"
                        px="xl"
                        //pt="xl"
                        labelPosition="center"
                        c="dimmed"
                    />
                    <Stack spacing={0}>
                        <Link
                            //legacyBehavior
                            href={`/wiki/${featuredWiki._id.toString()}`}
                            rel="noopener noreferrer"
                            target="_blank"
                            //className={classes.treeLink}
                            style={{ textDecoration: "none" }}
                        >
                            <Title className={classes.title}>
                                {featuredWiki.title}
                            </Title>
                        </Link>

                        <Text fz="sm" c="dimmed">
                            {featuredWiki.description}
                        </Text>
                    </Stack>
                </Stack>
            </div>
            <Image
                src={featuredWiki.coverImage}
                className={classes.image}
                alt="img seven"
            />
        </div>
    );
}
