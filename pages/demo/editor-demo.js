import React, { useEffect, useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Autocomplete, Button } from "@mantine/core";
import axios from "axios";
import { useQuery } from "react-query";

export default function App() {
    /*const editorRef = useRef(null);
    const log = () => {
        if (editorRef.current) {
            console.log(editorRef.current.getContent());
        }
    };*/
    const [value, setValue] = useState("");
    const [fetchedCities, setFetchedCities] = useState([]);

    const { isLoading, isFetching, data, refetch, isError, error } = useQuery({
        queryKey: "fetch-stories",
        queryFn: () => {
            return axios.get(
                `https://nominatim.openstreetmap.org/search?q=${value}&format=json`
            );
        },
        enabled: false,
        onSuccess: (d) => {
            const cit = d.data.map((d) => {
                return {
                    value: d.display_name,
                    lat: d.lat,
                    lon: d.lon,
                };
            });
            setFetchedCities(cit);
        },
    });

    const handleItemSelect = (i) => {
        console.log(i);
    };

    useEffect(() => {
        if (value !== "") {
            refetch();
        }
    }, [value]);

    return (
        <>
            <Autocomplete
                value={value}
                onChange={setValue}
                data={fetchedCities}
                onItemSubmit={handleItemSelect}
            />
            {/*<Editor
                tinymceScriptSrc="/tinymce/tinymce.min.js"
                onInit={(evt, editor) => (editorRef.current = editor)}
                initialValue="<p>This is the initial content of the editor.</p>"
                init={{
                    height: "calc(100vh - 2rem)",
                    menubar: false,
                    plugins: [
                        "advlist",
                        "autolink",
                        "lists",
                        "link",
                        "image",
                        "charmap",
                        "anchor",
                        "searchreplace",
                        "visualblocks",
                        "code",
                        "fullscreen",
                        "insertdatetime",
                        "media",
                        "table",
                        "preview",
                        "help",
                        "wordcount",
                        "anchor",
                    ],
                    toolbar:
                        "undo redo | blocks | " +
                        "bold italic forecolor underline | alignleft aligncenter" +
                        "alignright alignjustify | bullist numlist outdent indent | " +
                        "removeformat | backcolor | help" +
                        " link unlink anchor",
                    content_style:
                        "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                }}
            />
            <button onClick={log}>Log editor content</button>*/}
        </>
    );
}
