/*
https://www.mongodb.com/docs/manual/reference/method/db.collection.bulkWrite/#examples
{
    addNodesData[array]
    removeNodeId
    updateNodesData[array]
}
for addNodesData:
    - map through addNodesData
        - return {
            treeId: treeId,
            id: nd.id,
            nodeInfo: and
        }
    - insert many (mapped const)

for updateNodesData:
    - map through updateNodesData
        -return {
            updateOne: {
                filter: {
                    treeId: treeId,
                    id: und.id
                },
                update: {
                    $set: {
                        nodeInfo: und
                    }
                }
            }
        }
*/

import dbConnect from "../../../../../lib/dbConnect";
import TreeMembersB from "../../../../../models/TreeMembersB";

export default async function handler(req, res) {
    const { method } = req;

    await dbConnect();

    switch (method) {
        /*case "GET":
            try {
                const familyTrees = await FamilyTrees.find(
                    {}
                ); 
                res.status(200).json({ success: true, data: familyTrees });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;*/
        case "POST":
            try {
                const nodesToUpdate = req.body.updateData.nodesUpdated.map(
                    (n) => {
                        return {
                            updateOne: {
                                filter: {
                                    treeId: req.body.treeId,
                                    id: n.id,
                                },
                                update: {
                                    $set: {
                                        nodeInfo: n,
                                    },
                                },
                            },
                        };
                    }
                );

                const updatedTreeMembers = await TreeMembersB.bulkWrite(
                    nodesToUpdate
                );
                console.log("nodes updated", updatedTreeMembers);
                res.status(201).json({
                    success: true,
                    data: updatedTreeMembers,
                });
            } catch (error) {
                console.log(error);
                res.status(400).json({ success: false });
            }
            break;
        default:
            res.status(400).json({ success: false });
            break;
    }
}
