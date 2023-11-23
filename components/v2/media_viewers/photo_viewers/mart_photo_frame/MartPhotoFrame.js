//https://codepen.io/Kaiyuan/pen/DjBRbV

import { Box, Paper, Stack, Text } from "@mantine/core";
import styles from "./martPhotoFrame.module.css";
import { useEffect } from "react";
import { useStyles } from "./martPhotoFrameStyles";
import {
    getDefVectorSecUrl,
    getSecUrl,
} from "../../../../../utils/cloudinaryUtils";
import moment from "moment";

moment.updateLocale(moment.locale(), { invalidDate: "Unknown Date" });

export default function MartPhotoFrame({ mart, onClick }) {
    const { classes } = useStyles();

    return (
        <div className={classes.cont} onClick={onClick}>
            <ul id={styles.Frames}>
                <li className={styles.Frame}>
                    <img
                        src={
                            mart.cloudinaryParams
                                ? getSecUrl(mart.cloudinaryParams)
                                : getDefVectorSecUrl(mart?.sex)
                        }
                        alt="img"
                    />
                </li>
                <li>
                    <Box mt="lg">
                        <Stack spacing={0}>
                            <hr className={styles.separator} />
                            <div className={styles.name}>
                                {mart.firstName} {mart.lastName}
                            </div>

                            <div className={styles.years}>
                                {`${moment(mart.born).format(
                                    "YYYY"
                                )} - ${moment(mart.died).format("YYYY")}`}
                            </div>
                        </Stack>
                    </Box>
                </li>
            </ul>
        </div>
    );
}
