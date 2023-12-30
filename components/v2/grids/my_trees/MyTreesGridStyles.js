import { createStyles } from "@mantine/core";

export const useStyles = createStyles((theme) => ({
    cont: {
        paddingLeft: "5rem",
        paddingRight: "5rem",
        paddingTop: "2rem",
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
        "@media (max-width: 800px)": {
            paddingLeft: "0px",
            paddingRight: "0px",
        },
        "&:hover": {},
    },
    /*titleSection: {
        border: "1px solid",
        display: "flex",
        justifyContent: "center",
    },*/
    searchSection: {
        //border: "1px solid",
        display: "flex",
        flexDirection: "column",
        gap: ".5rem",
        paddingLeft: "5rem",
        paddingRight: "5rem",
        "@media (max-width: 800px)": {
            paddingLeft: "0px",
            paddingRight: "0px",
        },
    },
    searchCont: {
        //border: "1px solid",
        display: "flex",
        alignItems: "center",
        gap: "1rem",
    },
    searchBar: {
        //border: "1px solid",
        flexGrow: "1",
    },
    pillsCont: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexWrap: "wrap",
        gap: "1rem",
        marginLeft: "1rem",
    },
    pill: {
        "&:hover": {
            cursor: "pointer",
            scale: "1.1",
            //add transition to all
            transition: ".2s ease-in-out",
        },
    },
    cardsSection: {
        //border: "1px solid",
        display: "flex",

        //alignItems: "center",
        justifyContent: "center",
        flexWrap: "wrap",
        gap: "1rem",
    },
}));
