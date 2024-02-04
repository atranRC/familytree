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
        width: "100%",
        //flexBasis: "50%",
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
        height: "100%",
        minHeight: "200px",
        transition: "all 0.2s ease-in-out",
        borderRadius: "5px",
        overflow: "hidden",
    },
}));

export default function BigArticleCard({ article, url }) {
    const router = useRouter();
    const { classes } = useStyles();
    return (
        <div
            className={classes.bigArticleCard}
            onClick={() => router.push(url)}
        >
            <Image
                //fit="unset"
                className={classes.bigArticleCardImage}
                style={{
                    backgroundImage: `url(${
                        /*article
                                .coverImage ||*/
                        "/statics/default_cover.png"
                    })`,
                }}
                //alt=""
                src={article?.coverImage || ""}
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
                {article?.title || "loading"}
            </Title>
            <Text size="md" align="center" color="dimmed" lineClamp={5}>
                {article?.description || "loading"}
            </Text>
        </div>
    );
}
