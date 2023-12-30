import {
    ActionIcon,
    Badge,
    Button,
    Modal,
    Pagination,
    Stack,
    TextInput,
    Title,
} from "@mantine/core";
import { useStyles } from "./MyTreesGridStyles";
import { useState } from "react";
import TreeCard from "../../cards/tree_card/TreeCard";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useQuery, useQueryClient } from "react-query";
import axios from "axios";
import { getMyTreesPageTitle } from "../../../../utils/utils";
import CardGridLoading from "../../loading_screens/card_grid_loading/CardGridLoading";
import NoDataToShow from "../../empty_data_comps/NoDataToShow";
import AddTree from "../../forms/add_tree/AddTree";
import toast, { Toaster } from "react-hot-toast";

export default function MyTreesGrid() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const { classes } = useStyles();
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const [modalOpened, setModalOpened] = useState(false);

    const queryClient = useQueryClient();

    const notifyTreeCreateSuccess = () =>
        toast.success("Tree Created Successfully");
    const notifyTreeCreateError = () => toast.error("Something went wrong");

    const treesQuery = useQuery({
        queryKey: ["get-my-trees", router.query, searchTerm, page],
        refetchOnWindowFocus: false,
        queryFn: () => {
            return axios.get(
                `/api/v2/fam-trees?filter=${
                    router.query["filter"] || "myTrees"
                }&userId=${
                    session.user.id
                }&searchTerm=${searchTerm}&page=${page}&pageSize=10`
            );
        },
        onSuccess: (res) => {
            //console.log("result2", res?.data[0]?.data);
        },
    });

    const onCreateTreeSuccess = () => {
        notifyTreeCreateSuccess();
        queryClient.invalidateQueries({
            queryKey: ["get-my-trees"],
        });
        setModalOpened(false);
    };

    const onCreateTreeError = () => {
        notifyTreeCreateError();
    };

    if (status === "loading") return <div>loading</div>;
    if (treesQuery.isError) return <div>error</div>;

    return (
        <div className={classes.cont}>
            <Stack spacing={0} justify="center" align="center">
                <Title order={1}>
                    {getMyTreesPageTitle(router.query["filter"]).title}
                </Title>
                <Title order={4} c="dimmed">
                    {getMyTreesPageTitle(router.query["filter"]).subtitle}
                </Title>
            </Stack>
            <div className={classes.searchSection}>
                <div className={classes.searchCont}>
                    <TextInput
                        value={searchTerm}
                        onChange={(event) =>
                            setSearchTerm(event.currentTarget.value)
                        }
                        className={classes.searchBar}
                        placeholder="Search tree ..."
                        radius="xl"
                        size="md"
                    />
                    <Button radius="lg" onClick={() => setModalOpened(true)}>
                        + New Tree
                    </Button>
                </div>
                <div className={classes.pillsCont}>
                    <Title order={6} c="dimmed">
                        filter:
                    </Title>

                    <Badge
                        className={classes.pill}
                        size="md"
                        radius="md"
                        variant={
                            router.query["filter"] !== "myTrees" && "outline"
                        }
                        onClick={() => {
                            router.push(
                                {
                                    //...router,
                                    query: {
                                        ...router.query,
                                        filter: "myTrees",
                                    },
                                },
                                undefined,
                                { shallow: true }
                            );
                        }}
                    >
                        My Trees
                    </Badge>

                    <Badge
                        className={classes.pill}
                        size="md"
                        radius="md"
                        variant={
                            router.query["filter"] !== "treesImIn" && "outline"
                        }
                        onClick={() => {
                            router.push(
                                {
                                    //...router,
                                    query: {
                                        ...router.query,
                                        filter: "treesImIn",
                                    },
                                },
                                undefined,
                                { shallow: true }
                            );
                        }}
                    >
                        Trees I&apos;m In
                    </Badge>
                    <Badge
                        className={classes.pill}
                        size="md"
                        radius="md"
                        variant={
                            router.query["filter"] !== "myCollabs" && "outline"
                        }
                        color={
                            router.query["filter"] === "myCollabs" && "indigo"
                        }
                        onClick={() => {
                            router.push(
                                {
                                    //...router,
                                    query: {
                                        ...router.query,
                                        filter: "myCollabs",
                                    },
                                },
                                undefined,
                                { shallow: true }
                            );
                        }}
                    >
                        My Collaborations
                    </Badge>
                </div>
            </div>

            {treesQuery.isLoading ? (
                <CardGridLoading size={5} />
            ) : (
                <Stack align="center" spacing="xl">
                    <div className={classes.cardsSection}>
                        {treesQuery.data.data[0]?.data.map((tree) => (
                            <TreeCard key={tree._id} tree={tree} />
                        ))}
                        {!treesQuery.data.data[0]?.data && (
                            <NoDataToShow message={"No Trees Found"} />
                        )}
                    </div>
                    <Pagination
                        page={page}
                        onChange={setPage}
                        total={
                            parseInt(
                                treesQuery.data?.data[0]?.metadata[0]
                                    ?.totalCount / 10
                            ) + 1
                        }
                        radius="md"
                        withEdges
                    />
                </Stack>
            )}

            <Modal
                opened={modalOpened}
                onClose={() => setModalOpened(false)}
                //padding={modalViewMode === "delete" ? 0 : "sm"}
                radius="1.5rem"
                withCloseButton={false}
                padding={0}
            >
                <AddTree
                    onCancel={() => setModalOpened(false)}
                    onSuccess={onCreateTreeSuccess}
                    onError={onCreateTreeError}
                />
            </Modal>
            <Toaster />
        </div>
    );
}
