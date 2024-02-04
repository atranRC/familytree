import { Tabs } from "@mantine/core";
import {
    IconArticle,
    IconCalendarEvent,
    IconMap2,
    IconMicrophone2,
    IconSeeding,
    IconShadow,
    IconTransferOut,
} from "@tabler/icons";
import { useContext, useState } from "react";
import { createStyles } from "@mantine/core";
import { ProfilePageProfileContext } from "../../../contexts/profilePageContexts";

const useStyles = createStyles((theme) => ({
    cont: {
        position: "-webkit-sticky" /* Safari */,
        position: "sticky",
        top: "0",
        display: "flex",
        justifyContent: "center",
        backgroundColor: "white",
        padding: ".5em",
        zIndex: 99,
        boxShadow: " rgba(0, 0, 0, 0.1) 0px 1px 2px 0px",
        borderRadius: "1em",
        overflow: "auto",
        "@media (max-width: 800px)": {
            //flexWrap: "wrap",
            justifyContent: "flex-start",
            paddingLeft: "0px",
            paddingRight: "0px",
            gap: "1em",
        },
    },
}));

export default function ProfileSecondaryNabar({ activePage, onTabClick }) {
    const profileContext = useContext(ProfilePageProfileContext);
    const [activeTab, setActiveTab] = useState(activePage);
    const { classes } = useStyles();
    return (
        <div className={classes.cont}>
            <Tabs
                color={
                    profileContext.died
                        ? "gray"
                        : profileContext.owner !== "self"
                        ? "green"
                        : "violet"
                }
                variant="pills"
                radius="xl"
                defaultValue="gallery"
                value={activeTab}
                onTabChange={setActiveTab}
            >
                <Tabs.List
                    sx={{
                        flexWrap: "nowrap",
                        overflow: "auto",
                        padding: "5px",
                    }}
                >
                    <Tabs.Tab
                        value="overview"
                        icon={<IconShadow />}
                        onClick={() => onTabClick("overview")}
                    >
                        Overview
                    </Tabs.Tab>
                    {/*<Tabs.Tab
                        value="family-trees"
                        icon={<IconSeeding />}
                        onClick={() => onTabClick("family-trees")}
                    >
                        Family Trees
                    </Tabs.Tab>*/}
                    <Tabs.Tab
                        value="events"
                        icon={<IconCalendarEvent />}
                        onClick={() => onTabClick("events")}
                    >
                        Events
                    </Tabs.Tab>
                    <Tabs.Tab
                        value="written-stories"
                        icon={<IconArticle />}
                        onClick={() => onTabClick("written-stories")}
                    >
                        Written Stories
                    </Tabs.Tab>
                    <Tabs.Tab
                        value="audio-stories"
                        icon={<IconMicrophone2 />}
                        onClick={() => onTabClick("audio-stories")}
                    >
                        Audio Stories
                    </Tabs.Tab>
                    <Tabs.Tab
                        value="places"
                        icon={<IconMap2 />}
                        onClick={() => onTabClick("places")}
                    >
                        Places
                    </Tabs.Tab>
                </Tabs.List>
            </Tabs>
        </div>
    );
}
