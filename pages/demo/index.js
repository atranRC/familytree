import { useState, useEffect } from "react";
import Tree from "react-d3-tree";
import arrayToTree from "array-to-tree";
import axios from "axios";

import DetailAndAddTabs from "../../components/addUserForm";

export default function Home() {
    const [treeItemsFlatArray, setTreeItemsFlatArray] = useState();
    const [treeItems, setTreeItems] = useState();
    const [selectedUser, setSelectedUser] = useState();
    const [allUsers, setAllUsers] = useState([]);
    const [treeIsLoading, setTreeIsLoading] = useState(false);

    const nodeClickHandler = (prop) => {
        setTreeIsLoading(true);
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
            setTreeIsLoading(false);
        });
        //check if they exist in idArray
        //concatnate if they dont
        console.log(idArray);
        console.log(prop);
    };
    useEffect(() => {
        axios.get("/api/users").then((res) => {
            console.log(res.data.users);
            //setTreeItems(arrayToTree(res.data.tree));
            setAllUsers(res.data.users);
        });
    }, []);
    //when user is selected, fetch fam tree items of user on mount
    useEffect(() => {
        if (selectedUser && selectedUser.parents.father) {
            setTreeIsLoading(true);
            axios
                .get("/api/users/flat-tree/" + selectedUser._id.toString())
                .then((res) => {
                    console.log(res.data.tree);
                    //setTreeItems(arrayToTree(res.data.tree));
                    setTreeItemsFlatArray(res.data.tree);
                    setTreeIsLoading(false);
                });
        }
    }, [selectedUser]);

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
        <div className="h-screen flex flex-row gap-4 p-10 text-center ">
            <div className="overflow-auto p-5 basis-1/5 border-rose-500 border-2 rounded-lg">
                <h3 className="font-bold">Users</h3>
                <ul>
                    {allUsers.map((user) => {
                        return (
                            <li
                                key={user.username}
                                className={`text-justify hover:text-sky-400 cursor-pointer ${
                                    selectedUser &&
                                    selectedUser._id.toString() ===
                                        user._id.toString() &&
                                    "text-sky-400"
                                }`}
                                onClick={() => setSelectedUser(user)}
                            >
                                {user.username}
                            </li>
                        );
                    })}
                </ul>
            </div>
            <div className="p-5 basis-3/5 border-rose-500 border-2 rounded-lg">
                <h3 className="font-bold">Tree</h3>
                {treeIsLoading && (
                    <h5 className="text-sky-400/75 italic"> fetching...</h5>
                )}
                {selectedUser ? (
                    <div style={{ width: "100%", height: "30em" }}>
                        {treeItems ? (
                            <Tree
                                data={treeItems}
                                orientation="vertical"
                                collapsible={false}
                                onNodeClick={nodeClickHandler}
                                enableLegacyTransitions={true}
                            />
                        ) : (
                            <p>Loading...</p>
                        )}
                    </div>
                ) : (
                    <h5>Please select user to view</h5>
                )}
            </div>
            <div className="p-5 basis-1/5 border-rose-500 border-2 rounded-lg">
                <h3 className="font-bold">User Info</h3>
                <DetailAndAddTabs
                    allUsers={allUsers}
                    setAllUsers={setAllUsers}
                    selectedUser={selectedUser}
                    treeItemsFlatArray={treeItemsFlatArray}
                    setTreeItemsFlatArray={setTreeItemsFlatArray}
                />
            </div>
        </div>
    );
}
