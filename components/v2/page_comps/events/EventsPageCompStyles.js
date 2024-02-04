import { createStyles } from "@mantine/core";

export const useStyles = createStyles((theme) => ({
    cont: {
        paddingTop: "1em",
        paddingLeft: "5em",
        paddingRight: "5em",
        //border: "1px solid #E8E8E8",
        display: "flex",
        justifyContent: "center",
        gap: "1em",
        /*position: "-webkit-sticky" ,
        position: "sticky",
        top: "0px",*/
        "@media (max-width: 800px)": {
            paddingLeft: "0px",
            paddingRight: "0px",
        },
    },
    miniCardsCont: {
        //border: "1px solid #E8E8E8",
        // minHeight: "100vh",

        flexGrow: "1",

        maxHeight: "90vh",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: "2em",
        flexBasis: "40%",
        "@media (max-width: 800px)": {
            flexBasis: "100%",
            padding: "5px",
        },

        //flexBasis: "3em",
        //flexShrink: "0",
    },
    pillsCont: {
        display: "flex",
        justifyContent: "center",
        gap: "5px",
        flexWrap: "wrap",
    },

    viewerCont: {
        //border: "1px solid #E8E8E8",
        //minHeight: "100vh",
        flexGrow: "3",
        flexBasis: "60%",
        maxHeight: "90vh",
        overflowY: "auto",
        "@media (max-width: 800px)": {
            display: "none",
        },
    },
}));
