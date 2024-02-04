import {
    Button,
    Paper,
    Stack,
    Tabs,
    Text,
    Title,
    createStyles,
} from "@mantine/core";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const useStyles = createStyles((theme) => ({
    cont: {
        backgroundColor: "#F8F9FA",
        //border: "1px solid",
        borderRadius: "1.5em",
        padding: "2em",
        height: "70vh",
        display: "flex",
        justifyContent: "space-between",
        gap: "2rem",
        "@media (max-width: 800px)": {
            flexDirection: "column",
            paddingLeft: "0px",
            paddingRight: "0px",
        },
    },
    horizontalTabs: {
        //border: "1px solid",
        "@media (min-width: 800px)": {
            display: "none",
        },
    },

    verticalTabs: {
        //border: "1px solid",
        //flexShrink: "0",
        flexBasis: "15%",
        "@media (max-width: 800px)": {
            display: "none",
        },
        display: "flex",
        justifyContent: "right",
        alignItems: "center",
    },
    contentSection: {
        flexGrow: "8",
        //border: "1px solid indigo",
        borderRadius: "1.5em",
        padding: "2em",
        backgroundColor: "white",
        overflow: "auto",
        "@media (max-width: 800px)": {
            //flexDirection: "column",
            padding: "0px",
            padding: "0px",
        },
    },
}));

export default function TagUserMenuLoadingScreen() {
    const { classes } = useStyles();
    return (
        <div className={classes.cont}>
            <div className={classes.horizontalTabs}>
                <Paper>
                    <Skeleton count={3} />
                </Paper>
            </div>
            <div className={classes.verticalTabs}>
                <Tabs
                    variant="pills"
                    orientation="vertical"
                    radius="md"
                    defaultValue="viewUser"
                    color="indigo"
                >
                    <Tabs.List>
                        <Skeleton count={3} />
                    </Tabs.List>
                </Tabs>
            </div>
            <div className={classes.contentSection}>
                <Skeleton count={3} />
            </div>
        </div>
    );
}
