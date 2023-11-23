import MartsGrid from "../../components/v2/grids/marts_grid/MartsGrid";
import MartPhotoFrame from "../../components/v2/media_viewers/photo_viewers/mart_photo_frame/MartPhotoFrame";

export default function PhotoFramePage() {
    const url1 =
        "https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
    const url2 =
        "https://plus.unsplash.com/premium_photo-1680740103993-21639956f3f0?q=80&w=1288&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
    const imgarray = [url1, url2, url1, url2, url1];
    {
        /*<div
            style={{
                display: "flex",
                alignItems: "center",
                alignContent: "center",
                justifyContent: "center",
                flexWrap: "wrap",
                backgroundColor: " #cdc1ff",
                backgroundImage:
                    "linear-gradient(316deg, #cdc1ff 0%, #e5d9f2 74%)",
            }}
        >
            {Array.from({ length: 5 }).map((_, i) => (
                <MartPhotoFrame url={imgarray[i]} />
            ))}
            </div>*/
    }
    return <MartsGrid />;
}
