import { useState } from "react";
import { ProfileIntro, TreeIntro, Welcome, WikiIntro } from "./tutorials";
import { Box, Button, Group, Stack, Stepper } from "@mantine/core";

export default function NewUserIntroductionModal({ setShowIntroModal }) {
    const [active, setActive] = useState(0);
    const nextStep = () =>
        setActive((current) => (current < 3 ? current + 1 : current));
    const prevStep = () =>
        setActive((current) => (current > 0 ? current - 1 : current));

    return (
        <Box sx={{ maxWidth: "40rem" }}>
            <Stack>
                <Stepper
                    active={active}
                    onStepClick={setActive}
                    breakpoint="sm"
                    size="xs"
                >
                    <Stepper.Step
                        label="TigrayWiki"
                        description="What is TigrayWiki"
                    >
                        <WikiIntro />
                    </Stepper.Step>
                    <Stepper.Step
                        label="Profile"
                        description="Events and Stories"
                    >
                        <ProfileIntro />
                    </Stepper.Step>
                    <Stepper.Step label="Family Tree" description="How to use">
                        <TreeIntro />
                    </Stepper.Step>
                    {/*<Stepper.Step
                        label="Importance"
                        description="How it all comes together"
                    >
                        <ImportanceIntro />
                    </Stepper.Step>*/}
                    <Stepper.Completed>
                        <Welcome />
                    </Stepper.Completed>
                </Stepper>
                <Group grow>
                    <Button color="gray" onClick={prevStep}>
                        Previous
                    </Button>

                    {active === 3 && (
                        <Button onClick={() => setShowIntroModal(false)}>
                            Start Exploring
                        </Button>
                    )}
                    {active < 3 && <Button onClick={nextStep}>Next</Button>}
                </Group>
            </Stack>
        </Box>
    );
}
