import { Paper, Stack, Text, Title } from "@mantine/core";
import { truncateWord } from "../../../../utils/utils";
import moment from "moment";

const BG_IMGS = [
    "bigfam3.jpg",
    "bigfambg.jpg",
    "bigfambg2.jpg",
    "bigfambg5.jpg",
    "bigfambg4.jpg",
    "bigfambg3.jpg",
];

export default function MutualTreeCard({ tree }) {
    return (
        <Paper
            p="md"
            radius="1.5em"
            withBorder
            shadow="sm"
            sx={{
                minWidth: "300px",
                ":hover": {
                    cursor: "pointer",
                    backgroundColor: "#f9f9f9f9",
                    transition: "all 0.2s ease-in-out",
                },
            }}
            onClick={() => {
                //window.open blank noopener noreferrer
                window.open(
                    `/family-tree/tree/v3/${tree?.treeId}`,
                    "_blank",
                    "noopener,noreferrer"
                );
            }}
        >
            <Stack spacing={5}>
                <div
                    style={{
                        width: "100%",
                        height: "150px",
                        backgroundImage: `url('/statics/${
                            BG_IMGS[Math.floor(Math.random() * BG_IMGS.length)]
                        }')`,
                    }}
                ></div>
                <Title order={2} sx={{ fontFamily: "Lora, serif" }}>
                    {truncateWord(tree.treeName, 20)}
                </Title>
                <Text color="dimmed" size="sm">
                    {tree?.createdAt ? (
                        `you joined ${moment(tree?.createdAt).format(
                            "YYYY-MM-DD"
                        )}`
                    ) : (
                        <>-</>
                    )}
                </Text>
            </Stack>
        </Paper>
    );
}
