import {
    Divider,
    Group,
    Switch,
    Text,
    Title,
    createStyles,
} from "@mantine/core";
import { getEventStoryMapMarker } from "../../../utils/utils";
import dynamic from "next/dynamic";
import { useMediaQuery } from "@mantine/hooks";

const Map = dynamic(() => import("../../places_page/Map"), {
    ssr: false,
});

export const useStyles = createStyles((theme) => ({
    locationCont: {
        width: "100%",
        minHeight: "150px",
        //flexGrow: "1",
        display: "flex",
        justifyContent: "center",
        gap: "1em",
        //padding: "1em",
        paddingBottom: "10px",
        borderBottom: "1px solid #E8E8E8",
    },
    map: {
        //width: "100%",
        flexBasis: "60%",
        minHeight: "100%",
        //border: "1px solid #E8E8E8",
        flexGrow: "3",
        flexShrink: "0",
        borderRadius: "1em",
    },
    locationName: {
        //flexBasis: "30%",
        minHeight: "100%",
        //border: "1px solid #E8E8E8",
        flexGrow: "1",
        flexShrink: "1",
        overflowX: "auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        alignItems: "flex-end",
    },
    switchCont: {
        marginTop: "20px",
        display: "flex",
        gap: "5px",
        justifyContent: "flex-end",
    },
}));

export default function ArticleLocationViewer({ article }) {
    const { classes } = useStyles();
    // usequery
    const screenMatches = useMediaQuery("(max-width: 800px)");
    if (!article.location?.value) return <div>location not available</div>;
    return (
        <div className={classes.locationCont}>
            <div className={classes.locationName}>
                <Title
                    fz={screenMatches ? 14 : 18}
                    color="dimmed"
                    fw={200}
                    sx={{ fontFamily: "Lora, serif" }}
                    align="right"
                >
                    this event took place in:
                </Title>
                <Title
                    fz={screenMatches ? 18 : 24}
                    fw={200}
                    italic
                    sx={{ fontFamily: "Lora, serif" }}
                    align="right"
                >
                    {`${article?.location?.value}`}
                </Title>
                <Divider />
                <div className={classes.switchCont}>
                    <Text size="sm" pb={3} italic color="dimmed">
                        show nearby incidents
                    </Text>
                    <Switch size="xs" color="lime" disabled />
                </div>
            </div>
            <div className={classes.map}>
                <Map
                    markers={[
                        {
                            id: article?._id.toString(),
                            type: "event",
                            geoloc: [
                                article?.location?.lat.$numberDecimal ||
                                    article?.location?.lat ||
                                    0,
                                article?.location?.lon.$numberDecimal ||
                                    article?.location?.lon ||
                                    0,
                            ],
                        },
                    ]}
                    //setSelectedMarkerId={setSelectedMarkerId}
                    //setModalOpen={setModalOpen}
                />
            </div>
        </div>
    );
}
