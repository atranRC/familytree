import { createStyles } from "@mantine/core";

export const useStyles = createStyles((theme) => ({
    cont: {
        paddingTop: "1em",
        //border: "1px solid #E8E8E8",
        display: "flex",
        justifyContent: "center",
        gap: "1em",
        /*position: "-webkit-sticky" ,
        position: "sticky",
        top: "0px",*/
        height: "100vh",
        "@media (max-width: 800px)": {
            flexDirection: "column",
        },
    },
    typeNavSection: {
        //border: "1px solid blue",
        flexBasis: "30%",
        padding: "2em",
        display: "flex",
        flexDirection: "column",
        gap: "2em",
        "@media (max-width: 800px)": {
            flexDirection: "row",
            flexWrap: "nowrap",
            justifyContent: "center",
            alignItems: "center",
        },
    },
    navTitle: {},
    verticalTabs: {
        width: "100%",
        //border: "1px solid blue",
    },
    mapSection: {
        //border: "1px solid red",
        flexBasis: "70%",
        //minHeight: "100%",
        position: "relative",
    },
}));
