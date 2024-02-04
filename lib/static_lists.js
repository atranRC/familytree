export const events_list = [
    {
        value: "birth",
        label: "Birth",
    },
    {
        value: "adoption",
        label: "Adoption",
    },
    {
        value: "baptism",
        label: "Baptism",
    },
    {
        value: "death",
        label: "Death",
    },
    {
        value: "burial",
        label: "Burial",
    },
    {
        value: "marriage",
        label: "Marriage",
    },
    {
        value: "divorce",
        label: "Divorce",
    },
    {
        value: "address_change",
        label: "Address Change",
    },
    {
        value: "graduation",
        label: "Graduation",
    },
    {
        value: "employment",
        label: "Employment",
    },
    {
        value: "promotion",
        label: "Promotion",
    },
    {
        value: "citizenship",
        label: "Citizenship",
    },
    {
        value: "celebration",
        label: "Celebration",
    },
];

export function get_auto_title(
    eventType,
    profileName,
    location,
    date,
    custom = ""
) {
    if (eventType === "birth") {
        return `${profileName} was born on ${date}, in ${location}`;
    }

    if (eventType === "adoption") {
        return `${profileName} was adopted on ${
            date.split("T")[0]
        }, in ${location}`;
    }

    if (eventType === "baptism") {
        return `${profileName} was baptised on ${
            date.split("T")[0]
        }, in ${location}`;
    }

    if (eventType === "death") {
        return `${profileName} passed away on ${
            date.split("T")[0]
        }, in ${location}`;
    }

    if (eventType === "burial") {
        return `${profileName} was burried on ${
            date.split("T")[0]
        }, in ${location}`;
    }

    if (eventType === "marriage") {
        return `${profileName} was married on ${
            date.split("T")[0]
        }, in ${location}`;
    }

    if (eventType === "divorce") {
        return `${profileName} was divorced on ${
            date.split("T")[0]
        }, in ${location}`;
    }

    if (eventType === "address_change") {
        return `${profileName} moved to ${location?.value}, in ${date}`;
    }

    if (eventType === "graduation") {
        return `${profileName} graduated on ${
            date.split("T")[0]
        }, in ${location}`;
    }

    if (eventType === "employment") {
        return `${profileName} started work on ${
            date.split("T")[0]
        }, in ${location}`;
    }

    if (eventType === "promotion") {
        return `${profileName} received a promotion on ${
            date.toString().split("T")[0]
        }, in ${location}`;
    }

    if (eventType === "citizenship") {
        return `${profileName} received citizenship on ${
            date.split("T")[0]
        }, in ${location}`;
    }

    if (eventType === "celebration") {
        return `${profileName} had a celebration ${custom.split("T")[0]}, on ${
            date.split("T")[0]
        }, in ${location}`;
    }
}

export function get_event_theme_img(eventType) {
    if (eventType === "birth") {
        return `https://img.freepik.com/free-vector/baby-shower-party-background-with-sip-see-symbols-flat-vector-illustration_1284-71417.jpg?w=826&t=st=1683211898~exp=1683212498~hmac=9e10e5d55db2ad1f8cc81fe6d9f0556f8280ba91c52006fb7947c8e8689f68f2`;
    }

    if (eventType === "adoption") {
        return `https://img.freepik.com/free-vector/african-family-concept-illustration_114360-12096.jpg?w=740&t=st=1683212159~exp=1683212759~hmac=9964dfd2db4acddbaa8a502dd2007781f2f479009977b9064a33a08bf1f13171`;
    }

    if (eventType === "baptism") {
        return `https://img.freepik.com/free-vector/baptism-concept-illustration_114360-9518.jpg?w=740&t=st=1683212196~exp=1683212796~hmac=e6f92ff36db63c29bbcab363d306d87a964daf6536a45d2feda37083dd0d29af`;
    }

    if (eventType === "death" || eventType === "burial") {
        return `https://img.freepik.com/free-vector/light-blue-sky-with-white-clouds-realistic-background-natural-banner-with-heavens_33099-624.jpg?w=740&t=st=1683212255~exp=1683212855~hmac=cefe273fab9515aa1c42c7c915f319771cdc5e7c375a3be2c3215e68c6878d3e`;
    }

    if (eventType === "marriage") {
        return `https://img.freepik.com/free-vector/engagement-rings_23-2147501670.jpg?size=626&ext=jpg`;
    }

    if (eventType === "divorce") {
        return `https://img.freepik.com/free-vector/realistic-pair-golden-wedding-rings_52683-13737.jpg?size=626&ext=jpg`;
    }

    if (eventType === "address_change") {
        return `https://img.freepik.com/free-vector/creation-process-concept-illustration_114360-655.jpg?size=626&ext=jpg`;
    }

    if (eventType === "graduation") {
        return `https://img.freepik.com/free-vector/girl-graduation-concept-illustration_114360-11130.jpg?size=626&ext=jpg`;
    }

    if (eventType === "employment") {
        return `https://img.freepik.com/free-vector/new-team-members-concept-illustration_114360-7501.jpg?size=626&ext=jpg`;
    }

    if (eventType === "promotion") {
        return `https://img.freepik.com/free-vector/spotlight-businessman-standing-out-crowd-people_74855-19898.jpg?size=626&ext=jpg`;
    }

    if (eventType === "citizenship") {
        return `https://img.freepik.com/free-vector/nationality-abstract-concept-vector-illustration-country-birth-passport-national-customs-traditions-legal-status-birth-certificate-human-rights-discrimination-abstract-metaphor_335657-1937.jpg?size=626&ext=jpg`;
    }

    if (eventType === "celebration") {
        return `https://img.freepik.com/free-vector/festivities-concept-illustration_114360-3825.jpg?size=626&ext=jpg`;
    }

    if (eventType === "story") {
        const imagesArray = [
            `https://img.freepik.com/free-vector/hand-drawn-illustrated-family-scene_23-2149108052.jpg?size=626&ext=jpg`,
            `https://img.freepik.com/free-vector/family-enjoying-time-together_23-2148523550.jpg?size=626&ext=jpg`,
            `https://img.freepik.com/free-vector/hand-drawn-flat-design-stack-books-illustration_23-2149341898.jpg?size=626&ext=jpg`,
            `https://img.freepik.com/free-vector/grandparents-with-woman-man-with-kids-sofa_24640-45093.jpg?size=626&ext=jpg`,
            `https://img.freepik.com/free-vector/grandparents-with-woman-man-with-kids-sofa_24640-45093.jpg?size=626&ext=jpg`,
        ];

        return imagesArray[Math.floor(Math.random() * 5)];
    }

    return `https://img.freepik.com/free-vector/flat-hand-drawn-illustration-black-family-with-baby_23-2148831281.jpg?size=626&ext=jpg`;
}

export function get_event_label(event) {
    if (event) {
        const event_label = events_list.filter((e) => e.value === event)[0][
            "label"
        ];
        //console.log(event_label);
        return event_label;
    }

    return "";
}
