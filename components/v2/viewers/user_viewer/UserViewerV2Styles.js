import { createStyles } from "@mantine/core";

export const useStyles = createStyles((theme) => ({
    cont: {
        //height: "100%",
        padding: "5em",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "5em",
        //
        overflow: "auto",
        //height: "100%",
        //width: "100%",
        //border: "1px solid teal",
        borderRadius: "1.5em",
        backgroundColor: "#F8F9FA",

        "@media (max-width: 800px)": {
            flexWrap: "wrap",
            paddingLeft: "0px",
            paddingRight: "0px",
            gap: "1em",
        },
        /*
        "&:hover": {
            paddingLeft: "5rem",
            paddingRight: "5rem",
        },*/
    },
    avatar: {
        height: "100px",
        width: "100px",
        "@media (max-width: 800px)": {
            height: "150px",
            width: "150px",
        },
        flexShrink: "1",
    },
    divider: {
        borderLeft: "1px solid gray",
        height: "5em",
        "@media (max-width: 800px)": {
            display: "none",
        },
    },
    infoCont: {
        flexShrink: "1",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: "1em",
        backgroundColor: "white",
        border: "1px solid lightgrey",
        padding: "2em",
        borderRadius: "1.5em",
    },
    title: {
        fontSize: "18px",
        "@media (max-width: 800px)": {
            fontSize: "1.3em",
            textAlign: "center",
        },
    },
    text: {
        color: "teal",
        "@media (max-width: 800px)": {
            textAlign: "center",
        },
    },
}));
