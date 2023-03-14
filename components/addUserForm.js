import { useState } from "react";
import axios from "axios";

function AddForm({ allUsers, setAllUsers }) {
    const [name, setName] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const uploadHandler = () => {
        setIsLoading(true);
        axios
            .post("/api/users/register", {
                name: name,
            })
            .then((res) => {
                setAllUsers([...allUsers, res.data.doc]);
                setIsLoading(false);
            })
            .catch((err) => {
                console.log(err);
            });
    };
    return (
        <>
            <div className="form-control input-group-sm mt-5 mb-5">
                <label className="input-group ">
                    <span>name</span>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        type="text"
                        className="input input-bordered"
                    />
                </label>
            </div>
            <button onClick={uploadHandler} className="btn btn-sm">
                {isLoading ? <>...</> : <>Add User</>}
            </button>
        </>
    );
}

function UserDetailComp({
    selectedUser,
    allUsers,
    treeItemsFlatArray,
    setTreeItemsFlatArray,
    setAllUsers,
}) {
    const [selectedRship, setSelectedRship] = useState("father");
    const [rshipTarget, setRshipTarget] = useState();
    const [isLoading, setIsLoading] = useState(false);
    //what happens when a user adds a father
    //parents.father field updated to father id
    //ancestors updated to father's ancestors + father's id
    //what happens when a user adds a sibling
    //parents.father field updated to parents.father of targetsibling
    //ancestors updated to ancestors of target sibling
    const addRshipHandler = () => {
        setIsLoading(true);
        const rshipTargetUser = allUsers.filter(
            (user) => user._id.toString() === rshipTarget
        )[0];
        axios
            .post("/api/users/add-relationship", {
                uid: selectedUser._id.toString(),
                name: selectedUser.username,
                newFather:
                    selectedRship === "father"
                        ? rshipTargetUser._id.toString()
                        : rshipTargetUser.parents.father,
                newAncestors:
                    selectedRship === "father"
                        ? [
                              ...rshipTargetUser.ancestors,
                              rshipTargetUser._id.toString(),
                          ]
                        : rshipTargetUser.ancestors,
            })
            .then((res) => {
                console.log(res.data);
                setTreeItemsFlatArray([
                    ...treeItemsFlatArray,
                    res.data.updatedUser,
                ]);
                const newAllUsers = allUsers.map((u) => {
                    if (
                        u._id.toString() === res.data.updatedUser._id.toString()
                    ) {
                        return res.data.updatedUser;
                    } else {
                        return u;
                    }
                });
                setAllUsers(newAllUsers);
                setIsLoading(false);
            })
            .catch((err) => {
                console.log(err);
            });
    };
    return (
        <>
            {selectedUser ? (
                <div className="flex flex-col gap-5 mt-5 ">
                    <div className="border border-sky-500 p-3 rounded-md text-left">
                        <div>Name: {selectedUser.username}</div>
                        <div>Id: {selectedUser._id.toString()}</div>
                    </div>
                    {!selectedUser.parents.father && (
                        <div className="border border-sky-500 p-3 rounded-md">
                            Add a relationship
                            <select
                                className="select select-bordered select-sm w-full max-w-xs"
                                onChange={(e) =>
                                    setSelectedRship(e.target.value)
                                }
                            >
                                <option disabled>select type</option>
                                <option>father</option>
                                <option>sibling</option>
                            </select>
                            select user
                            <select
                                className="select select-bordered select-sm w-full max-w-xs"
                                onChange={(e) =>
                                    setRshipTarget(
                                        e.target.options[
                                            e.target.options.selectedIndex
                                        ].getAttribute("uid")
                                    )
                                }
                            >
                                <option disabled>select user</option>
                                {allUsers.map((user) => {
                                    return (
                                        <option
                                            key={user._id.toString()}
                                            uid={user._id.toString()}
                                        >
                                            {user.username}
                                        </option>
                                    );
                                })}
                            </select>
                            <button
                                className="btn btn-sm mt-5"
                                onClick={addRshipHandler}
                                disabled={isLoading}
                            >
                                {!isLoading ? <>add</> : <>...</>}
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <>Please select a user</>
            )}
        </>
    );
}

export default function DetailAndAddTabs({
    allUsers,
    setAllUsers,
    selectedUser,
    treeItemsFlatArray,
    setTreeItemsFlatArray,
}) {
    const [activeComp, setActiveComp] = useState("userDetail");

    return (
        <>
            <div className="tabs">
                <a
                    className={`tab tab-lifted ${
                        activeComp === "userDetail" && "tab-active"
                    }`}
                    onClick={() => setActiveComp("userDetail")}
                >
                    Detail
                </a>
                <a
                    className={`tab tab-lifted ${
                        activeComp === "addForm" && "tab-active"
                    }`}
                    onClick={() => setActiveComp("addForm")}
                >
                    New User
                </a>
            </div>
            {activeComp === "userDetail" ? (
                <UserDetailComp
                    selectedUser={selectedUser}
                    allUsers={allUsers}
                    treeItemsFlatArray={treeItemsFlatArray}
                    setTreeItemsFlatArray={setTreeItemsFlatArray}
                    setAllUsers={setAllUsers}
                />
            ) : (
                <AddForm allUsers={allUsers} setAllUsers={setAllUsers} />
            )}
        </>
    );
}
