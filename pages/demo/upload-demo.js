import { useState } from "react";
import Head from "next/head";

import UploadWidget from "../../components/upload_widget/UploadWidget";
import axios from "axios";

export default function Home() {
    const [url, updateUrl] = useState();
    const [error, updateError] = useState();

    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [showUploaded, setShowUploaded] = useState(false);

    /**
     * handleOnUpload
     */

    function handleOnUpload(error, result, widget) {
        if (error) {
            updateError(error);
            widget.close({
                quiet: true,
            });
            return;
        }

        if (result?.info?.secure_url) {
            console.log("hellow upload");
            console.log("heres the secure url", result);

            const bod = {
                ownerId: "63cba5e271eb83f0f65d7d03",
                secureUrl: result.info.secure_url,
                thumbnail: result.info.thumbnail_url,
                tags: ["tag1", "tag2"],
            };

            axios
                .post("http://localhost:3000/api/article-static-media/", bod)
                .then(
                    (response) =>
                        console.log(
                            "success"
                        ) /* this.setState({ articleId: response.data.id })*/
                )
                .catch((error) => {
                    //this.setState({ errorMessage: error.message });
                    console.error("There was an error!", error);
                });
        }
        //updateUrl(result?.info?.secure_url);
    }

    return (
        <>
            <Head>
                <title>Next.js &amp; Cloudinary Upload Widget</title>
                <meta
                    name="description"
                    content="Find more Cloudinary examples at github.com/colbyfayock/cloudinary-examples"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main>
                <div>
                    <h1>Next.js &amp; Cloudinary Upload Widget</h1>
                </div>

                <div>
                    <UploadWidget
                        onUpload={handleOnUpload}
                        folder="/profile_pictures"
                    >
                        {({ open }) => {
                            function handleOnClick(e) {
                                e.preventDefault();
                                open();
                            }
                            return (
                                <button onClick={handleOnClick}>
                                    Upload an Image
                                </button>
                            );
                        }}
                    </UploadWidget>

                    {error?.statusText && (
                        <p>
                            <strong>Error:</strong> {error.statusText}
                        </p>
                    )}

                    {url && (
                        <>
                            <p>
                                <img src={url} alt="Uploaded image" />
                            </p>
                            <p>{url}</p>
                        </>
                    )}
                </div>
                <button onClick={() => setShowUploaded(!showUploaded)}>
                    show uploaded
                </button>
                {showUploaded && <div>{JSON.stringify(uploadedFiles)}</div>}
            </main>
        </>
    );
}
