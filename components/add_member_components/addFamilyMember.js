import {
    Avatar,
    Button,
    Container,
    Divider,
    Group,
    Input,
    Paper,
    Radio,
    Select,
    Stack,
    TextInput,
    Text,
    Stepper,
    Loader,
    MultiSelect,
    Tabs,
    Checkbox,
    Pagination,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import {
    IconAbc,
    IconAt,
    IconCalendarEvent,
    IconLocation,
} from "@tabler/icons";
import { forwardRef, useContext, useEffect, useState } from "react";
import { FamtreePageContext } from "../../contexts/contexts";
import { citiesData } from "../../pages/demo/auth-demo/cities";
import useFamTreePageStore from "../../lib/stores/famtreePageStore";
import shallow from "zustand/shallow";
import { useQuery } from "react-query";
import axios from "axios";
import {
    AddCollabSearchResult,
    AddFamilyMemberSearchResult,
    SomethingWentWrong,
} from "../search_result_comps/searchResultComps";
import { LookingForScreen } from "../loading_screens/loadingScreens";
import {
    AddCollabProfileView,
    AddRelativeCreateProfileView,
    UserInfoCard,
} from "../user_view_cards/userInfoCard";
import { useRouter } from "next/navigation";

export function AddFamMemberInputs({ refetchWithEmail, refetchWithInfo }) {
    const {
        drawerOpened,
        setDrawerOpened,
        selectedTreeMember,
        setSelectedTreeMember,
        activeStep,
        setActiveStep,
        radioValue,
        setRadioValue,
        radioValueError,
        setRadioValueError,
        setNewRelativeChosenMethod,
        newRelativeEmail,
        setNewRelativeEmail,
        newRelativeEmailError,
        setNewRelativeEmailError,
        newRelativeFirstName,
        setNewRelativeFirstName,
        newRelativeFirstNameError,
        setNewRelativeFirstNameError,
        newRelativeFatherName,
        setNewRelativeFatherName,
        newRelativeNicknames,
        setNewRelativeNicknames,
        newRelativeCurrentResidence,
        setNewRelativeCurrentResidence,
        newRelativeBirthplace,
        setNewRelativeBirthplace,
        newRelativeBirthday,
        setNewRelativeBirthday,
        setNewRelativeSearchUri,
    } = useFamTreePageStore(
        (state) => ({
            drawerOpened: state.drawerOpened,
            setDrawerOpened: state.setDrawerOpened,
            selectedTreeMember: state.selectedTreeMember,
            setSelectedTreeMember: state.setSelectedTreeMember,
            activeStep: state.activeStep,
            setActiveStep: state.setActiveStep,
            radioValue: state.radioValue,
            setRadioValue: state.setRadioValue,
            radioValueError: state.radioValueError,
            setNewRelativeChosenMethod: state.setNewRelativeChosenMethod,
            setRadioValueError: state.setRadioValueError,
            newRelativeEmail: state.newRelativeEmail,
            setNewRelativeEmail: state.setNewRelativeEmail,
            newRelativeEmailError: state.newRelativeEmailError,
            setNewRelativeEmailError: state.setNewRelativeEmailError,
            newRelativeFirstName: state.newRelativeFirstName,
            setNewRelativeFirstName: state.setNewRelativeFirstName,
            newRelativeFirstNameError: state.newRelativeFirstNameError,
            setNewRelativeFirstNameError: state.setNewRelativeFirstNameError,
            newRelativeFatherName: state.newRelativeFatherName,
            setNewRelativeFatherName: state.setNewRelativeFatherName,
            newRelativeNicknames: state.newRelativeNicknames,
            setNewRelativeNicknames: state.setNewRelativeNicknames,
            newRelativeCurrentResidence: state.newRelativeCurrentResidence,
            setNewRelativeCurrentResidence:
                state.setNewRelativeCurrentResidence,
            newRelativeBirthplace: state.newRelativeBirthplace,
            setNewRelativeBirthplace: state.setNewRelativeBirthplace,
            newRelativeBirthday: state.newRelativeBirthday,
            setNewRelativeBirthday: state.setNewRelativeBirthday,
            setNewRelativeSearchUri: state.setNewRelativeSearchUri,
        }),
        shallow
    );

    const SelectItem = forwardRef(function search2(
        { image, label, description, ...others },
        ref
    ) {
        return (
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
        );
    });

    const handleFindByInfo = () => {
        //handle email error
        if (radioValue === "") {
            setRadioValueError(true);
        }
        if (newRelativeFirstName === "") {
            setNewRelativeFirstNameError(true);
        }
        if (newRelativeFirstName !== "" && radioValue !== "") {
            //setActiveStep(1);
            setNewRelativeChosenMethod("info");
            setActiveStep(1);
            refetchWithInfo();
        }
    };
    const handleFindByEmail = () => {
        if (radioValue === "") {
            setRadioValueError(true);
        }
        if (newRelativeEmail === "") {
            setNewRelativeEmailError(true);
        }
        if (newRelativeEmail !== "" && radioValue !== "") {
            //set isserching
            //setActiveStep(1);
            //fetch data and set search results
            //set issearching to false
            setNewRelativeChosenMethod("email");
            setActiveStep(1);
            refetchWithEmail();
        }
    };

    return (
        <Stack spacing="sm">
            <Paper withBorder p="md">
                <Radio.Group
                    value={radioValue}
                    onChange={setRadioValue}
                    name="relativeType"
                    label="Select Relation"
                    description={
                        "How is this person related to " +
                        selectedTreeMember.name +
                        "?"
                    }
                    withAsterisk
                    pos="center"
                    error={radioValueError && "invalid input"}
                    onFocus={() => setRadioValueError(false)}
                >
                    <Radio value="father" label="Father" />
                    <Radio value="mother" label="Mother" />
                    <Radio value="child" label="Child" />
                </Radio.Group>
            </Paper>
            <Paper withBorder p="md">
                <Stack spacing={1}>
                    <Text align="center" size="sm" fw={500} c="dimmed">
                        If your relative is already in our database, we&apos;ll
                        find them by their email.
                    </Text>
                    <TextInput
                        label="Email"
                        value={newRelativeEmail}
                        description="email"
                        icon={<IconAt size={19} />}
                        placeholder="email"
                        onChange={(e) => setNewRelativeEmail(e.target.value)}
                        error={newRelativeEmailError && "invalid email"}
                        onFocus={() => setNewRelativeEmailError(false)}
                    />
                    <Button
                        mt="sm"
                        variant="outline"
                        onClick={handleFindByEmail}
                    >
                        Find by Email
                    </Button>
                </Stack>
            </Paper>
            <Divider label="Or" labelPosition="center" />
            <Paper withBorder p="md">
                <Stack spacing={1}>
                    <Text align="center" size="sm" fw={500} c="dimmed">
                        Give us info on your relative and we&apos;ll look for
                        them in our database. If they&apos;re not in our
                        database, we&apos;ll create a profile for them so you
                        can add them to your family tree.
                    </Text>
                    <TextInput
                        label="Name"
                        icon={<IconAbc size={19} />}
                        value={newRelativeFirstName}
                        description="First Name"
                        placeholder="name"
                        onChange={(e) =>
                            setNewRelativeFirstName(e.target.value)
                        }
                        error={newRelativeFirstNameError && "invalid input"}
                        onFocus={() => setNewRelativeFirstNameError(false)}
                    />

                    <TextInput
                        label="Father's Name"
                        icon={<IconAbc size={19} />}
                        value={newRelativeFatherName}
                        description="Father's Name"
                        placeholder="father's name"
                        onChange={(e) =>
                            setNewRelativeFatherName(e.target.value)
                        }
                    />
                    <TextInput
                        label="Nicknames"
                        value={newRelativeNicknames}
                        icon={<IconAbc size={19} />}
                        description="If any"
                        placeholder="nicknames"
                        onChange={(e) =>
                            setNewRelativeNicknames(e.target.value)
                        }
                    />
                    <Select
                        label="Location"
                        placeholder="Pick one"
                        icon={<IconLocation size={19} />}
                        itemComponent={SelectItem}
                        description="City they currently live in"
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
                        value={newRelativeCurrentResidence}
                        onChange={setNewRelativeCurrentResidence}
                    />
                    <Select
                        label="Place of birth"
                        placeholder="Pick one"
                        icon={<IconLocation size={19} />}
                        itemComponent={SelectItem}
                        description="City they were born in"
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
                        value={newRelativeBirthplace}
                        onChange={setNewRelativeBirthplace}
                    />
                    <DatePicker
                        placeholder="Pick date"
                        label="Birthday"
                        icon={<IconCalendarEvent size={19} />}
                        value={newRelativeBirthday}
                        onChange={setNewRelativeBirthday}
                    />
                    <Button
                        mt="sm"
                        variant="outline"
                        onClick={handleFindByInfo}
                    >
                        Find Relative
                    </Button>
                </Stack>
            </Paper>
        </Stack>
    );
}

export function AddFamilyMemberSteps() {
    const {
        activeStep,
        setActiveStep,
        radioValue,
        setRadioValueError,
        newRelativeChosenMethod,
        newRelativeEmail,
        setNewRelativeEmailError,
        newRelativeFirstName,
        newRelativeFatherName,
        newRelativeNicknames,
        setNewRelativeFirstNameError,
        newRelativeUserToView,
        newRelativeUserToCreate,
        newRelativeSearchUri,
        newRelativeCurrentResidence,
        newRelativeBirthplace,
        newRelativeBirthday,
        selectedTreeMember,
    } = useFamTreePageStore((state) => ({
        activeStep: state.activeStep,
        setActiveStep: state.setActiveStep,
        radioValue: state.radioValue,
        radioValueError: state.radioValueError,
        setRadioValueError: state.setRadioValueError,
        newRelativeChosenMethod: state.newRelativeChosenMethod,
        newRelativeEmail: state.newRelativeEmail,
        setNewRelativeEmailError: state.setNewRelativeEmailError,
        newRelativeFirstName: state.newRelativeFirstName,
        newRelativeFatherName: state.newRelativeFatherName,
        newRelativeNicknames: state.newRelativeNicknames,
        setNewRelativeFirstNameError: state.setNewRelativeFirstNameError,
        newRelativeUserToView: state.newRelativeUserToView,
        newRelativeUserToCreate: state.newRelativeUserToCreate,
        newRelativeSearchUri: state.newRelativeSearchUri,
        newRelativeCurrentResidence: state.newRelativeCurrentResidence,
        newRelativeBirthplace: state.newRelativeBirthplace,
        newRelativeBirthday: state.newRelativeBirthday,
        selectedTreeMember: state.selectedTreeMember,
    }));

    const {
        isLoading: isLoadingWithEmail,
        isFetching: isFetchingWithEmail,
        data: dataWithEmail,
        refetch: refetchWithEmail,
        isError: isErrorWithEmail,
        error: errorWithEmail,
    } = useQuery(
        "similar-users-with-email",
        () => {
            let uri = "/api/users/users-mongoose/" + newRelativeEmail;

            return axios.get(uri);
        },
        { enabled: false }
    );

    const {
        isLoading: isLoadingWithInfo,
        isFetching: isFetchingWithInfo,
        data: dataWithInfo,
        refetch: refetchWithInfo,
        isError: isErrorWithInfo,
        error: errorWithInfo,
    } = useQuery(
        "similar-users-with-info",
        () => {
            let uri = "/api/users/search-headless/" + newRelativeFirstName;
            return axios.get(uri);
        },
        { enabled: false }
    );
    const get_step_two_view = () => {
        if (
            isLoadingWithEmail ||
            isLoadingWithInfo ||
            isFetchingWithEmail ||
            isFetchingWithInfo
        ) {
            return (
                <LookingForScreen
                    searchTerm={
                        newRelativeChosenMethod === "email"
                            ? newRelativeEmail
                            : newRelativeFirstName
                    }
                />
            );
        }
        if (newRelativeChosenMethod === "email") {
            if (isErrorWithEmail) {
                return <SomethingWentWrong type="error" />;
            }
            if (dataWithEmail && !dataWithEmail.data.data) {
                return <SomethingWentWrong type="empty" />;
            }
            if (dataWithEmail && dataWithEmail.data.data) {
                console.log(dataWithEmail);
                return (
                    <AddFamilyMemberSearchResult
                        userList={dataWithEmail.data.data}
                    />
                );
            }
        } else {
            if (isErrorWithInfo) {
                return <SomethingWentWrong type="error" />;
            }
            if (dataWithInfo && dataWithInfo.data.data.length === 0) {
                return <SomethingWentWrong type="empty" />;
            }
            if (dataWithInfo && dataWithInfo.data.data.length > 0) {
                console.log(dataWithInfo.data.data);
                return (
                    <AddFamilyMemberSearchResult
                        userList={dataWithInfo.data.data}
                    />
                );
            }
        }
    };
    const get_step_three_view = () => {
        if (newRelativeUserToCreate) {
            return (
                <AddRelativeCreateProfileView
                    firstName={newRelativeFirstName}
                    fathersName={newRelativeFatherName}
                    nicknames={newRelativeNicknames}
                    location={newRelativeCurrentResidence}
                    birthPlace={newRelativeBirthplace}
                    birthday={newRelativeBirthday}
                    relationTo={radioValue}
                    selectedTreeMember={selectedTreeMember}
                />
            );
        } else {
            if (newRelativeUserToView) {
                return <UserInfoCard user={newRelativeUserToView} mode="add" />;
            }
        }
    };
    return (
        <Container bg="#f7f9fc" py="md">
            <Stepper
                active={activeStep}
                breakpoint="sm"
                size="xs"
                onStepClick={setActiveStep}
            >
                <Stepper.Step label="Email/Info" description="enter email/info">
                    <AddFamMemberInputs
                        refetchWithEmail={refetchWithEmail}
                        refetchWithInfo={refetchWithInfo}
                    />
                </Stepper.Step>
                <Stepper.Step label="Search" description="search results">
                    {get_step_two_view()}
                </Stepper.Step>
                <Stepper.Step
                    label="View and Add"
                    description="Add to family tree"
                >
                    {get_step_three_view()}
                </Stepper.Step>
            </Stepper>
        </Container>
    );
}

export function ModalAddMember({ ownerId, selectedTreeMemberId, treeId }) {
    const [selectedTreeMember, setSelectedTreeMember] = useState(null);
    //const [activeStep, setActiveStep] = useState(0);
    const {
        activeStep,
        setActiveStep,
        newRelativeUserToCreate,
        newRelativeUserToView,
        newRelativeChosenMethod,
        setNewRelativeChosenMethod,
        selectedTreeMemberData,
    } = useFamTreePageStore((state) => ({
        activeStep: state.activeStep,
        setActiveStep: state.setActiveStep,
        newRelativeUserToCreate: state.newRelativeUserToCreate,
        newRelativeUserToView: state.newRelativeUserToView,
        newRelativeChosenMethod: state.newRelativeChosenMethod,
        setNewRelativeChosenMethod: state.setNewRelativeChosenMethod,
        selectedTreeMemberData: state.selectedTreeMemberData,
    }));
    const [radioValue, setRadioValue] = useState("");
    const [statusRadioValue, setStatusRadioValue] = useState("living");
    const [radioValueError, setRadioValueError] = useState(false);
    const [newRelativeEmail, setNewRelativeEmail] = useState("");
    const [newRelativeEmailError, setNewRelativeEmailError] = useState(false);
    const [newRelativeFirstName, setNewRelativeFirstName] = useState("");
    const [newRelativeFirstNameError, setNewRelativeFirstNameError] =
        useState(false);
    const [newRelativeFatherName, setNewRelativeFatherName] = useState("");
    const [newRelativeNicknames, setNewRelativeNicknames] = useState("");
    const [newRelativeCurrentResidence, setNewRelativeCurrentResidence] =
        useState("");
    const [newRelativeBirthplace, setNewRelativeBirthplace] = useState("");
    const [newRelativeBirthday, setNewRelativeBirthday] = useState("");

    const [page, setPage] = useState(1);

    const SelectItem = forwardRef(function search1(
        { image, label, description, ...others },
        ref
    ) {
        return (
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
        );
    });

    const handleFindByInfo = () => {
        //handle email error
        if (radioValue === "") {
            setRadioValueError(true);
        }
        if (newRelativeFirstName === "") {
            setNewRelativeFirstNameError(true);
        }
        if (newRelativeFirstName !== "" && radioValue !== "") {
            //setActiveStep(1);
            setNewRelativeChosenMethod("info");
            setActiveStep(1);
            refetchWithInfo();
        }
    };
    const handleFindByEmail = () => {
        if (radioValue === "") {
            setRadioValueError(true);
        }
        if (newRelativeEmail === "") {
            setNewRelativeEmailError(true);
        }
        if (newRelativeEmail !== "" && radioValue !== "") {
            //set isserching
            //setActiveStep(1);
            //fetch data and set search results
            //set issearching to false
            setNewRelativeChosenMethod("email");
            setActiveStep(1);
            refetchWithEmail();
        }
    };
    const {
        isLoading: isLoadingWithSelectedTreeMember,
        isFetching: isFetchingWithSelectedTreeMember,
        data: dataWithSelectedTreeMember,
        refetch: refetchWithSelectedTreeMember,
        isError: isErrorWithSelectedTreeMember,
        error: errorWithSelectedTreeMember,
    } = useQuery({
        queryKey: "get-selected-member",
        queryFn: () => {
            console.log("selected data", selectedTreeMemberData);
            return axios.get(
                "/api/family-tree-api/tree-members/member/" +
                    selectedTreeMemberId
            );
        },
        onSuccess: (d) => {
            console.log("fuuuuuuuuuuu", selectedTreeMemberId, d.data);
            setSelectedTreeMember(d.data.data);
        },
    });
    const {
        isLoading: isLoadingWithEmail,
        isFetching: isFetchingWithEmail,
        data: dataWithEmail,
        refetch: refetchWithEmail,
        isError: isErrorWithEmail,
        error: errorWithEmail,
    } = useQuery(
        "similar-users-with-email",
        () => {
            let uri = "/api/users/users-mongoose/" + newRelativeEmail;

            return axios.get(uri);
        },
        { enabled: false }
    );

    const {
        isLoading: isLoadingWithInfo,
        isFetching: isFetchingWithInfo,
        data: dataWithInfo,
        refetch: refetchWithInfo,
        isError: isErrorWithInfo,
        error: errorWithInfo,
    } = useQuery({
        qyeryKey: "similar-users-with-info",
        queryFn: () => {
            //let uri = "/api/users/search-headless/" + newRelativeFirstName;
            let uri = `http://localhost:3000/api/users/search/family?searchTerm=${newRelativeFirstName}&p=${page}`;
            return axios.get(uri);
        },
        enabled: false,
    });

    const {
        isLoading: isLoadingWithCreateUser,
        isFetching: isFetchingWithInfoCreateUser,
        data: dataWithInfoCreateUser,
        refetch: refetchWithInfoCreateUser,
        isError: isErrorWithInfoCreateUser,
        error: errorWithInfoCreateUser,
    } = useQuery({
        queryKey: "tree-api-create-user",
        queryFn: () => {
            let bod = {
                treeId: treeId,
                rtype: radioValue,
                tree_member_id: selectedTreeMemberId,
                selected_tree_member_id: selectedTreeMemberData.id,
                new_member: {
                    //id: newRelativeUserToView._id.toString(),
                    treeId: treeId,
                    id: "",
                    name: "",
                    parent_id: "",
                    attributes: {
                        spouse: "",
                        status: statusRadioValue,
                    },
                    canPost: false,
                },
                create_user: true,
                create_fields: {
                    name: newRelativeFirstName,
                    birth_place: newRelativeBirthplace,
                    birthday: newRelativeBirthday,
                    owner: ownerId,
                    current_residence: newRelativeCurrentResidence,
                    fathers_name: newRelativeFatherName,
                    last_name: "",
                    nicknames: newRelativeNicknames,
                },
            };
            let uri = "/api/family-tree-api/" + treeId;

            return axios.put(uri, bod);
        },
        onSuccess: (d) => {
            console.log("successful creation", d);
        },
        enabled: false,
    });

    const {
        isLoading: isLoadingAddToTree,
        isFetching: isFetchingAddToTree,
        data: dataAddToTree,
        refetch: refetchAddToTree,
        isError: isErrorAddToTree,
        error: errorAddToTree,
    } = useQuery({
        queryKey: "tree-api-add-user-to-tree",
        queryFn: () => {
            let bod = {
                treeId: treeId,
                rtype: radioValue,
                tree_member_id: selectedTreeMemberId,
                selected_tree_member_id: selectedTreeMemberData.id,
                new_member: {
                    //id: newRelativeUserToView._id.toString(),
                    treeId: treeId,
                    id: newRelativeUserToView._id.toString(),
                    name: newRelativeUserToView.name,
                    parent_id:
                        radioValue === "father"
                            ? ""
                            : selectedTreeMemberData.id,
                    attributes: {
                        spouse: "",
                        status: statusRadioValue,
                    },
                    canPost: false,
                },
                create_user: false,
                create_fields: {
                    name: "",
                    birth_place: "",
                    birthday: "",
                    owner: "",
                    current_residence: "",
                    fathers_name: "",
                    last_name: "",
                    nicknames: "",
                },
            };
            let uri = "/api/family-tree-api/" + treeId;

            return axios.put(uri, bod);
        },
        onSuccess: (d) => {
            console.log("successfuly added", d);
        },
        enabled: false,
    });

    const createProfileHandler = () => {
        refetchWithInfoCreateUser();
    };

    const addUserToTreeHandler = () => {
        refetchAddToTree();
    };

    const get_step_two_view = () => {
        if (
            isLoadingWithEmail ||
            isLoadingWithInfo ||
            isFetchingWithEmail ||
            isFetchingWithInfo
        ) {
            return (
                <LookingForScreen
                    searchTerm={
                        newRelativeChosenMethod === "email"
                            ? newRelativeEmail
                            : newRelativeFirstName
                    }
                />
            );
        }
        if (newRelativeChosenMethod === "email") {
            if (isErrorWithEmail) {
                return <SomethingWentWrong type="error" />;
            }
            if (dataWithEmail && !dataWithEmail.data.data) {
                return <SomethingWentWrong type="empty" />;
            }
            if (dataWithEmail && dataWithEmail.data.data) {
                console.log(dataWithEmail);
                return (
                    <AddFamilyMemberSearchResult
                        userList={dataWithEmail.data.data}
                    />
                );
            }
        } else {
            if (isErrorWithInfo) {
                return <SomethingWentWrong type="error" />;
            }
            if (dataWithInfo && dataWithInfo.data.data.users.length === 0) {
                return <SomethingWentWrong type="empty" />;
            }
            if (dataWithInfo && dataWithInfo.data.data.users.length > 0) {
                console.log(dataWithInfo.data.data.users);
                return (
                    <div>
                        {dataWithInfo && (
                            <Pagination
                                p="sm"
                                page={page}
                                onChange={setPage}
                                total={
                                    dataWithInfo.data.data.pagination.pageCount
                                }
                                siblings={1}
                                initialPage={1}
                                position="center"
                            />
                        )}
                        <AddFamilyMemberSearchResult
                            userList={dataWithInfo.data.data.users}
                        />
                    </div>
                );
            }
        }
    };
    const get_step_three_view = () => {
        if (newRelativeUserToCreate) {
            return (
                <AddRelativeCreateProfileView
                    firstName={newRelativeFirstName}
                    fathersName={newRelativeFatherName}
                    nicknames={newRelativeNicknames}
                    location={newRelativeCurrentResidence}
                    birthPlace={newRelativeBirthplace}
                    birthday={newRelativeBirthday}
                    relationTo={radioValue}
                    selectedTreeMember={selectedTreeMember}
                    createHandler={createProfileHandler}
                    isLoading={isLoadingWithCreateUser}
                    isFetching={isFetchingWithInfoCreateUser}
                    isError={isErrorWithInfoCreateUser}
                />
            );
        } else {
            if (newRelativeUserToView) {
                return (
                    <UserInfoCard
                        user={newRelativeUserToView}
                        mode="add"
                        handleAddToTree={addUserToTreeHandler}
                        isLoading={isLoadingAddToTree}
                        isFetching={isFetchingAddToTree}
                        isError={errorAddToTree}
                    />
                );
            }
        }
    };

    useEffect(() => {
        if (newRelativeChosenMethod === "info") {
            refetchWithInfo();
        }
    }, [page]);

    return (
        <>
            {selectedTreeMember ? (
                <Stepper
                    active={activeStep}
                    breakpoint="sm"
                    size="xs"
                    onStepClick={setActiveStep}
                >
                    <Stepper.Step
                        label="Email/Info"
                        description="enter email/info"
                    >
                        <Stack spacing="sm">
                            <Radio.Group
                                value={statusRadioValue}
                                onChange={setStatusRadioValue}
                                name="status"
                                label="Status of the person"
                            >
                                <Radio value="living" label="Living" />
                                <Radio value="deceased" label="Deceased" />
                            </Radio.Group>
                            <Paper withBorder p="md">
                                <Radio.Group
                                    value={radioValue}
                                    onChange={setRadioValue}
                                    name="relativeType"
                                    label="Select Relation"
                                    description={
                                        "How is this person related to " +
                                        selectedTreeMember.name +
                                        "?"
                                    }
                                    withAsterisk
                                    pos="center"
                                    error={radioValueError && "invalid input"}
                                    onFocus={() => setRadioValueError(false)}
                                >
                                    <Radio value="father" label="Father" />
                                    <Radio value="mother" label="Mother" />
                                    <Radio value="child" label="Child" />
                                </Radio.Group>
                            </Paper>
                            <Paper withBorder p="md">
                                <Stack spacing={1}>
                                    <Text
                                        align="center"
                                        size="sm"
                                        fw={500}
                                        c="dimmed"
                                    >
                                        If your relative is already in our
                                        database, we&apos;ll find them by their
                                        email.
                                    </Text>
                                    <TextInput
                                        label="Email"
                                        value={newRelativeEmail}
                                        description="email"
                                        icon={<IconAt size={19} />}
                                        placeholder="email"
                                        onChange={(e) =>
                                            setNewRelativeEmail(e.target.value)
                                        }
                                        error={
                                            newRelativeEmailError &&
                                            "invalid email"
                                        }
                                        onFocus={() =>
                                            setNewRelativeEmailError(false)
                                        }
                                    />
                                    <Button
                                        mt="sm"
                                        variant="outline"
                                        onClick={handleFindByEmail}
                                    >
                                        Find by Email
                                    </Button>
                                </Stack>
                            </Paper>
                            <Divider label="Or" labelPosition="center" />
                            <Paper withBorder p="md">
                                <Stack spacing={1}>
                                    <Text
                                        align="center"
                                        size="sm"
                                        fw={500}
                                        c="dimmed"
                                    >
                                        Give us info on your relative and we
                                        will look for them in our database. If
                                        they are not in our database, we will
                                        create a profile for them so you can add
                                        them to your family tree.
                                    </Text>
                                    <TextInput
                                        label="Name"
                                        icon={<IconAbc size={19} />}
                                        value={newRelativeFirstName}
                                        description="First Name"
                                        placeholder="name"
                                        onChange={(e) =>
                                            setNewRelativeFirstName(
                                                e.target.value
                                            )
                                        }
                                        error={
                                            newRelativeFirstNameError &&
                                            "invalid input"
                                        }
                                        onFocus={() =>
                                            setNewRelativeFirstNameError(false)
                                        }
                                    />

                                    <TextInput
                                        label="Father's Name"
                                        icon={<IconAbc size={19} />}
                                        value={newRelativeFatherName}
                                        description="Father's Name"
                                        placeholder="father's name"
                                        onChange={(e) =>
                                            setNewRelativeFatherName(
                                                e.target.value
                                            )
                                        }
                                    />
                                    <TextInput
                                        label="Nicknames"
                                        value={newRelativeNicknames}
                                        icon={<IconAbc size={19} />}
                                        description="If any"
                                        placeholder="nicknames"
                                        onChange={(e) =>
                                            setNewRelativeNicknames(
                                                e.target.value
                                            )
                                        }
                                    />
                                    <Select
                                        label="Location"
                                        placeholder="Pick one"
                                        icon={<IconLocation size={19} />}
                                        itemComponent={SelectItem}
                                        description="City they currently live in"
                                        data={citiesData}
                                        searchable
                                        maxDropdownHeight={300}
                                        nothingFound="Nothing found"
                                        filter={(value, item) =>
                                            item.label
                                                .toLowerCase()
                                                .includes(
                                                    value.toLowerCase().trim()
                                                ) ||
                                            item.description
                                                .toLowerCase()
                                                .includes(
                                                    value.toLowerCase().trim()
                                                )
                                        }
                                        value={newRelativeCurrentResidence}
                                        onChange={
                                            setNewRelativeCurrentResidence
                                        }
                                    />
                                    <Select
                                        label="Place of birth"
                                        placeholder="Pick one"
                                        icon={<IconLocation size={19} />}
                                        itemComponent={SelectItem}
                                        description="City they were born in"
                                        data={citiesData}
                                        searchable
                                        maxDropdownHeight={300}
                                        nothingFound="Nothing found"
                                        filter={(value, item) =>
                                            item.label
                                                .toLowerCase()
                                                .includes(
                                                    value.toLowerCase().trim()
                                                ) ||
                                            item.description
                                                .toLowerCase()
                                                .includes(
                                                    value.toLowerCase().trim()
                                                )
                                        }
                                        value={newRelativeBirthplace}
                                        onChange={setNewRelativeBirthplace}
                                    />
                                    <DatePicker
                                        placeholder="Pick date"
                                        label="Birthday"
                                        icon={<IconCalendarEvent size={19} />}
                                        value={newRelativeBirthday}
                                        onChange={setNewRelativeBirthday}
                                    />

                                    <Button
                                        mt="sm"
                                        variant="outline"
                                        onClick={handleFindByInfo}
                                    >
                                        Find Relative
                                    </Button>
                                </Stack>
                            </Paper>
                        </Stack>
                    </Stepper.Step>
                    <Stepper.Step label="Search" description="search results">
                        {get_step_two_view()}
                    </Stepper.Step>
                    <Stepper.Step
                        label="View and Add"
                        description="Add to family tree"
                    >
                        {get_step_three_view()}
                    </Stepper.Step>
                </Stepper>
            ) : (
                <Loader />
            )}
        </>
    );
}

export function ModalAddCollaborator({ treeId }) {
    //const [activeStep, setActiveStep] = useState(0);
    const router = useRouter();
    const {
        collabActiveStep,
        setCollabActiveStep,
        newCollabToView,
        newCollabChosenMethod,
        setNewCollabChosenMethod,
    } = useFamTreePageStore((state) => ({
        collabActiveStep: state.collabActiveStep,
        setCollabActiveStep: state.setCollabActiveStep,
        newCollabToView: state.newCollabToView,
        newCollabChosenMethod: state.newCollabChosenMethod,
        setNewCollabChosenMethod: state.setNewCollabChosenMethod,
    }));
    const [newRelativeEmail, setNewRelativeEmail] = useState("");
    const [newRelativeEmailError, setNewRelativeEmailError] = useState(false);
    const [newRelativeFirstName, setNewRelativeFirstName] = useState("");
    const [newRelativeFirstNameError, setNewRelativeFirstNameError] =
        useState(false);
    const [newRelativeFatherName, setNewRelativeFatherName] = useState("");
    const [newRelativeNicknames, setNewRelativeNicknames] = useState("");
    const [newRelativeCurrentResidence, setNewRelativeCurrentResidence] =
        useState("");
    const [newRelativeBirthplace, setNewRelativeBirthplace] = useState("");
    const [newRelativeBirthday, setNewRelativeBirthday] = useState("");

    const SelectItem = forwardRef(function search3(
        { image, label, description, ...others },
        ref
    ) {
        return (
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
        );
    });

    const handleFindByInfo = () => {
        //handle email error

        if (newRelativeFirstName === "") {
            setNewRelativeFirstNameError(true);
        }
        if (newRelativeFirstName !== "") {
            //setActiveStep(1);
            setNewCollabChosenMethod("info");
            setCollabActiveStep(1);
            refetchWithInfo();
        }
    };
    const handleFindByEmail = () => {
        if (newRelativeEmail === "") {
            setNewRelativeEmailError(true);
        }
        if (newRelativeEmail !== "") {
            //set isserching
            //setActiveStep(1);
            //fetch data and set search results
            //set issearching to false
            setNewCollabChosenMethod("email");
            setCollabActiveStep(1);
            refetchWithEmail();
        }
    };

    const {
        isLoading: isLoadingWithEmail,
        isFetching: isFetchingWithEmail,
        data: dataWithEmail,
        refetch: refetchWithEmail,
        isError: isErrorWithEmail,
        error: errorWithEmail,
    } = useQuery(
        "similar-users-with-email",
        () => {
            let uri = "/api/users/users-mongoose/" + newRelativeEmail;

            return axios.get(uri);
        },
        { enabled: false }
    );

    const {
        isLoading: isLoadingWithInfo,
        isFetching: isFetchingWithInfo,
        data: dataWithInfo,
        refetch: refetchWithInfo,
        isError: isErrorWithInfo,
        error: errorWithInfo,
    } = useQuery(
        "similar-users-with-info",
        () => {
            let uri = "/api/users/search-headless/" + newRelativeFirstName;
            return axios.get(uri);
        },
        { enabled: false }
    );

    const {
        isLoading: isLoadingMembers,
        isFetching: isFetchingMembers,
        data: dataMembers,
        refetch: refetchMembers,
        isError: isErrorMembers,
        error: errorMembers,
    } = useQuery({
        queryKey: "fetch-members",
        queryFn: () => {
            let uri = "/api/family-tree-api/tree-members/" + treeId;
            return axios.get(uri);
        },
        onSuccess: (d) => {
            console.log("tree is fetched", d.data.data);
        },
    });

    const {
        isLoading: isLoadingCollabs,
        isFetching: isFetchingCollabs,
        data: dataCollabs,
        refetch: refetchCollabs,
        isError: isErrorCollabs,
        error: errorCollabs,
    } = useQuery({
        queryKey: "fetch-collabs",
        queryFn: () => {
            let uri = "/api/family-tree-api/collabs/" + treeId;
            return axios.get(uri);
        },
        onSuccess: (d) => {
            let existingCollabsIdArray = [];
            d.data.data.map((collab) => {
                existingCollabsIdArray.push(collab.userId);
            });
            console.log("hiiiiiiiiii", existingCollabsIdArray);
            //add tree members to multiselect data
            let multiSelectData = [];
            dataMembers.data.data.map((mem) => {
                console.log("hiiii", mem);
                multiSelectData.push({
                    value: mem.id + "_" + mem.name,
                    label: mem.name,
                    disabled: existingCollabsIdArray.includes(mem.id),
                });
            });
            setTreeMembersMultiSelectData(multiSelectData);
            setExistingCollabs(d.data.data);

            let ar = [];
            dataMembers.data.data.map((mem) => {
                ar.push({
                    value: mem.id,
                    label: mem.name,
                    disabled: existingCollabsIdArray.includes(mem.id),
                });
            });
            setMembersToSelect(ar);
        },
        enabled: dataMembers ? true : false,
    });

    let mode = "";
    const {
        isLoading: isLoadingAddCollab,
        isFetching: isFetchingAddCollab,
        data: dataAddCollab,
        refetch: refetchAddCollab,
        isError: isErrorAddCollab,
        error: errorAddCollab,
    } = useQuery({
        queryKey: "add-collabs",
        queryFn: () => {
            console.log(mode);
            let bod = [];
            const uri = "/api/family-tree-api/collabs";
            if (mode === "tree") {
                selectedTreeMemberCollabs.map((s) => {
                    bod.push({
                        userId: s.split("_")[0],
                        treeId: treeId,
                        name: s.split("_")[1],
                        role: "",
                    });
                });
            } else {
                bod.push({
                    userId: newCollabToView._id.toString(),
                    treeId: treeId,
                    name: newCollabToView.name,
                    role: "",
                });
            }
            console.log("bodddd", bod);
            return axios.post(uri, bod);
        },
        onSuccess: (d) => {
            setButtonDisabled(true);
            console.log("newd", d);
            setSelectedTreeMemberCollabs([]);
            setButtonDisabled(false);
            router.refresh();
        },
        enabled: false,
    });

    const {
        isLoading: isLoadingDeleteCollabs,
        isFetching: isFetchingDeleteCollabs,
        data: dataDeleteCollabs,
        refetch: refetchDeleteCollabs,
        isError: isErrorDeleteCollabs,
        error: errorDeleteCollabs,
    } = useQuery({
        queryKey: "delete-collabs",
        queryFn: () => {
            let uri = "/api/family-tree-api/collabs";

            return axios.delete(uri, { data: selectedExistingCollabs });
        },
        onSuccess: () => {
            setSelectedExistingCollabs([]);
            router.refresh();
            //Router.reload(window.location.pathname);
            //Router.replace("/family-tree/tree/" + treeId);
        },
        enabled: false,
    });

    const addCollabHandler = () => {
        refetchAddCollab();
    };

    const addCollabFromTreeHandler = () => {
        mode = "tree";
        if (selectedTreeMemberCollabs.length > 0) {
            refetchAddCollab();
        } else {
            setCollabsFromTreeError(true);
        }
    };

    const deleteCollabsHandler = () => {
        refetchDeleteCollabs();
    };

    const addUserToTreeHandler = () => {
        refetchAddToTree();
    };

    const get_step_two_view = () => {
        if (
            isLoadingWithEmail ||
            isLoadingWithInfo ||
            isFetchingWithEmail ||
            isFetchingWithInfo
        ) {
            return (
                <LookingForScreen
                    searchTerm={
                        newCollabChosenMethod === "email"
                            ? newRelativeEmail
                            : newRelativeFirstName
                    }
                />
            );
        }
        if (newCollabChosenMethod === "email") {
            if (isErrorWithEmail) {
                return <SomethingWentWrong type="error" />;
            }
            if (dataWithEmail && !dataWithEmail.data.data) {
                return <SomethingWentWrong type="empty" />;
            }
            if (dataWithEmail && dataWithEmail.data.data) {
                console.log(dataWithEmail);
                return (
                    <AddCollabSearchResult userList={dataWithEmail.data.data} />
                );
            }
        } else {
            if (isErrorWithInfo) {
                return <SomethingWentWrong type="error" />;
            }
            if (dataWithInfo && dataWithInfo.data.data.length === 0) {
                return <SomethingWentWrong type="empty" />;
            }
            if (dataWithInfo && dataWithInfo.data.data.length > 0) {
                console.log(dataWithInfo.data.data);
                return (
                    <AddCollabSearchResult userList={dataWithInfo.data.data} />
                );
            }
        }
    };
    const get_step_three_view = () => {
        /*<AddCollabProfileView
                    firstName={newRelativeFirstName}
                    fathersName={newRelativeFatherName}
                    nicknames={newRelativeNicknames}
                    location={newRelativeCurrentResidence}
                    birthPlace={newRelativeBirthplace}
                    birthday={newRelativeBirthday}
                    addCollabHandler={addCollabHandler}
                    isLoading={isLoadingAddCollab}
                    isFetching={isFetchingAddCollab}
                    isError={isErrorAddCollab}
                />*/
        if (newCollabToView) {
            return (
                <AddCollabProfileView
                    firstName={newCollabToView.name}
                    fathersName={newCollabToView.fathers_name}
                    nicknames={newCollabToView.nicknames}
                    location={newCollabToView.current_residence.value}
                    birthPlace={newCollabToView.birth_place.value}
                    birthday={newCollabToView.birthday.toString().split("T")[0]}
                    addCollabHandler={addCollabHandler}
                    isLoading={isLoadingAddCollab}
                    isFetching={isFetchingAddCollab}
                    isError={isErrorAddCollab}
                />
            );
        }
    };

    const [treeMembers, setTreeMembers] = useState();
    const [membersToSelect, setMembersToSelect] = useState([]);
    const [selectedMembersId, setSelectedMembersId] = useState([]);
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [collabsFromTreeError, setCollabsFromTreeError] = useState(false);
    const [existingCollabs, setExistingCollabs] = useState([]);
    const [selectedExistingCollabs, setSelectedExistingCollabs] = useState([]);
    const [existingCollabsData, setExistingCollabsData] = useState([]);
    const [selectedTreeMemberCollabs, setSelectedTreeMemberCollabs] = useState(
        []
    );
    const [treeMembersMultiSelectData, setTreeMembersMultiSelectData] =
        useState([]);

    return (
        <>
            <Container>
                <Tabs
                    keepMounted={false}
                    defaultValue="viewCollabs"
                    color="blue"
                >
                    <Tabs.List grow>
                        <Tabs.Tab value="viewCollabs">
                            View Collaborators
                        </Tabs.Tab>
                        <Tabs.Tab value="addCollabs">
                            Add Collaborators
                        </Tabs.Tab>
                    </Tabs.List>
                    <Tabs.Panel value="viewCollabs" pt="xs">
                        <Paper withBorder p="md">
                            <Stack>
                                <Text
                                    align="center"
                                    size="sm"
                                    fw={500}
                                    c="dimmed"
                                >
                                    Manage existing collaborators below
                                </Text>
                                {existingCollabs ? (
                                    <>
                                        <Checkbox.Group
                                            value={selectedExistingCollabs}
                                            onChange={
                                                setSelectedExistingCollabs
                                            }
                                        >
                                            {existingCollabs.map((collab) => {
                                                return (
                                                    <Checkbox
                                                        key={collab._id.toString()}
                                                        value={collab._id.toString()}
                                                        label={collab.name}
                                                    />
                                                );
                                            })}
                                        </Checkbox.Group>
                                        <Button
                                            onClick={deleteCollabsHandler}
                                            disabled={
                                                selectedExistingCollabs.length ===
                                                    0 || isErrorDeleteCollabs
                                            }
                                            loading={
                                                isLoadingDeleteCollabs ||
                                                isFetchingDeleteCollabs
                                            }
                                        >
                                            Delete{" "}
                                            {selectedExistingCollabs.length}{" "}
                                            Collaborators
                                        </Button>
                                    </>
                                ) : (
                                    <Loader />
                                )}
                            </Stack>
                        </Paper>
                    </Tabs.Panel>

                    <Tabs.Panel value="addCollabs" pt="xs">
                        {membersToSelect ? (
                            <Stepper
                                active={collabActiveStep}
                                breakpoint="sm"
                                size="xs"
                                onStepClick={collabActiveStep}
                            >
                                <Stepper.Step
                                    label="Email/Info"
                                    description="enter email/info"
                                >
                                    <Stack spacing="sm">
                                        <Paper withBorder p="md">
                                            <Stack>
                                                <Text
                                                    align="center"
                                                    size="sm"
                                                    fw={500}
                                                    c="dimmed"
                                                >
                                                    Add collaborators from this
                                                    tree
                                                </Text>
                                                {membersToSelect.length > 0 && (
                                                    <MultiSelect
                                                        data={
                                                            treeMembersMultiSelectData
                                                        }
                                                        value={
                                                            selectedTreeMemberCollabs
                                                        }
                                                        onChange={
                                                            setSelectedTreeMemberCollabs
                                                        }
                                                        placeholder="select from tree members"
                                                        error={
                                                            collabsFromTreeError &&
                                                            "Please select members"
                                                        }
                                                        onFocus={() =>
                                                            setCollabsFromTreeError(
                                                                false
                                                            )
                                                        }
                                                    />
                                                )}
                                                <Button
                                                    variant="outline"
                                                    onClick={
                                                        //addCollabFromTreeHandler
                                                        addCollabFromTreeHandler
                                                    }
                                                    disabled={isErrorAddCollab}
                                                    loading={
                                                        isLoadingAddCollab ||
                                                        isFetchingAddCollab
                                                    }
                                                >
                                                    Add
                                                </Button>
                                            </Stack>
                                        </Paper>
                                        <Divider
                                            label="Or"
                                            labelPosition="center"
                                        />
                                        <Paper withBorder p="md">
                                            <Stack spacing={1}>
                                                <Text
                                                    align="center"
                                                    size="sm"
                                                    fw={500}
                                                    c="dimmed"
                                                >
                                                    Add via email
                                                </Text>
                                                <TextInput
                                                    label="Email"
                                                    value={newRelativeEmail}
                                                    description="email"
                                                    icon={<IconAt size={19} />}
                                                    placeholder="email"
                                                    onChange={(e) =>
                                                        setNewRelativeEmail(
                                                            e.target.value
                                                        )
                                                    }
                                                    error={
                                                        newRelativeEmailError &&
                                                        "invalid email"
                                                    }
                                                    onFocus={() =>
                                                        setNewRelativeEmailError(
                                                            false
                                                        )
                                                    }
                                                />
                                                <Button
                                                    mt="sm"
                                                    variant="outline"
                                                    onClick={handleFindByEmail}
                                                >
                                                    Find by Email
                                                </Button>
                                            </Stack>
                                        </Paper>
                                        <Divider
                                            label="Or"
                                            labelPosition="center"
                                        />
                                        {/*<Paper withBorder p="md">
                                            <Stack spacing={1}>
                                                <Text
                                                    align="center"
                                                    size="sm"
                                                    fw={500}
                                                    c="dimmed"
                                                >
                                                    Look for collaborators
                                                </Text>
                                                <TextInput
                                                    label="Name"
                                                    icon={<IconAbc size={19} />}
                                                    value={newRelativeFirstName}
                                                    description="First Name"
                                                    placeholder="name"
                                                    onChange={(e) =>
                                                        setNewRelativeFirstName(
                                                            e.target.value
                                                        )
                                                    }
                                                    error={
                                                        newRelativeFirstNameError &&
                                                        "invalid input"
                                                    }
                                                    onFocus={() =>
                                                        setNewRelativeFirstNameError(
                                                            false
                                                        )
                                                    }
                                                />

                                                <TextInput
                                                    label="Father's Name"
                                                    icon={<IconAbc size={19} />}
                                                    value={
                                                        newRelativeFatherName
                                                    }
                                                    description="Father's Name"
                                                    placeholder="father's name"
                                                    onChange={(e) =>
                                                        setNewRelativeFatherName(
                                                            e.target.value
                                                        )
                                                    }
                                                />

                                                <Button
                                                    mt="sm"
                                                    variant="outline"
                                                    onClick={handleFindByInfo}
                                                >
                                                    Find Relative
                                                </Button>
                                            </Stack>
                                        </Paper>*/}
                                    </Stack>
                                </Stepper.Step>
                                <Stepper.Step
                                    label="Search"
                                    description="search results"
                                >
                                    {get_step_two_view()}
                                </Stepper.Step>
                                <Stepper.Step
                                    label="View and Add"
                                    description="Add to family tree"
                                >
                                    {get_step_three_view()}
                                </Stepper.Step>
                            </Stepper>
                        ) : (
                            <Loader />
                        )}
                    </Tabs.Panel>
                </Tabs>
            </Container>
        </>
    );
}
