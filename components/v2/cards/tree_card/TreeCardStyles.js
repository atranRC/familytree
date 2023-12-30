import { createStyles } from "@mantine/core";

const BG_COLORS = ["teal", "darkgreen", "#008083", "#18121C", "#3B7BB9"];
const BG_IMGS = [
    "bigfam3.jpg",
    "bigfambg.jpg",
    "bigfambg2.jpg",
    "bigfambg5.jpg",
    "bigfambg4.jpg",
    "bigfambg3.jpg",
];
//select random element form above array
//const randomColor = () => BG_COLORS[Math.floor(Math.random() * BG_COLORS.length)];

export const useStyles = createStyles((theme) => ({
    cont: {
        width: "300px",
        borderRadius: "10px",
        padding: "5px",
        transition: ".2s ease-in-out",
        "&:hover": {
            cursor: "pointer",
            //boxShadow: "rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px",
            transition: ".2s ease-in-out",
        },
        display: "flex",
        flexDirection: "column",
        color: "white",
    },
    imgSection: {
        width: "100%",
        height: "150px",
        backgroundImage: `url('/statics/${
            BG_IMGS[Math.floor(Math.random() * BG_IMGS.length)]
        }')`,
    },
    contentSection: {
        width: "100%",
        padding: "1rem",
        borderBottomLeftRadius: "10px",
        borderBottomRightRadius: "10px",
        transition: ".2s ease-in-out",
        backgroundColor:
            BG_COLORS[Math.floor(Math.random() * BG_COLORS.length)],
        "&:hover": {
            //boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px;",
            //boxShadow:
            // "rgba(255, 255, 255, 0.1) 0px 1px 1px 0px inset, rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px",
            transition: ".2s  ease-in-out",
            boxShadow:
                "rgba(255, 255, 255, 0.1) 0px 1px 1px 0px inset, rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px",
        },
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
    },

    titleSection: {},

    cardFooter: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
}));
