import { createStyles } from "@mantine/core";

export const useStyles = createStyles((theme) => ({
    cont: {
        /*paddingLeft: "5rem",
        paddingRight: "5rem",
        paddingTop: "2rem",
        display: "flex",
        flexDirection: "column",
        gap: "2rem",*/
        /*"@media (max-width: 800px)": {
            paddingLeft: "0px",
            paddingRight: "0px",
        },

        "&:hover": {
            paddingLeft: "5rem",
            paddingRight: "5rem",
        },*/
        //backgroundColor: "#F8F9FA",
        //border: "1px solid",
        borderRadius: "1.5em",
        padding: "1em",
        //height: "70vh",
        height: "100%",
        display: "flex",
        justifyContent: "space-between",
        gap: "2rem",
        "@media (max-width: 800px)": {
            flexDirection: "column",
            padding: "0em",
            gap: "1px",
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
        //alignItems: "center",
    },
    contentSection: {
        flexGrow: "8",
        //border: "1px solid indigo",
        borderRadius: "1.5em",
        padding: "1em",

        backgroundColor: "white",
        overflow: "auto",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        maxHeight: "65vh",
        height: "65vh",
        overflowY: "auto",
        /*"@media (max-width: 2000px)": {
            //flexDirection: "column",
            padding: "0px",
            alignItems: "flex-start",
        },*/
        "@media (max-width: 800px)": {
            //width: "100%",
            marginTop: "10px",
            padding: "0px",
            maxHeight: "78vh",
            height: "78vh",
        },
    },
}));
