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
        return `${profileName} moved to ${location.split("T")[0]}, in ${date}`;
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
        return `${profileName} was born on ${
            date.split("T")[0]
        }, in ${location}`;
    }

    if (eventType === "celebration") {
        return `${profileName} had a celebration ${custom.split("T")[0]}, on ${
            date.split("T")[0]
        }, in ${location}`;
    }
}

export function get_event_label(event) {
    if (event) {
        const event_label = events_list.filter((e) => e.value === event)[0][
            "label"
        ];
        console.log(event_label);
        return event_label;
    }

    return "";
}
