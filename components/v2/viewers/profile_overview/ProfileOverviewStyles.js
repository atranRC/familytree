import { createStyles } from "@mantine/core";

export const useStyles = createStyles((theme) => ({
    cont: {
        //height: "100vh",
        marginTop: "2em",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1em",
        "@media (max-width: 800px)": {
            //flexWrap: "wrap",
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
    statCont: {
        width: "100%",
        //border: "1px solid #E8E8E8",
        display: "flex",
        //justifyContent: "center",
        alignItems: "center",
        gap: "1em",
        padding: "1em",
        /*"&:hover": {
            boxShadow: " rgba(0, 0, 0, 0.1) 0px 1px 2px 0px",
        },*/
        "@media (max-width: 800px)": {
            flexWrap: "wrap",
            paddingLeft: "5px",
            paddingRight: "5px",
            gap: "1em",
        },
    },
    infoStatSection: {
        flexGrow: "1",
        flexShrink: "1",
        //border: "1px solid #E8E8E8",
        // width: "100%",
        //padding: "1em",
        display: "flex",
        //flexWrap: "wrap",
        flexDirection: "column",
        //justifyContent: "center",
        gap: "1em",
        maxWidth: "50%",
        "@media (max-width: 800px)": {
            flexWrap: "wrap",
            paddingLeft: "0px",
            paddingRight: "0px",
            gap: "1em",
            maxWidth: "100%",
        },
    },
    numberStatSection: {
        //border: "1px solid #E8E8E8",
        flexGrow: "2",
        //width: "100%",
        //padding: "2em",

        /*display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "1em",*/
        display: "grid",
        gridTemplateColumns: "auto auto",
        gap: "1em",
        "@media (max-width: 800px)": {
            flexWrap: "wrap",
            paddingLeft: "0px",
            paddingRight: "0px",
            gap: "1em",
        },
    },
    stat: {
        backgroundColor: "white",
        border: "1px solid #decef5",
        borderRadius: "1.5em",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        //gap: ".5em",
        //marginLeft: "2em",
        //marginRight: "2em",
        textAlign: "center",
        padding: "1em",
        "&:hover": {
            boxShadow: " rgba(0, 0, 0, 0.1) 0px 1px 2px 0px",
        },
    },
    treesSection: {
        display: "flex",
        alignItems: "center",
        width: "100%",
        gap: "1em",
        //flexWrap: "wrap",
        overflowY: "auto",
    },
}));
