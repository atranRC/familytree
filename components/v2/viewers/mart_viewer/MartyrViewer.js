import { Image, Paper, Stack, Table, Text } from "@mantine/core";
import {
    getDefVectorSecUrl,
    getSecUrl,
} from "../../../../utils/cloudinaryUtils";
import moment from "moment";
import Link from "next/link";
import styles from "./martyrViewer.module.css";

export default function MartyrViewer({ mart }) {
    return (
        <Stack>
            <Image
                src={
                    mart.cloudinaryParams
                        ? getSecUrl(mart.cloudinaryParams)
                        : getDefVectorSecUrl(mart?.sex)
                }
                height={500}
                //fit="contain"
                alt="img"
            />
            <div
                className={styles.name}
            >{`${mart?.firstName} ${mart?.middleName} ${mart?.lastName}`}</div>
            <Table className={styles.tableStyle}>
                <thead></thead>
                <tbody>
                    <tr>
                        <td>Sex</td>
                        <td>{mart?.sex}</td>
                    </tr>
                    <tr>
                        <td>Born</td>
                        <td>{moment(mart?.born).format("YYYY-MM-DD")}</td>
                    </tr>
                    <tr>
                        <td>Died</td>
                        <td>{moment(mart?.died).format("YYYY-MM-DD")}</td>
                    </tr>
                    <tr>
                        <td>Place of Birth</td>
                        <td>{mart?.birthplace?.value}</td>
                    </tr>
                    <tr>
                        <td>Place of Death</td>
                        <td>{mart?.deathplace?.value}</td>
                    </tr>
                    <tr>
                        <td>Short Bio</td>
                        <td>{mart?.shortBio}</td>
                    </tr>
                    {mart.wikiLink && (
                        <tr>
                            <td>Wiki</td>
                            <td>
                                <Link
                                    href={mart?.wikiLink}
                                    rel="noopener noreferrer"
                                    target="_blank"
                                >
                                    {" "}
                                    Open Link{" "}
                                </Link>
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </Stack>
    );
}
