import { Badge, Divider, Title } from "@mantine/core";
import { useStyles } from "./TreeCardStyles";
import { truncateWord } from "../../../../utils/utils";
import moment from "moment";

const dummy =
    "lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam";

export default function TreeCard({ tree }) {
    const { classes } = useStyles();
    return (
        <div
            className={classes.cont}
            onClick={() => {
                window
                    .open(
                        `/family-tree/tree/v2/${tree._id.toString()}`,
                        "_blank"
                    )
                    .focus();
            }}
        >
            <div className={classes.imgSection}></div>
            <div className={classes.contentSection}>
                <div className={classes.titleSection}>
                    <Title order={3}>{tree.tree_name}</Title>
                </div>
                <div className={classes.descSection}>
                    {truncateWord(tree?.description, 50)}
                </div>
                <Divider />
                <div className={classes.cardFooter}>
                    {tree.createdAt ? (
                        moment(tree.createdAt).format("YYYY-MM-DD")
                    ) : (
                        <>Date Unavailable</>
                    )}
                    <Badge color={tree?.privacy === "public" && "green"}>
                        {tree?.privacy}
                    </Badge>
                </div>
            </div>
        </div>
    );
}
