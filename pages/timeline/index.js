import {
    ActionIcon,
    Box,
    Button,
    Divider,
    Group,
    Loader,
    LoadingOverlay,
    Modal,
    RangeSlider,
    Stack,
    TextInput,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { IconCalendarDue } from "@tabler/icons";
import axios from "axios";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { DateComp } from "../../components/dateComp";
import {
    PrimaryNavBar,
    SecondaryNavbar,
} from "../../components/timeline_page_comps/navbars/PublicTimelineNavbars";
import Tl from "../../components/timelineComp";
import { ArticleViewer } from "../../components/timeline_page_comps/article_viewer/ArticleViewer";
import { useRouter } from "next/router";

export default function TimelinePage({ asPath, query, pathname }) {
    const [timelineItems, setTimelineItems] = useState([]);
    const [minDate, setMinDate] = useState("1990-01-01");
    const [maxDate, setMaxDate] = useState("2024-01-01");
    const [dateRangeSelectorOpened, setDateRangeSelectorOpened] =
        useState(false);
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [timelineItemToFocus, setTimelineItemToFocus] = useState(null);

    const { isLoading, isFetching, data, refetch, isError, error } = useQuery({
        queryKey: "fetch-timeline-items",
        queryFn: () => {
            return axios.get(
                `/api/public-timeline?gt=${minDate}&lt=${maxDate}`
            );
        },
        enabled: false,
        onSuccess: (d) => {
            const tlItems = d.data.data.map((item) => {
                return {
                    id: item._id.toString(),
                    content: item.title,
                    start: item.date.split("T")[0],
                };
            });
            setTimelineItems(tlItems);
            console.log("timeline items ", tlItems);
            if (query.articleId) {
                setSelectedArticle(query.articleId);
            }
        },
    });

    useEffect(() => {
        //on page load
        //check if an article id is provided
        //if article id
        //pass article id to timeline comp
        //set selected article to idsd
        refetch();
        if (query.articleId) {
            console.log("the path is", asPath);
            console.log("the query is", query);
        }
    }, []);
    return (
        <div style={{ backgroundColor: "#f1f2f2" }}>
            <PrimaryNavBar />

            <Box pos="relative" style={{ backgroundColor: "#f5fffa" }}>
                <LoadingOverlay
                    visible={isLoading || isFetching}
                    overlayBlur={2}
                />
                <Tl
                    timelineItems={timelineItems}
                    selectedArticle={selectedArticle}
                    setSelectedArticle={setSelectedArticle}
                />
            </Box>

            <ActionIcon
                color="blue"
                variant="subtle"
                w="100%"
                p="sm"
                onClick={() => setDateRangeSelectorOpened(true)}
            >
                <IconCalendarDue size="1.5rem" />
            </ActionIcon>
            <SecondaryNavbar activePage="timeline" />
            {selectedArticle && <ArticleViewer articleId={selectedArticle} />}

            <Modal
                opened={dateRangeSelectorOpened}
                onClose={() => setDateRangeSelectorOpened(false)}
                title="Select Date Range"
                centered
            >
                <Stack>
                    <DatePicker
                        placeholder="Pick date"
                        label="Start Date"
                        value={minDate}
                        onChange={setMinDate}
                        withAsterisk
                    />
                    <Divider label="To" labelPosition="center" />
                    <DatePicker
                        placeholder="Pick date"
                        value={maxDate}
                        onChange={setMaxDate}
                        label="End Date"
                        withAsterisk
                    />
                    <Button
                        disabled={
                            minDate === "1990-01-01" && maxDate == "2024-01-01"
                        }
                        onClick={() => {
                            refetch();
                            setDateRangeSelectorOpened(false);
                        }}
                    >
                        Set Dates
                    </Button>
                </Stack>
            </Modal>
        </div>
    );
}

TimelinePage.getInitialProps = (ctx) => {
    const { asPath, query, pathname } = ctx;

    return { asPath, query, pathname };
};
