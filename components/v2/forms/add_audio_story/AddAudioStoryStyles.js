import { createStyles } from "@mantine/core";

export const useStyles = createStyles((theme, { isValid }) => ({
    cont: {
        width: "100%",
        padding: "1em",
        border: isValid ? "5px solid #7950F2" : "5px solid #e0e0e0",
        borderRadius: "1.5em",
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        gap: "1em",
        transition: "all 0.5s ease-in-out",
    },
}));
