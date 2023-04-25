/*import dynamic from "next/dynamic";
import { useRouter } from "next/router";

const BalkanTree = dynamic(
    () => import("../../../components/tree-page/balkan_tree/BalkanTree"),
    {
        ssr: false,
    }
);

export default function BalkanCompTestPage() {
    const { asPath, pathname } = useRouter();

    return (
        <div>
            <div id="tree"></div>
            <BalkanTree treeIdProp={asPath.split("/").at(-1)} />
            <div>{asPath.split("/").at(-1)}</div>
        </div>
    );
}*/

/*import FamilyTree from "../../../lib/familytree.js";

function Familytree(props) {
    if (typeof window === "object") {
        var chart = new FamilyTree(document.getElementById("tree"), {
            nodeBinding: props.nodeBinding,
            nodes: props.nodes,
        });
    }
    return null;
}

var data = [
    {
        id: 1,
        pids: [2],
        name: "Amber McKenzie",
        gender: "female",
        img: "https://cdn.balkan.app/shared/2.jpg",
    },
    {
        id: 2,
        pids: [1],
        name: "Ava Field",
        gender: "male",
        img: "https://cdn.balkan.app/shared/m30/5.jpg",
    },
    {
        id: 3,
        mid: 1,
        fid: 2,
        name: "Peter Stevens",
        gender: "male",
        img: "https://cdn.balkan.app/shared/m10/2.jpg",
    },
    {
        id: 4,
        mid: 1,
        fid: 2,
        name: "Savin Stevens",
        gender: "male",
        img: "https://cdn.balkan.app/shared/m10/1.jpg",
    },
];

var nodeBinding = {
    field_0: "name",
    img_0: "img",
};

export default function HomePage() {
    return (
        <div>
            <div id="tree"></div>
            <Familytree nodes={data} nodeBinding={nodeBinding} />
        </div>
    );
}*/
export default function BalkanCompTest() {
    return <div>test</div>;
}
