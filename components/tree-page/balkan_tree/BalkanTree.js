//import FamilyTree from "@balkangraph/familytree.js";
import FamilyTree from "../../../lib/familytree.js";
import { Modal } from "@mantine/core";
import axios from "axios";
import { useState } from "react";
import { useQuery } from "react-query";

//https://stackoverflow.com/a/6895877 (for this.element is null)

function Familytree(props) {
    if (typeof window === "object") {
        let t_options = {
            //template: "hugo",
            //mode: "dark",
            //lazyLoading: true,
            editForm: {
                buttons: {
                    edit: null,
                    share: null,
                    pdf: null,
                    remove: null,
                    //remove: { text: "remove" },
                },
            },
            nodeMenu: {
                tagUser: {
                    text: "Tagged User",
                    onClick: (d) => {
                        console.log(d);
                        props.setBalkanMemberId(d);
                        props.setOpened(true);
                    },
                },
            },
            miniMap: true,
            partnerChildrenSplitSeparation: 90,
            /*nodeMenu: {
                tagUser: {
                    text: "Tag a user",
                    onClick: (d) => console.log(d),
                },
            },*/
            //nodeTreeMenu: false,
            //nodeMouseClick: FamilyTree.none,
            //mouseScrool: FamilyTree.none,
            nodeBinding: props.nodeBinding,
            nodes: props.nodes,
        };
        if (
            props.sessionTreeRelation === "owner" ||
            props.sessionTreeRelation === "collab"
        ) {
            t_options = {
                //template: "hugo",
                //mode: "dark",
                //lazyLoading: true,
                editForm: {
                    buttons: {
                        //edit: null,
                        share: null,
                        pdf: null,
                        //remove: null,
                        remove: { text: "remove" },
                    },
                },
                miniMap: true,
                partnerChildrenSplitSeparation: 90,
                nodeMenu: {
                    tagUser: {
                        text: "Tagged User",
                        onClick: (d) => {
                            console.log(d);
                            props.setBalkanMemberId(d);
                            props.setOpened(true);
                        },
                    },
                },
                nodeTreeMenu: true,
                //nodeMouseClick: FamilyTree.none,
                //mouseScrool: FamilyTree.none,
                nodeBinding: props.nodeBinding,
                nodes: props.nodes,
            };
        }
        var chart = new FamilyTree(
            document.getElementById("tree_balkan"),
            t_options
        );
        chart.onNodeClick((e) => {
            //console.log("node cl", e.node);
            //return false; to cancel the operation
        });
        //node update handler (when node is added or edited)
        chart.onUpdateNode(async (args) => {
            //return false; to cancel the operation
            if (args.addNodesData.length > 0) {
                console.log("added node", args);
                const bod = {
                    treeId: props.treeIdProp,
                    treeName: props.treeNameProp,
                    updateData: {
                        nodesAdded: args.addNodesData,
                        nodesRemoved: args.removeNodeId,
                        nodesUpdated: args.updateNodesData,
                    },
                };
                try {
                    const addMemberRes = await axios.post(
                        "/api/family-tree-api/tree-members-b/add-member/",
                        bod
                    );
                    console.log(addMemberRes.data.data);
                } catch (err) {
                    console.log(err);
                }
            }

            if (args.addNodesData.length < 1) {
                console.log("edited info", args);
                const bod = {
                    treeId: props.treeIdProp,
                    treeName: props.treeNameProp,
                    updateData: {
                        nodesUpdated: args.updateNodesData,
                    },
                };
                try {
                    const editMemberRes = await axios.post(
                        "/api/family-tree-api/tree-members-b/edit-member/",
                        bod
                    );
                    console.log(editMemberRes.data.data);
                } catch (err) {
                    console.log(err);
                }
            }

            if (args.removeNodeId) {
                console.log("removed node", args);
            }
        });

        chart.editUI.on("button-click", async function (sender, args) {
            if (args.name == "remove") {
                var data = chart.get(args.nodeId);
                console.log("removing", data.id);
                if (chart.canRemove(data.id)) {
                    const bod = {
                        treeId: props.treeIdProp,
                        id: data.id,
                    };
                    try {
                        const removeMemberRes = await axios.post(
                            "/api/family-tree-api/tree-members-b/remove-member/",
                            bod
                        );
                        console.log("", removeMemberRes.data.data);
                        chart.removeNode(data.id);
                    } catch (err) {
                        console.log(err);
                    }
                }

                //window.open(data.map);
            }
        });
        //chart.on("adding", (s) => console.log(s));
    }
    return null;
}

var tdata = [
    {
        id: "1",
        //pids: ["2"],
        name: "loading tree",
        gender: "female",
        img: "",
    },
];

var nodeBinding = {
    field_0: "name",
    img_0: "img",
};

export default function BalkanTree({
    treeIdProp,
    treeNameProp = "",
    sessionTreeRelation,
    setBalkanMemberId,
    setOpened,
}) {
    // const [data2, setData2] = useState(tdata);
    const [fetchedTreeMembers, setFetchedTreeMembers] = useState(tdata);

    const { isLoading, isFetching, data, refetch, isError, error } = useQuery({
        queryKey: "fetch_balkan_tree_members",
        queryFn: () => {
            return axios.get(
                `/api/family-tree-api/tree-members-b/members-of-tree/${treeIdProp}`
            );
        },
        // enabled: false,
        refetchOnWindowFocus: false,
        onSuccess: (d) => {
            console.log("members of", d.data.data);
            const memInfo = d.data.data.map((m) => {
                return m.nodeInfo;
            });
            console.log("aaaaaaa", memInfo);
            setFetchedTreeMembers(memInfo);
        },
    });
    /*
    if (!fetchedTreeMembers) {
        return <div>loading</div>;
    }*/

    return (
        <Familytree
            nodes={fetchedTreeMembers}
            nodeBinding={nodeBinding}
            treeIdProp={treeIdProp}
            treeNameProp={treeNameProp}
            sessionTreeRelation={sessionTreeRelation}
            setBalkanMemberId={setBalkanMemberId}
            setOpened={setOpened}
        />
    );
}
