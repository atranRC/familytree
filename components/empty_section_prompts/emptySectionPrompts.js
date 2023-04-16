import {
    Container,
    Stack,
    ThemeIcon,
    Image,
    Title,
    Text,
    Paper,
    Divider,
} from "@mantine/core";
import { useContext } from "react";
import { FamtreePageContext } from "../../contexts/contexts";
import useFamTreePageStore from "../../lib/stores/famtreePageStore";

export function TreeIsEmptyPrompt() {
    const ownerData = useContext(FamtreePageContext);
    const setSelectedTreeMember = useFamTreePageStore(
        (state) => state.setSelectedTreeMember
    );
    return (
        <Container>
            <Paper withBorder px="xl" mih="100vh">
                <Stack spacing={0} align="center" justify="center">
                    <ThemeIcon color="dimmed" radius="xl" size={300}>
                        <Image
                            p={10}
                            src="https://img.freepik.com/free-vector/tree-with-branches-roots-falling-leaves-white-background-illustration_1284-27223.jpg"
                            alt="img"
                        />
                    </ThemeIcon>
                    <Title c="skyblue" fw={500} order={3} align="center">
                        You don&apos;t have a family tree yet.
                    </Title>
                    <Title c="dimmed" fw={500} order={5} align="center" mb="sm">
                        Start by adding your{" "}
                        <Text
                            span
                            c="blue"
                            inherit
                            td="underline"
                            style={{ cursor: "pointer" }}
                            onClick={() => setSelectedTreeMember(ownerData)}
                        >
                            Father
                        </Text>
                    </Title>
                </Stack>
            </Paper>
        </Container>
    );
}

export function SelectTreeMemberToViewOrAddPrompt() {
    return (
        <Container>
            <Paper withBorder px="xl" mih="100vh">
                <Stack spacing={0} align="center" justify="center">
                    <ThemeIcon color="dimmed" radius="xl" size={300}>
                        <Image
                            p={10}
                            src="https://img.freepik.com/free-vector/international-migration-abstract-concept-vector-illustration-international-migrants-border-control-movement-people-leaving-country-application-form-travel-with-bag-abstract-metaphor_335657-3972.jpg"
                            alt="img2"
                        />
                    </ThemeIcon>
                    <Title c="skyblue" fw={500} order={4} align="center">
                        Select a famly member from your family tree.
                    </Title>
                    <Title c="dimmed" fw={500} order={5} align="center" mb="sm">
                        You can view information about family tree members here.
                    </Title>
                </Stack>
            </Paper>
        </Container>
    );
}

export function AddTreeMemberHerePrompt() {
    return (
        <Container>
            <Stack spacing={0} align="center" justify="center">
                <ThemeIcon color="dimmed" radius="xl" size={300}>
                    <Image
                        p={10}
                        src="https://img.freepik.com/free-vector/international-migration-abstract-concept-vector-illustration-international-migrants-border-control-movement-people-leaving-country-application-form-travel-with-bag-abstract-metaphor_335657-3972.jpg"
                        alt="img3"
                    />
                </ThemeIcon>
                <Title c="skyblue" fw={500} order={3} align="center">
                    You can add family members here.
                </Title>
                <Title c="dimmed" fw={500} order={5} align="center" mb="sm">
                    Select a family member on the family tree to add a new
                    relative.
                </Title>
            </Stack>
        </Container>
    );
}

export function NewRelativeNoResultsFound() {
    const { newRelativeChosenMethod } = useContext(FamtreePageContext);
    return (
        <Paper>
            <Stack spacing={0} align="center" justify="center">
                <ThemeIcon color="dimmed" radius="xl" size={300}>
                    <Image
                        p={10}
                        src="https://img.freepik.com/free-vector/flat-man-with-symptoms-depression-disorder-overhead_88138-784.jpg"
                        alt="img5"
                    />
                </ThemeIcon>
                <Title c="lightred" fw={500} order={3} align="center">
                    We couldn&apos;t find the person you were looking for.
                </Title>
                <Text c="dimmed" fw={500} order={5} align="center" mb="sm">
                    <Text span>Try again</Text> with a different email or info.
                </Text>
                <Divider label="Or" labelPosition="center" />
            </Stack>
        </Paper>
    );
}
