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
    },
    miniCardsCont: {
        // border: "1px solid #E8E8E8",
        // minHeight: "100vh",

        flexGrow: "1",

        maxHeight: "90vh",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: "2em",
        flexBasis: "40%",

        //flexBasis: "3em",
        //flexShrink: "0",
    },
    viewerCont: {
        //border: "1px solid #E8E8E8",
        //minHeight: "100vh",
        flexGrow: "3",
        flexBasis: "60%",
        maxHeight: "90vh",
        overflowY: "auto",
    },
}));
