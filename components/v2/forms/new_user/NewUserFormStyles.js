import { createStyles } from "@mantine/core";

export const useStyles = createStyles((theme) => ({
    formCont: {
        height: "100%",
        //width: "70%",
        //maxWidth: "70%",
        width: "100%",

        border: "1px solid red",
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        borderRadius: "1.5em",
        padding: "2em",
        "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            transition: ".2s ease-in-out",
        },
        display: "flex",
        flexDirection: "column",
        gap: "1em",
        "@media (max-width: 800px)": {
            paddingLeft: "10px",
            paddingRight: "10px",
            minWidth: "100%",
        },

        /*"@media (min-width: 1900px)": {
            paddingLeft: "10px",
            paddingRight: "10px",
            width: "30%",
            maxWidth: "30%",
        },*/
    },
    nameSection: {
        display: "flex",
        flexWrap: "wrap",
        gap: "1em",
    },
    sexSection: {
        display: "flex",
        //flexDirection: "column",
        flexWrap: "wrap",
        //justifyContent: "space-between",
        gap: "1em",
    },
    locationSection: {
        display: "flex",
        flexWrap: "wrap",
        gap: "1em",
    },
    location: {
        flexGrow: 1,
        maxWidth: "50%",
        "@media (max-width: 800px)": {
            //paddingLeft: "10px",
            //paddingRight: "10px",
            minWidth: "100%",
        },
        //flexShrink: 0,
    },
    miscSection: { display: "flex", flexWrap: "wrap", gap: "1em" },
}));
