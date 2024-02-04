import { createStyles } from "@mantine/core";

export const useStyles = createStyles((theme) => ({
    cont: {
        padding: "10px",
        width: "100%",
        //border: "0px",
        //transition: ".2s ease-in-out",
        transition: ".2s ease-in-out",
        "&:hover": {
            //border: "1px solid gray",
            borderRadius: "10px",
            transition: ".2s ease-in-out",
            boxShadow:
                "rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px",
        },
    },
}));
