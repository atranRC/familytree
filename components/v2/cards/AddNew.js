import { Title, createStyles } from "@mantine/core";
import { IconPlus } from "@tabler/icons";

export const useStyles = createStyles((theme) => ({
    addNew: {
        display: "flex",
        alignItems: "center",
        gap: "1em",
        border: "1px solid #decef5",
        borderRadius: "1em",
        padding: "1em",
        backgroundColor: "white",
        "&:hover": {
            boxShadow: " rgba(0, 0, 0, 0.1) 0px 1px 2px 0px",
            cursor: "pointer",
        },
    },
}));
export default function AddNew({ text, icon = <IconPlus />, onClick }) {
    const { classes } = useStyles();
    return (
        <div className={classes.addNew} onClick={() => onClick()}>
            {icon}
            <Title order={3} color="#7950F2">
                {text}
            </Title>
        </div>
    );
}
