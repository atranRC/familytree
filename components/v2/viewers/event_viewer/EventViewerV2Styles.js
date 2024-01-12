import { createStyles } from "@mantine/core";

export const useStyles = createStyles((theme) => ({
    cont: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        //justifyContent: "space-evenly",
        gap: "1em",
        padding: "1em",
    },
    descCont: {
        borderRadius: "1.5em",
        display: "flex",
        flexDirection: "column",
        gap: ".5em",
        width: "100%",
        backgroundColor: "white",
        padding: "2em",
        border: "1px solid #decef5",
        "&:hover": {
            boxShadow: " rgba(0, 0, 0, 0.1) 0px 1px 2px 0px",
        },
    },
    locationCont: {
        width: "100%",
        minHeight: "150px",
        //flexGrow: "1",
        display: "flex",
        justifyContent: "center",
        gap: "1em",
        //padding: "1em",
        //border: "1px solid #E8E8E8",
    },
    map: {
        //width: "100%",
        flexBasis: "60%",
        minHeight: "100%",
        //border: "1px solid #E8E8E8",
        flexGrow: "3",
        flexShrink: "0",
        borderRadius: "1em",
    },
    locationName: {
        //flexBasis: "30%",
        height: "100%",
        //border: "1px solid #E8E8E8",
        flexGrow: "1",
        flexShrink: "1",
        overflowX: "auto",
    },
    photosCont: {
        width: "100%",
    },
}));
