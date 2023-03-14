import { useState, useEffect } from "react";
//https://bkrem.github.io/react-d3-tree/docs/
//https://bkrem.github.io/react-d3-tree-demo/

//https://www.youtube.com/watch?v=jC-6X6HDAxQ
import Tree from "react-d3-tree";
import arrayToTree from "array-to-tree";
import axios from "axios";

/*
-when component mounts, the ancestors and their children are fetched
-ancestors and children are set to treeitemsflatarray state
-a useeffect with a dependancy variable of treeitemsflatarray sets the 
treeitems state (which is fed to the d3-tree)
    -before it sets treeitems, the fetched data is converted into a structure
     that supports the array-to-tree library

-when a node is clicked:
    -the children of that node are fetched
    -they are concatnated to treeitemsflatarray
    -triggers a useeffect that sets treeitems state with the new value of treeitemsflatarray
*/
export default function TreeDemo() {
    const [treeItemsFlatArray, setTreeItemsFlatArray] = useState();
    const [treeItems, setTreeItems] = useState();

    const nodeClickHandler = (prop) => {
        const idArray = treeItemsFlatArray.map((user) => user._id.toString());
        //fetch nodes children
        console.log("ellow children");
        axios.get("/api/users/children/" + prop.data.id).then((res) => {
            if (res.data.children.length > 0) {
                const newChildren = res.data.children.filter(
                    (child) => idArray.indexOf(child._id.toString()) === -1
                );
                if (newChildren.length > 0) {
                    const withNewChildren = [
                        ...treeItemsFlatArray,
                        ...newChildren,
                    ];
                    setTreeItemsFlatArray(withNewChildren);
                }
            } else {
                console.log("no children");
            }
        });
        //check if they exist in idArray
        //concatnate if they dont
        console.log(idArray);
        console.log(prop);
    };

    //fetch fam tree items of user on mount
    useEffect(() => {
        axios
            .get("/api/users/flat-tree/639a14b0c63401604d62a980")
            .then((res) => {
                console.log(res.data.tree);
                //setTreeItems(arrayToTree(res.data.tree));
                setTreeItemsFlatArray(res.data.tree);
            });
    }, []);

    //set treeitems to feed to d3-tree
    useEffect(() => {
        if (treeItemsFlatArray) {
            setTreeItems(
                arrayToTree(
                    treeItemsFlatArray.map((user) => {
                        return {
                            id: user._id.toString(),
                            name: user.username,
                            parent_id: user.parents.father,
                        };
                    })
                )
            );
        }
    }, [treeItemsFlatArray]);

    return (
        // `<Tree />` will fill width/height of its container; in this case `#treeWrapper`.
        <div style={{ width: "100%", height: "20em" }}>
            {treeItems ? (
                <Tree
                    data={treeItems}
                    orientation="vertical"
                    collapsible={false}
                    onNodeClick={nodeClickHandler}
                    transitionDuration="1000"
                />
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}
