import {
    Accordion,
    ActionIcon,
    Avatar,
    Button,
    Divider,
    Group,
    Image,
    Loader,
    Pagination,
    Paper,
    Radio,
    Stack,
    Text,
    TextInput,
    Title,
    createStyles,
} from "@mantine/core";
import { IconSearch } from "@tabler/icons";
import axios from "axios";
import moment from "moment";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { truncateWord } from "../../../../utils/utils";
import Link from "next/link";
import NoDataToShow from "../../empty_data_comps/NoDataToShow";
import EmailNotFoundWithInvite from "../../empty_data_comps/email_not_found_w_invite/EmailNotFoundWithInvite";

const useStyles = createStyles((theme) => ({
    accordionContentCont: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: ".5em",
        padding: "1em",
        backgroundColor: "#F8F9FA",
        borderRadius: "1.5em",
    },
    infoCont: {
        flexShrink: "1",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: "1em",
        backgroundColor: "white",
        border: "1px solid lightgrey",
        padding: "2em",
        borderRadius: "1.5em",
    },
    header: {
        fontSize: "24px",
        "@media (max-width: 800px)": {
            fontSize: "1.3em",
            textAlign: "center",
        },
    },
    title: {
        fontSize: "15px",
        "@media (max-width: 800px)": {
            fontSize: "1.1em",
            textAlign: "center",
        },
    },

    text: {
        color: "teal",
        "@media (max-width: 800px)": {
            textAlign: "center",
        },
    },
    link: {
        fontSize: "14px",
        fontStyle: "italic",
        textAlign: "right",
    },
    searchBarCont: {
        display: "flex",
        gap: "1em",
        width: "100%",
        //border: "1px solid lightgrey",
    },
    searchInput: {
        marginRight: "auto",
        width: "100%",
    },
}));

export default function TagExistingUser({ treeMember, onSuccess, onError }) {
    const { classes } = useStyles();
    const [searchTerm, setSearchTerm] = useState("");
    const [searchParam, setSearchParam] = useState("email");
    const [page, setPage] = useState(1);
    const queryClient = useQueryClient();

    const searchUserQuery = useQuery({
        queryKey: ["searchUser", treeMember._id],
        refetchOnWindowFocus: false,
        enabled: false,
        queryFn: () => {
            if (searchParam === "email") {
                return axios.get(
                    `/api/users/v2/get-by-email?email=${searchTerm}`
                );
            } else {
                return axios.get(
                    `/api/users/v2/search-all?searchTerm=${searchTerm}`
                );
            }
        },
        onSuccess: (res) => {
            console.log("users fetched", res.data);
        },
        onError: (err) => {
            console.log(err);
        },
    });

    const tagUserMutation = useMutation({
        mutationFn: (bod) => {
            return axios.put(
                `/api/family-tree-api/tree-members-b/v2/${treeMember._id.toString()}?treeId=${treeMember.treeId.toString()}`,
                bod
            );
        },
        onSuccess: (res) => {
            //console.log(res.data);
            queryClient.invalidateQueries({
                queryKey: ["get_treemember_balkanid_treeid"],
            });
            onSuccess("User Tagged Successfully");
        },
        onError: (err) => {
            onError();
            console.log(err);
            //notifyError();
        },
    });

    return (
        <Stack spacing="xl">
            <Stack align="center">
                <Title
                    order={2}
                    color={searchParam === "email" ? "cyan" : "teal"}
                    className={classes.header}
                >
                    Look For Registred Users or Unclaimed Profiles
                </Title>
                <div className={classes.searchBarCont}>
                    <TextInput
                        placeholder={`enter ${searchParam}...`}
                        radius="xl"
                        size="md"
                        onChange={(e) => setSearchTerm(e.currentTarget.value)}
                        className={classes.searchInput}
                    />
                    <ActionIcon
                        color={searchParam === "email" ? "cyan" : "teal"}
                        size="lg"
                        radius="lg"
                        p={5}
                        variant="filled"
                        disabled={searchTerm === ""}
                        onClick={() => searchUserQuery.refetch()}
                    >
                        <IconSearch size={34} />
                    </ActionIcon>
                </div>
                <Radio.Group
                    name="favoriteFramework"
                    size="sm"
                    onChange={(e) => setSearchParam(e)}
                    defaultValue="email"
                >
                    <Radio value="email" label="Search by Email" color="cyan" />
                    <Radio value="name" label="Search by Name" color="teal" />
                </Radio.Group>
            </Stack>
            {searchUserQuery?.data?.data && (
                <Divider color={searchParam === "email" ? "cyan" : "teal"} />
            )}

            {searchUserQuery.isLoading || searchUserQuery.isFetching ? (
                <Stack align="center" spacing={2}>
                    <Image
                        width={100}
                        src="/statics/home_smoke.gif"
                        alt="searching"
                    />
                    <Text size="sm" color="dimmed">
                        Searching...
                    </Text>
                </Stack>
            ) : (
                <div>
                    <Accordion defaultValue="customization">
                        {searchUserQuery?.data?.data.data.users.map((user) => {
                            return (
                                <Accordion.Item
                                    value={user._id.toString()}
                                    key={user._id}
                                >
                                    <Accordion.Control>
                                        <Group>
                                            <Avatar
                                                radius="xl"
                                                size="md"
                                                src={user?.image}
                                                alt="avatar"
                                            />
                                            <Text>
                                                {truncateWord(
                                                    `${user?.name} ${user?.fathers_name} ${user?.last_name} `,
                                                    50
                                                )}
                                                <Text span italic c="dimmed">
                                                    {truncateWord(
                                                        user?.current_residence
                                                            ?.value,
                                                        50
                                                    )}
                                                </Text>
                                            </Text>
                                        </Group>
                                    </Accordion.Control>
                                    <Accordion.Panel>
                                        <div
                                            className={
                                                classes.accordionContentCont
                                            }
                                        >
                                            <div className={classes.infoCont}>
                                                <Stack spacing={0}>
                                                    <Title
                                                        order={2}
                                                        className={
                                                            classes.title
                                                        }
                                                    >
                                                        {user.birthday ? (
                                                            moment(
                                                                user?.birthday
                                                            ).format(
                                                                "YYYY-MM-DD"
                                                            )
                                                        ) : (
                                                            <>-</>
                                                        )}
                                                    </Title>
                                                    <Text
                                                        className={classes.text}
                                                    >
                                                        Born
                                                    </Text>
                                                </Stack>
                                                <Stack spacing={0}>
                                                    <Title
                                                        order={2}
                                                        className={
                                                            classes.title
                                                        }
                                                    >
                                                        {
                                                            user?.birth_place
                                                                ?.value
                                                        }
                                                    </Title>
                                                    <Text
                                                        className={classes.text}
                                                    >
                                                        Birthplace
                                                    </Text>
                                                </Stack>
                                                {user?.current_residence
                                                    ?.value && (
                                                    <Stack spacing={0}>
                                                        <Title
                                                            order={2}
                                                            className={
                                                                classes.title
                                                            }
                                                        >
                                                            {
                                                                user
                                                                    ?.current_residence
                                                                    ?.value
                                                            }
                                                        </Title>
                                                        <Text
                                                            className={
                                                                classes.text
                                                            }
                                                        >
                                                            Current Residence
                                                        </Text>
                                                    </Stack>
                                                )}
                                                <Link
                                                    href={`/profiles/${user._id.toString()}/events`}
                                                    rel="noopener noreferrer"
                                                    target="_blank"
                                                    className={classes.link}
                                                >
                                                    Visit User&apos;s profile
                                                </Link>
                                            </div>

                                            <Button
                                                radius="xl"
                                                color="cyan"
                                                onClick={() =>
                                                    tagUserMutation.mutate({
                                                        taggedUser: user._id,
                                                    })
                                                }
                                                loading={
                                                    tagUserMutation.isLoading
                                                }
                                            >{`Tag ${user?.name}`}</Button>
                                        </div>
                                    </Accordion.Panel>
                                </Accordion.Item>
                            );
                        })}
                    </Accordion>
                </div>
            )}
            {!searchUserQuery?.data?.data &&
                (searchParam === "email" ? (
                    <Stack align="center" spacing={3}>
                        <Image
                            width={64}
                            color="dimmed"
                            src="/statics/emailgif.gif"
                            alt="email_gif"
                        />
                        <Text c="dimmed" size="sm">
                            Look for registred users using their email
                        </Text>
                    </Stack>
                ) : (
                    <Stack align="center" spacing={3}>
                        <Image
                            width={64}
                            color="dimmed"
                            src="/statics/persongif.gif"
                            alt="person_gif"
                        />
                        <Text c="dimmed" size="sm">
                            Look for profiles using their name
                        </Text>
                    </Stack>
                ))}
            {searchUserQuery?.data?.data.data.users.length === 0 &&
                !(searchUserQuery.isLoading || searchUserQuery.isFetching) &&
                (searchParam === "email" ? (
                    <EmailNotFoundWithInvite
                        treeMemberDocumentId={treeMember._id}
                        email={searchTerm}
                        treeId={treeMember.treeId}
                        invitationType="member"
                    />
                ) : (
                    <NoDataToShow message="No users found that match your search">
                        <Text size="sm" color="dimmed">
                            Try refining your search or Create an Unclaimed
                            Profile
                        </Text>
                    </NoDataToShow>
                ))}
            {searchUserQuery?.data?.data?.data && (
                <Pagination
                    page={page}
                    onChange={setPage}
                    total={
                        parseInt(
                            searchUserQuery?.data?.data?.data?.pagination
                                ?.count / 10
                        ) + 1
                    }
                    radius="md"
                    withEdges
                />
            )}
        </Stack>
    );
}
