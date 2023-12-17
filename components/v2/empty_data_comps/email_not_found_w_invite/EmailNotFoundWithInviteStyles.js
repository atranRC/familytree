import { createStyles } from "@mantine/core";

export const useStyles = createStyles((theme) => ({
    cont: {
        padding: "15px",
        border: "1px solid pink",
        borderRadius: "10px",
        //backgroundColor: "#f7e6ee",
        "&:hover": {
            backgroundColor: "white",
        },
    },
    inviteLink: {
        color: "blue",
        "&:hover": {
            //backgroundColor: theme.colors.blue[9],
            cursor: "pointer",
        },
    },
}));
