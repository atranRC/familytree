import { Avatar, Button, Stack, Text, Title } from "@mantine/core";
import { useStyles } from "./UserViewerV2Styles";
import moment from "moment";
import { truncateWord } from "../../../../utils/utils";
import { useQuery } from "react-query";
import axios from "axios";
import ViewTaggedUserLoadingScreen from "../../../loading_screens/ViewTaggedUserLoadingScreen";

const USER_MOCK = {
    _id: "6437eaa66de1295a1aabfa5e",
    name: "Atran",
    email: "atranarsenal@gmail.com",
    image: "https://lh3.googleusercontent.com/a/AGNmyxbrG7am4aQq2yHLQ4DIrBMd3fpkRs0zVzJFtZlgQQ=s96-c",
    emailVerified: null,
    birth_place: {
        value: "Mek'elē, Tigray, Ethiopia",
        lon: { $numberDecimal: "39.4768259" },
        lat: { $numberDecimal: "13.4966644" },
    },
    birthday: "12/12/12",
    current_residence: {
        value: "Addis Ababa, Ethiopia",
        lon: { $numberDecimal: "38.77623804363949" },
        lat: { $numberDecimal: "8.9650995" },
    },
    fathers_name: "Gh",
    last_name: "Gm",
    nicknames: "atu",
    owner: "self",
    mothers_name: "mother",
    sex: "male",
    spouse: "spouse",
    isBlocked: false,
    isHistorian: false,
};

export default function UserViewerV22({ userId }) {
    const { classes } = useStyles();

    const userQuery = useQuery({
        queryKey: ["get_user_by_id", userId],
        refetchOnWindowFocus: false,
        queryFn: () => {
            return axios.get(`/api/users/v2/${userId}`);
        },
        onSuccess: (res) => {
            console.log("user result", res.data);
        },
        onError: (err) => {
            console.log(err);
        },
    });

    if (userQuery.isLoading || userQuery.isFetching)
        return <ViewTaggedUserLoadingScreen />;

    if (userQuery.isError) return <div>Error fetching tagged user</div>;

    return (
        <div className={classes.cont}>
            <Stack align="center" justify="center" spacing="0">
                <Avatar
                    src={userQuery.data.data?.image}
                    alt="its me"
                    radius={200}
                    className={classes.avatar}
                />

                <h1 className={classes.title}>
                    {truncateWord(
                        `${userQuery.data.data?.name} ${userQuery.data.data?.fathers_name} ${userQuery.data.data?.last_name}`,
                        30
                    )}
                </h1>
                <Text className={classes.text}>
                    {userQuery.data.data?.nicknames}
                </Text>
                <Text className={classes.text}>{userQuery.data.data?.sex}</Text>
            </Stack>
            <div className={classes.divider}></div>
            <Stack>
                <div className={classes.infoCont}>
                    <Stack spacing={0}>
                        <Title order={2} className={classes.title}>
                            {userQuery.data.data.birthday ? (
                                moment(userQuery.data.data?.birthday).format(
                                    "YYYY-MM-DD"
                                )
                            ) : (
                                <>-</>
                            )}
                        </Title>
                        <Text className={classes.text}>Born</Text>
                    </Stack>
                    <Stack spacing={0}>
                        <Title order={2} className={classes.title}>
                            {userQuery.data.data?.birth_place?.value}
                        </Title>
                        <Text className={classes.text}>Birthplace</Text>
                    </Stack>
                    {userQuery.data.data.died ? (
                        <Stack spacing={0}>
                            <Title order={2} className={classes.title}>
                                {userQuery.data.data.died ? (
                                    moment(userQuery.data.data?.died).format(
                                        "YYYY-MM-DD"
                                    )
                                ) : (
                                    <>-</>
                                )}
                            </Title>
                            <Text className={classes.text}>Date of Death</Text>
                        </Stack>
                    ) : (
                        userQuery.data.data?.current_residence?.value && (
                            <Stack spacing={0}>
                                <Title order={2} className={classes.title}>
                                    {
                                        userQuery.data.data?.current_residence
                                            ?.value
                                    }
                                </Title>
                                <Text className={classes.text}>
                                    Current Residence
                                </Text>
                            </Stack>
                        )
                    )}
                </div>
                <Button
                    variant="outline"
                    radius="1.5rem"
                    onClick={() => {
                        //open in new tab
                        window.open(
                            `/profiles/${userQuery.data.data?._id}/overview`,
                            "_blank",
                            "noopener,noreferrer"
                        );
                    }}
                >
                    Go to profile
                </Button>
            </Stack>
        </div>
    );
}
