import { DateInput } from "@mantine/dates";
import { useState } from "react";

export function DateComp() {
    const [value, setValue] = useState(null);
    return (
        <div>
            <DateInput
                label="Date input"
                placeholder="Date input"
                maw={400}
                mx="auto"
            />
        </div>
    );
}
