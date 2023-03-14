import { getSession } from "next-auth/react";
import { useSession } from "next-auth/react";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../../api/auth/[...nextauth]";
import { useState, forwardRef } from "react";
import { citiesData, dummyUsers } from "./cities";
import * as Realm from "realm-web";
import axios from "axios";

import {
    IconUserCheck,
    IconMailOpened,
    IconShieldCheck,
    IconCircleCheck,
    IconMapPin,
    IconMoodConfuzed,
    IconExternalLink,
} from "@tabler/icons";
import {
    Stepper,
    Paper,
    createStyles,
    TextInput,
    PasswordInput,
    Checkbox,
    Button,
    Title,
    Text,
    Anchor,
    Group,
    GroupTransition,
    Select,
    Avatar,
    Container,
    SimpleGrid,
    ScrollArea,
    HoverCard,
    Stack,
    Popover,
    Modal,
    Image,
    Divider,
    Loader,
    ThemeIcon,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { Carousel } from "@mantine/carousel";
import Link from "next/link";
import { useRouter } from "next/router";
import { ClaimTargetView } from "../../../components/claim_account_components/claimTargetView";

function NoAccounts({ updateNewUserHandler }) {
    const router = useRouter();
    return (
        <Stack align="center" justify="center" style={{ paddingTop: "50px" }}>
            <ThemeIcon variant="light" radius="xl" size={80} color="gray">
                <IconMoodConfuzed size={80} />
            </ThemeIcon>

            <Title c="dimmed" fw={500} order={6} align="center" mb="sm">
                We couldn't find profiles in your name.
            </Title>
            <Button
                fullWidth
                mt="xl"
                size="md"
                variant="gradient"
                gradient={{ from: "teal", to: "blue", deg: 60 }}
                rightIcon={<IconExternalLink size={15} />}
                onClick={updateNewUserHandler}
            >
                Proceed to your profile
            </Button>
        </Stack>
    );
}

function UnclaimedAccountsList({ unclaimedAccounts, updateNewUserHandler }) {
    const [opened, setOpened] = useState(false);
    const [accountToView, setAccountToView] = useState();
    const [requestSent, setRequestSent] = useState(false);
    const useStyles = createStyles((theme) => ({
        accountCard: {
            boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
            "&:hover": {
                //border: "1px solid",
                backgroundColor: theme.colors.blue[2],
                boxShadow:
                    "rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px",
                transition: "0.5s",
            },
            borderRadius: "5px",
            cursor: "pointer",
            padding: "3px",
        },
        goToAccount: {
            marginTop: "20px",
        },
        stack: {
            backgroundColor:
                theme.colorScheme === "dark"
                    ? theme.colors.dark[8]
                    : theme.colors.gray[0],
        },
    }));
    const { classes } = useStyles();
    const accountAlbum = [
        "https://images.unsplash.com/photo-1672327114747-261be18f4907?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=449&q=80",
        "https://images.unsplash.com/photo-1671826638399-54ac6a5447ba?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
        "https://images.unsplash.com/photo-1664575602807-e002fc20892c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
        "https://plus.unsplash.com/premium_photo-1668127296901-0e01aab056f0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=435&q=80",
        "https://images.unsplash.com/photo-1672259391793-84ea24f38810?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=869&q=80",
    ];
    return (
        <>
            <ScrollArea style={{ height: 300 }}>
                {unclaimedAccounts.length > 0 ? (
                    <SimpleGrid
                        cols={3}
                        spacing="lg"
                        breakpoints={[
                            { maxWidth: 980, cols: 3, spacing: "md" },
                            { maxWidth: 755, cols: 2, spacing: "sm" },
                            { maxWidth: 600, cols: 1, spacing: "sm" },
                        ]}
                        style={{ padding: "10px" }}
                    >
                        {unclaimedAccounts.map((acc) => {
                            return (
                                <Group
                                    noWrap
                                    onClick={() => {
                                        setAccountToView(acc);
                                        setOpened(true);
                                    }}
                                    className={classes.accountCard}
                                    key={acc._id.toString()}
                                >
                                    <Avatar src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" />

                                    <div>
                                        <Text size="sm">{acc.username}</Text>
                                        <Text size="xs" opacity={0.65}>
                                            {acc.name}
                                        </Text>
                                    </div>
                                </Group>
                            );
                        })}
                        {accountToView && (
                            <Modal
                                centered
                                overflow="outside"
                                transition="slide-up"
                                opened={opened}
                                onClose={() => setOpened(false)}
                                title="Account Information"
                            >
                                <ClaimTargetView
                                    targetAccountId={accountToView._id.toString()}
                                />
                            </Modal>
                        )}
                    </SimpleGrid>
                ) : (
                    <NoAccounts updateNewUserHandler={updateNewUserHandler} />
                )}
            </ScrollArea>
            <Text fz="sm" c="dimmed" className={classes.goToAccount}>
                Can't find any match?{" "}
                <Link href={"#"} onClick={updateNewUserHandler}>
                    Go to your Account
                </Link>
            </Text>
        </>
    );
}

export function StepperUserInfo() {
    const { data: session } = useSession();
    const [active, setActive] = useState(0);
    const [name, setName] = useState({ value: "", error: false });
    const [fathersName, setFathersName] = useState({ value: "", error: false });
    const [grandFathersName, setGrandFathersName] = useState("");
    const [nicknames, setNicknames] = useState("");
    const [currentResidence, setCurrentResidence] = useState("");
    const [currentResidenceError, setCurrentResidenceError] = useState(false);
    const [birthPlace, setBirthPlace] = useState("");
    const [birthPlaceError, setBirthPlaceError] = useState("");
    const [birthday, setBirthday] = useState("");
    const [birthdayError, setBirthdayError] = useState("");
    const [unclaimedAccounts, setUnclaimedAccounts] = useState(null);
    const [updatedUser, setUpdatedUser] = useState();
    const [updatingUserInfo, setUpdatingUserInfo] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const useStyles = createStyles((theme) => ({
        title: {
            color: theme.colorScheme === "dark" ? theme.white : theme.black,
            fontFamily: `Greycliff CF, ${theme.fontFamily}`,
        },
        subtitle: {
            maxWidth: "25%",
        },
        citiesList: {
            maxHeight: "50px",
            overflow: "auto",
        },
    }));
    const { classes } = useStyles();

    const SelectItem = forwardRef(
        ({ image, label, description, ...others }, ref) => (
            <div ref={ref} {...others}>
                <Group noWrap>
                    <Avatar src={image} />

                    <div>
                        <Text size="sm">{label}</Text>
                        <Text size="xs" opacity={0.65}>
                            {description}
                        </Text>
                    </div>
                </Group>
            </div>
        )
    );

    const handleFetchUsers = async () => {
        setIsLoading(true);
        const APP_ID = "users-app-pwqpx";
        const app = new Realm.App({ id: APP_ID });
        const credentials = Realm.Credentials.anonymous();
        try {
            const user = await app.logIn(credentials);
            const allUsers = await user.functions.searchUsers(name.value);
            console.log(allUsers);
            setUnclaimedAccounts(allUsers);
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
        //setUnclaimedAccounts([]);
    };
    const router = useRouter();
    const updateNewUserHandler = async () => {
        setUpdatingUserInfo(true);
        axios
            .put("/api/users/add-new-user-info/" + session.user.email, {
                name: name.value,
                birth_place: birthPlace,
                birthday: birthday,
                owner: "self",
                current_residence: currentResidence,
                fathers_name: fathersName.value,
                last_name: grandFathersName,
                nicknames: nicknames,
            })
            .then((res) => {
                console.log(res.data.data);
                setUpdatedUser(res.data.data);
                setUpdatingUserInfo(false);
                router.push("/demo/auth-demo");
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleNextStep = () => {
        if (active === 0) {
            if (name.value === "") {
                setName({ ...name, error: true });
            }
            if (fathersName.value === "") {
                console.log(fathersName);
                setFathersName({ ...fathersName, error: true });
            }
            if (name.value !== "" && fathersName.value !== "") {
                setActive(active + 1);
            } else {
                console.log("");
            }
        } else if (active === 1) {
            if (currentResidence === "") {
                setCurrentResidenceError(true);
            }
            if (birthPlace === "") {
                setBirthPlaceError(true);
            }
            if (birthday === "") {
                setBirthdayError(true);
            }
            if (
                birthday !== "" &&
                birthPlace !== "" &&
                currentResidence !== ""
            ) {
                /*console.log(
                    name,
                    currentResidence,
                    fathersName,
                    birthday,
                    birthPlace,
                    currentResidence,
                    grandFathersName,
                    nicknames
                );*/
                setActive(active + 1);
                //setActive(active);
                handleFetchUsers();
            } else {
                console.log("");
            }
        }
    };

    return (
        <Stepper
            active={active}
            onStepClick={setActive}
            completedIcon={<IconCircleCheck />}
            breakpoint="sm"
            size="sm"
        >
            <Stepper.Step
                icon={<IconUserCheck size={18} />}
                label="Step 1"
                description="Tell us about you"
            >
                <Title
                    order={2}
                    className={classes.title}
                    align="center"
                    mt="md"
                    mb="sm"
                >
                    Welcome!
                </Title>
                <Divider
                    my="lg"
                    label="Tell us about yourself"
                    labelPosition="center"
                />

                <TextInput
                    label="Name"
                    placeholder="Your name"
                    description="addistional description"
                    inputWrapperOrder={[
                        "label",
                        "description",
                        "error",
                        "input",
                    ]}
                    value={name.value}
                    onChange={(e) =>
                        setName({ ...name, value: e.target.value })
                    }
                    onFocus={() => setName({ ...name, error: false })}
                    error={name.error && "invalid name"}
                />
                <TextInput
                    label="Father's Name"
                    placeholder="Your father's name"
                    description="additional description"
                    inputWrapperOrder={[
                        "label",
                        "description",
                        "error",
                        "input",
                    ]}
                    value={fathersName.value}
                    onChange={(e) =>
                        setFathersName({
                            ...fathersName,
                            value: e.target.value,
                        })
                    }
                    onFocus={() =>
                        setFathersName({ ...fathersName, error: false })
                    }
                    error={fathersName.error && "invalid name"}
                />
                <TextInput
                    label="Grand Father's Name"
                    placeholder="Your Grand Father's Name"
                    description="additional description"
                    inputWrapperOrder={[
                        "label",
                        "description",
                        "error",
                        "input",
                    ]}
                    value={grandFathersName}
                    onChange={(e) => setGrandFathersName(e.target.value)}
                />
                <TextInput
                    label="Nicknames"
                    placeholder="your nicknames"
                    description="additional description"
                    inputWrapperOrder={[
                        "label",
                        "description",
                        "error",
                        "input",
                    ]}
                    value={nicknames}
                    onChange={(e) => setNicknames(e.target.value)}
                />
                {/*
                <PasswordInput
                    label="Password"
                    placeholder="Your password"
                    mt="md"
                    size="md"
                />*/}
                {/*<Checkbox label="Keep me logged in" mt="xl" size="md" />*/}
                <Button onClick={handleNextStep} fullWidth mt="xl" size="md">
                    Save & Continue
                </Button>

                {/*<Text align="center" mt="md">
                    Don&apos;t have an account?{" "}
                    <Anchor
                        href="#"
                        weight={700}
                        onClick={(event) => event.preventDefault()}
                    >
                        Register
                    </Anchor>
                </Text>*/}
            </Stepper.Step>
            <Stepper.Step
                icon={<IconMapPin size={18} />}
                label="Step 2"
                description="Location & Birthday"
            >
                <Title
                    order={2}
                    className={classes.title}
                    align="center"
                    mt="md"
                    mb="sm"
                >
                    Welcome!
                </Title>
                <Divider
                    my="lg"
                    label="Tell us about yourself"
                    labelPosition="center"
                />

                <Select
                    label="Location"
                    placeholder="Pick one"
                    itemComponent={SelectItem}
                    description="City you currently live in"
                    data={citiesData}
                    searchable
                    maxDropdownHeight={300}
                    nothingFound="Nothing found"
                    filter={(value, item) =>
                        item.label
                            .toLowerCase()
                            .includes(value.toLowerCase().trim()) ||
                        item.description
                            .toLowerCase()
                            .includes(value.toLowerCase().trim())
                    }
                    value={currentResidence}
                    onChange={setCurrentResidence}
                    error={currentResidenceError && "invalid city"}
                    onFocus={() => setCurrentResidenceError(false)}
                />
                <Select
                    label="Place of birth"
                    placeholder="Pick one"
                    itemComponent={SelectItem}
                    description="City you were born in"
                    data={citiesData}
                    searchable
                    maxDropdownHeight={300}
                    nothingFound="Nothing found"
                    filter={(value, item) =>
                        item.label
                            .toLowerCase()
                            .includes(value.toLowerCase().trim()) ||
                        item.description
                            .toLowerCase()
                            .includes(value.toLowerCase().trim())
                    }
                    value={birthPlace}
                    onChange={setBirthPlace}
                    error={birthPlaceError && "invalid input"}
                    onFocus={() => setBirthPlaceError(false)}
                />
                <DatePicker
                    placeholder="Pick date"
                    label="Birthday"
                    withAsterisk
                    value={birthday}
                    onChange={setBirthday}
                    error={birthdayError && "invalid input"}
                    onFocus={() => setBirthdayError(false)}
                />
                <Button onClick={handleNextStep} fullWidth mt="xl" size="md">
                    Save & Continue
                </Button>
            </Stepper.Step>
            <Stepper.Step
                icon={<IconShieldCheck size={18} />}
                label="Step 3"
                description="Similar accounts"
            >
                <Title
                    order={2}
                    className={classes.title}
                    align="center"
                    mt="md"
                    mb="sm"
                >
                    Similar Accounts
                </Title>
                <Title c="dimmed" fw={500} order={6} align="center" mb="sm">
                    A relative of yours might have created an account in your
                    name. Send them a request to claim your account.
                </Title>
                {!isLoading ? (
                    <>
                        {updatingUserInfo ? (
                            <Text>updating...</Text>
                        ) : (
                            <UnclaimedAccountsList
                                unclaimedAccounts={unclaimedAccounts}
                                updateNewUserHandler={updateNewUserHandler}
                            />
                        )}
                    </>
                ) : (
                    <Stack
                        align="center"
                        justify="center"
                        style={{ paddingTop: "50px" }}
                    >
                        <Loader />
                        <Title
                            c="dimmed"
                            fw={500}
                            order={6}
                            align="center"
                            mb="sm"
                        >
                            Please wait while we look for profiles in your name.
                        </Title>
                    </Stack>
                )}
            </Stepper.Step>
        </Stepper>
    );
}

export function OnboardingLayout() {
    const useStyles = createStyles((theme) => ({
        wrapper: {
            minHeight: "100vh",
            maxWidth: "50%",
            backgroundSize: "cover",
            align: "left",
            backgroundImage:
                "url(https://images.unsplash.com/photo-1672327114747-261be18f4907?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1349&q=80)",
            [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
                display: "none",
            },
        },

        form: {
            borderRight: `1px solid ${
                theme.colorScheme === "dark"
                    ? theme.colors.dark[7]
                    : theme.colors.gray[3]
            }`,
            minHeight: "100vh",
            maxHeight: "100vh",
            maxWidth: "50%",
            minWidth: "50%",
            paddingTop: 80,
            overflow: "auto",

            [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
                minWidth: "100%",
            },
        },

        title: {
            color: theme.colorScheme === "dark" ? theme.white : theme.black,
            fontFamily: `Greycliff CF, ${theme.fontFamily}`,
        },

        logo: {
            color: theme.colorScheme === "dark" ? theme.white : theme.black,
            width: 120,
            display: "block",
            marginLeft: "auto",
            marginRight: "auto",
        },
    }));

    const { classes } = useStyles();
    return (
        <Group position="left" grow>
            <Container className={classes.wrapper}></Container>

            <Paper className={classes.form} radius={0} p={30}>
                <StepperUserInfo />
            </Paper>
        </Group>
    );
}

export default function NewUser() {
    const { data: session } = useSession();
    console.log(session);

    const [name, setName] = useState();
    const [nickname, setNickname] = useState();
    const [isLoading, setIsLoading] = useState();

    return (
        <>
            {/*<div>
            <h1>{session.user.name}</h1>
            <div className="form-control input-group-sm mt-5 mb-5">
                <label className="input-group ">
                    <span>name</span>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        type="text"
                        className="input input-bordered"
                    />
                </label>
                <label className="input-group ">
                    <span>nickname</span>
                    <input
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        type="text"
                        className="input input-bordered"
                    />
                </label>
            </div>
            <button onClick={uploadHandler} className="btn btn-sm">
                {isLoading ? <>...</> : <>Add User</>}
            </button>
      </div>*/}
            <OnboardingLayout />
        </>
    );
}
export async function getServerSideProps(context) {
    const session = await unstable_getServerSession(
        context.req,
        context.res,
        authOptions
    );
    console.log("referrer", context.req.headers.referer);
    /*if (context.req.headers.referer !== process.env.NEW_USER_REFERRER_PAGE) {
        return {
            redirect: {
                destination: "/demo/auth-demo",
                permanent: false,
            },
        };
    }
    if (!session) {
        return {
            redirect: {
                destination: "/",
                permanent: false,
            },
        };
    }*/
    return {
        props: {
            session,
        },
    };
}
/*export async function getServerSideProps(context) {
    const session = await getSession(context);
    return {
        props: {
            session,
            data: session ? session.user.email : "none",
        },
    };
}
*/
