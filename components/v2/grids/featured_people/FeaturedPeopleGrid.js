import {
    Badge,
    Button,
    Divider,
    Group,
    Paper,
    Stack,
    Text,
    Title,
    createStyles,
} from "@mantine/core";
import { IconAffiliate, IconFilter } from "@tabler/icons";
import { truncateWord } from "../../../../utils/utils";
import { useQuery } from "react-query";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/router";

const useStyles = createStyles((theme) => ({
    cont: {
        marginTop: "2em",
        display: "flex",
        alignItems: "center",
        width: "100%",
        gap: "1em",
        //flexWrap: "wrap",
        overflowY: "auto",
    },
    card: {
        display: "flex",
        flexDirection: "column",
        padding: "10px",
        borderRadius: "10px",
        "&:hover": {
            background: "#F7F7F7",
            cursor: "pointer",
            transition: "all 0.2s ease-in-out",
        },
        minWidth: "300px",
    },
    img: {
        backgroundPosition: "center",
        backgroundSize: "cover",
        width: "100%",
        height: "120px",
        transition: "all 0.2s ease-in-out",

        borderRadius: "5px",
    },
    filtersCont: {
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
    },
}));
export default function FeaturedPeopleGrid({
    header = "",
    tag = "public_figure",
    withFilters = false,
}) {
    const router = useRouter();
    const { classes } = useStyles();
    const [tagName, setTagName] = useState();
    const featuredPeopleQuery = useQuery({
        queryKey: ["fetch-featured-people", tag, tagName],
        queryFn: () => {
            return axios.get(`/api/wikis/featured?tag=${tagName || tag}`);
        },
        refetchOnWindowFocus: false,
        onSuccess: (res) => {
            //setItems(res.data);
            //console.log("people", res.data);
        },
    });
    return (
        <div className={classes.cont}>
            <Stack align="center" justify="right" spacing={10}>
                <Title
                    align="right"
                    sx={{
                        minWidth: "300px",
                        maxWidth: "300px",
                        fontFamily: "Lora, serif",
                        fontWeight: "200",
                    }}
                >
                    {header}
                </Title>
                {withFilters && (
                    <div className={classes.filtersCont}>
                        <Button
                            size="xs"
                            variant="subtle"
                            color="grape"
                            rightIcon={<IconFilter size={18} />}
                            onClick={() => {
                                setTagName("public_figure");
                            }}
                        >
                            Show Public Figures
                        </Button>
                        <Button
                            size="xs"
                            variant="subtle"
                            color="violet"
                            rightIcon={<IconFilter size={18} />}
                            onClick={() => {
                                setTagName("martyr");
                            }}
                        >
                            Show Martyrs
                        </Button>
                    </div>
                )}
            </Stack>
            <Divider orientation="vertical" ml="md" mr="md" />
            {featuredPeopleQuery.data?.data.map((p, i) => {
                return (
                    <div
                        className={classes.card}
                        key={i}
                        onClick={() => router.push(`/wiki/${p._id}`)}
                    >
                        <div
                            className={classes.img}
                            style={{
                                backgroundImage: `url(${p?.coverImage})`,
                            }}
                        ></div>
                        <Title order={3} sx={{ fontFamily: "Lora, serif" }}>
                            {truncateWord(p?.title, 20) || "loading"}
                        </Title>
                        <Text color="dimmed" size="sm" lineClamp={4}>
                            {p?.description || "loading"}
                        </Text>
                    </div>
                );
            }) || <div>loading...</div>}
        </div>
    );
}
