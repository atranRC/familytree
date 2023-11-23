import { createStyles } from "@mantine/core";

const gradientsArray = [
    "to right, #200122, #6f0000",
    "to right, #093028, #237A57",
    "to right, #de6161, #2657eb",
    "to right, #42275a, #734b6d",
    "to right, #000428, #004e92",
    "to right, #de6161, #2657eb",
    "to right, #56a62f, #a8e063",
    "to right, #808080, #3fada8",
    "to right, #2c3e50, #fd746c",
    "to right, #00d2ff, #928dab",
    "to right, #e96443, #904e95",
];
const bgImages = [
    "https://www.britishmuseum.org/sites/default/files/styles/uncropped_medium/public/2022-09/Obelisk-at-Axum-850x601.jpg",
    "https://www.britishmuseum.org/sites/default/files/styles/uncropped_large/public/2022-09/Dabra-Dammo-A.Savin-creativecommons-1960x1406.jpg",
    "https://www.britishmuseum.org/sites/default/files/styles/uncropped_large/public/2022-09/Dungur-1280x800.jpg",
    "https://www.britishmuseum.org/sites/default/files/styles/uncropped_large/public/2022-09/Obelisk-aksum-Allamiro-creativecommons.jpg",
    "https://www.britishmuseum.org/sites/default/files/styles/uncropped_medium/public/2022-09/Ezana-stone-Sailko-creativecommons-881x1280.jpg",
    "https://www.britishmuseum.org/sites/default/files/styles/uncropped_large/public/2022-09/Ethiopian-manuscript-1168x1280.jpg",
    "https://www.britishmuseum.org/sites/default/files/styles/uncropped_large/public/2022-09/Eduard-Zander-1280x929.jpg",
];
export const useStyles = createStyles((theme, { expanded }) => ({
    /*container: {
        height: 100,
        backgroundColor: theme.colors.blue[6],

        // Media query with value from theme
        [`@media (max-width: ${theme.breakpoints.xl}px)`]: {
        backgroundColor: theme.colors.pink[6],
      },

        // Static media query
        '@media (max-width: 800px)': {
        backgroundColor: theme.colors.orange[6],
      },
    },*/

    div1: {
        position: "relative",
        display: "flex",
        alignItems: "flex-end",

        //minHeight: "100%",
        height: /*index % 2 !== 0 ? "200px" :*/ "200px",
        width: "350px",
        //maxWidth: "350px",
        zIndex: 1,
        //marginTop: index % 2 !== 0 ? "20px" : "0px",
        backgroundImage: `url(${
            bgImages[Math.floor(Math.random() * (bgImages.length - 1))]
        })`,
        backgroundPosition: "center",
        /*backgroundColor: `linear-gradient(${
            gradientsArray[
                Math.floor(Math.random() * (gradientsArray.length - 1))
            ]
        })`,*/
        //mixBlendMode: "soft-light",

        //boxShadow:
        //  "rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px",
        borderRadius: "10px",
        //border: "2px solid red",
        //overflowY: "hidden",
        "&:hover": {
            //height: "250px",
            //marginTop: "50px",
            transition: ".2s ease-in-out",
            boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px;",
            border: "1px solid teal",
        },
    },

    div2: {
        position: "absolute",
        width: "100%",
        height: expanded ? "80%" : "40%",
        zIndex: 3,
        //background: "#FAF9F6",
        //marginTop: "30px",
        transition: ".2s ease-in-out",
        /*boxShadow: !expanded
            ? "rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px"
            : "rgba(0, 0, 0, 0.45) 0px -25px 20px -15px",*/
        borderRadius: "10px",

        overflowY: "hidden",
        //border: "3px solid blue",

        /**/
        //opacity: "0.5",
    },

    whiteBg: {
        position: "absolute",
        //backgroundColor: "indigo",
        backgroundImage: `linear-gradient(${
            gradientsArray[
                Math.floor(Math.random() * (gradientsArray.length - 1))
            ]
        })`,
        opacity: "0.8",
        width: "100%",
        height: "100%",
        //border: "3px solid blue",
        transition: ".2s ease-in-out",
        width: "100%",
        height: expanded ? "80%" : "40%",
        borderRadius: "10px",
        zIndex: 2,
    },

    nameCont: {
        alignSelf: "flex-start",
        width: "100%",
        //border: "2px solid red",
    },

    name: {
        //transition: ".2s ease-in-out",
        textAlign: "center",
        marginTop: "5px",
        fontSize: "50px",
        color: "white",
        //font: "impact",
        fontFamily: "'Merriweather', serif",
        //WebkitTextStrokeWidth: "1px",
        //WebkitTextStrokeColor: "black",
    },

    title: {
        padding: "10px",
        opacity: "1",
        color: "whitesmoke",
        fontFamily: "'Merriweather', serif",
        fontSize: "20px",
    },

    contentPreview: {
        padding: "10px",
        opacity: "1",
        color: "whitesmoke",
        //border: "2px solid red",
    },
}));
