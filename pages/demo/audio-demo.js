import axios from "axios";
import { useState } from "react";
import { AudioRecorder, useAudioRecorder } from "react-audio-voice-recorder";

export default function Audio() {
    const recorderControls = useAudioRecorder();
    const [audioBlob, setAudioBlob] = useState();

    const addAudioElement = (blob) => {
        const url = URL.createObjectURL(blob);
        const audio = document.createElement("audio");
        audio.src = url;
        audio.controls = true;
        console.log(url);
        setAudioBlob(url);
        document.body.appendChild(audio);
    };

    const blobToBase64 = (url) => {
        return new Promise(async (resolve, _) => {
            // do a request to the blob uri
            const response = await fetch(url);

            // response has a method called .blob() to get the blob file
            const blob = await response.blob();

            // instantiate a file reader
            const fileReader = new FileReader();

            // read the file
            fileReader.readAsDataURL(blob);

            fileReader.onloadend = function () {
                resolve(fileReader.result); // Here is the base64 string
            };
        });
    };

    const handleUpload = async () => {
        /*const url = "https://api.cloudinary.com/v1_1/dcgnu3a5s/upload";

        let formData = new FormData(); //formdata object

        const file = await blobToBase64(audioBlob);

        formData.append("file", file);

        const config = {
            headers: { "content-type": "multipart/form-data" },
        };
        //console.log(formData);
        /*fetch("https://api.cloudinary.com/v1_1/dcgnu3a5s/upload", {
            method: "POST",
            body: formData,
        });*/
        /* axios
            .post(
                `https://api.cloudinary.com/v1_1/dcgnu3a5s/upload`,
                formData,
                {
                    onUploadProgress: (ProgressEvent) => {
                        //track your progress here
                        console.log(
                            (ProgressEvent.loaded / ProgressEvent.total) * 100
                        );
                    },
                }
            )
            .then((res) => {
                console.log(res.data.secure_url);
                return res.data.secure_url;
            })
            .catch(console.log);*/
        const file = await blobToBase64(audioBlob);
        console.log(file);
        axios
            .post("/api/audio-stories", { data: file })
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                console.log(error);
            });
        /*axios
            .post(url, formData)
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                console.log(error);
            });*/

        console.log(file);
        /*const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", ""); // Replace the preset name with your own
        formData.append("api_key", "828776313289396"); // Replace API key with your own Cloudinary key
        formData.append("api_secret", "LfIxd_mVMk7-GbnPB5f-HAY87iI");
        formData.append("timestamp", (Date.now() / 1000) | 0);

        // Make an AJAX upload request using Axios (replace Cloudinary URL below with your own)
        axios
            .post(
                "https://api.cloudinary.com/v1_1/dcgnu3a5s/video/upload",
                formData,
                {
                    headers: { "X-Requested-With": "XMLHttpRequest" },
                },
                {
                    withCredentials: false,
                }
            )
            .then((response) => {
                const data = response.data;
                const fileURL = data.secure_url; // You should store this URL for future references in your app
                console.log(data);
            });
    };
*/
    };
    return (
        <div>
            <AudioRecorder
                onRecordingComplete={(blob) => addAudioElement(blob)}
                recorderControls={recorderControls}
            />
            <br />
            <button onClick={recorderControls.stopRecording}>
                Stop recording
            </button>
            {audioBlob && <button onClick={handleUpload}>upload</button>}
            <br />
        </div>
    );
}
