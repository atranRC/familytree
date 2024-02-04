import {
    Divider,
    Image,
    Stack,
    Text,
    Title,
    createStyles,
} from "@mantine/core";
import { useRouter } from "next/router";

const useStyles = createStyles((theme) => ({
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

export default function SmallArticleCard({ article, url }) {
    const router = useRouter();
    const { classes } = useStyles();
    return (
        <div
            className={classes.smallArticleCard}
            onClick={() => router.push(url)}
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
                    {article.title}
                </Title>
                <Text size="sm" color="dimmed" lineClamp={3}>
                    {article.description}
                </Text>
            </Stack>

            <Image
                className={classes.smallArticleCardImage}
                style={{
                    backgroundImage: `url(${"/statics/default_cover.png"})`,
                }}
                //alt=""
                src={article.coverImage}
                alt="cover image"
                height="150px"
                /*width="100%"*/
                fit="cover"
            />
        </div>
    );
}
