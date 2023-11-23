import { Box, Divider, Stack, Title, Text } from "@mantine/core";
import { IconAnchor, IconPlant2 } from "@tabler/icons";
import axios from "axios";
import { useQuery } from "react-query";

export default function WrittenStoryViwerV2({ storyId }) {
    const storyQuery = useQuery({
        queryKey: ["story", storyId],
        queryFn: async () => {
            return axios.get(`/api/written-stories/${storyId}`);
        },
        //keepPreviousData: true,
    });
    if (storyQuery.isLoading) return <div>loading...</div>;
    return (
        <Box>
            <Stack>
                <Title align="center" color="darkgreen">
                    {storyQuery.data.data.data.title}
                </Title>
                <Divider
                    label={<IconPlant2 color="green" />}
                    labelPosition="center"
                />
                <Text>{storyQuery.data.data.data.content}</Text>
                <Divider
                    label={<IconAnchor color="green" />}
                    labelPosition="center"
                />
            </Stack>
        </Box>
    );
}
