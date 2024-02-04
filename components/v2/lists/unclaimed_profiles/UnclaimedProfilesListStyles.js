import { createStyles } from "@mantine/core";

export const useStyles = createStyles((theme) => ({
    accordionContentCont: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: ".5em",
        padding: "1em",
        //backgroundColor: "#F8F9FA",

        height: "100%",
        //width: "50%",

        //width: "70%",
        //maxWidth: "70%",

        border: "1px solid red",
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        borderRadius: "1.5em",
        padding: "2em",
        "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            transition: ".2s ease-in-out",
        },
        /*display: "flex",
        flexDirection: "column",
        gap: "1em",*/
        "@media (max-width: 800px)": {
            paddingLeft: "10px",
            paddingRight: "10px",
            width: "100%",
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
    header: {
        fontSize: "24px",
        "@media (max-width: 800px)": {
            fontSize: "1.3em",
            textAlign: "center",
        },
    },
    title: {
        fontSize: "15px",
        "@media (max-width: 800px)": {
            fontSize: "1.1em",
            textAlign: "center",
        },
    },

    text: {
        color: "teal",
        "@media (max-width: 800px)": {
            textAlign: "center",
        },
    },
    link: {
        fontSize: "14px",
        fontStyle: "italic",
        textAlign: "right",
    },
    searchBarCont: {
        display: "flex",
        gap: "1em",
        width: "100%",
        //border: "1px solid lightgrey",
    },
    searchInput: {
        marginRight: "auto",
        width: "100%",
    },
}));
