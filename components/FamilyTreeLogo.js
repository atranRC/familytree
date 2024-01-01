import { Stack, createStyles } from "@mantine/core";

const useStyles = createStyles((theme) => ({
    heading: {
        fontFamily: "'Playfair Display', serif",
        color: "white",
        fontSize: "2rem",
        //marginBottom: "-2rem",
        "@media (max-width: 800px)": {
            fontSize: "1.5rem",
            //marginBottom: "-1rem",
        },
    },

    t: {
        color: "red",
        //add hover
        "&:hover": {
            cursor: "pointer",
        },
    },

    w: {
        color: "yellow",
        fontStyle: "italic",
        //textDecoration: "underline",
        "&:hover": {
            cursor: "pointer",
        },
    },
    period: {
        color: "red",
    },
}));

export default function FamilyTreeLogo() {
    const { classes } = useStyles();
    return (
        <Stack spacing={0} align="center">
            <h1 className={classes.heading}>
                <span className={classes.t}> Family</span>
                <span className={classes.w}>Tree</span>
            </h1>
        </Stack>
    );
}
