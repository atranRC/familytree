import { createStyles, keyframes } from "@mantine/core";

const randomDuration = () => {
    const valArray = [".5", ".7", "1", "1.5", "1.7", "2"];
    return valArray[Math.floor(Math.random() * 2)];
};
const fadeIn = keyframes({
    from: {
        opacity: 0,
    },
    to: {
        opacity: 100,
    },
});

export const useStyles = createStyles((theme) => ({
    cont: {
        maxWidth: "400px",
        padding: "2rem",
        animation: `${fadeIn} ${randomDuration()}s ease-in-out`,
    },
}));
