import dbConnect from "../../../../lib/dbConnect";
import FamilyTrees from "../../../../models/FamilyTrees";
import { ObjectId } from "mongodb";
import Users from "../../../../models/Users";
import TreeMembers from "../../../../models/TreeMembers";
import Collabs from "../../../../models/Collabs";
import arrayToTree from "array-to-tree";
export default async function handler(req, res) {
    const {
        query: { id, sessionEmail, userOwnerId, treeOwnerId },
        method,
    } = req;

    await dbConnect();

    switch (method) {
        case "GET" /* get all users that are collaborators*/:
            //console.log(userOwnerId, treeOwnerId);
            try {
                /*const sessionUser = await Users.findOne({
                    email: sessionEmail,
                });*/
                const treeMembers = await TreeMembers.find({ treeId: id });
                //const collabs = await Collabs.find({ treeId: id });

                if (!treeMembers) {
                    return res.status(400).json({ success: false });
                }
                /*
                 if (!sessionUser) {
                    return res.status(400).json({ success: false });
                }
                if (!collabs) {
                    return res.status(400).json({ success: false });
                }

                let mid = [];
                treeMembers.map((member) => {
                    mid.push(member.id);
                });

                let collabsIdArray = [];
                collabs.map((member) => {
                    mid.push(member.userId);
                });

                const mdata = treeMembers.map((mem) => {
                    let person_name = mem.name;
                    let spouse_name = mem.attributes.spouse;
                    if (userOwnerId !== treeOwnerId) {
                        console.log("this is ownerrrrr");
                        //check if user is member
                        if (!mid.includes(userOwnerId)) {
                            if (
                                collabsIdArray.length < 1 ||
                                (collabsIdArray.length > 0 &&
                                    !collabsIdArray.includes(userOwnerId))
                            ) {
                                console.log("this is not collab");
                                if (mem.attributes.status === "living") {
                                    person_name = "Person";
                                    spouse_name = "Spouse";
                                }
                            }
                        }
                    }

                    return {
                        _id: mem._id.toString(),
                        treeId: mem.treeId,
                        id: mem.id,
                        name: person_name,
                        parent_id: mem.parent_id,
                        attributes: {
                            spouse: spouse_name,
                            status: mem.attributes.status,
                        },
                    };
                });

                const arrayToTreeData = arrayToTree(
                    JSON.parse(JSON.stringify(mdata)),
                    {
                        parentProperty: "parent_id",
                        customID: "_id",
                        rootID: "_id",
                    }
                );
                console.log(arrayToTreeData);*/

                res.status(200).json({ success: true, data: treeMembers });
            } catch (error) {
                console.log(error);
                res.status(400).json({ success: false });
            }
            break;

        case "PUT":
            try {
                const tree = await TreeMembers.findByIdAndUpdate(id, req.body, {
                    new: true,
                    runValidators: true,
                });
                if (!tree) {
                    return res.status(400).json({ success: false });
                }
                res.status(200).json({ success: true, data: tree });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        case "DELETE" /* Delete a model by its ID */:
            try {
                const deletedPet = await Pet.deleteOne({ _id: id });
                if (!deletedPet) {
                    return res.status(400).json({ success: false });
                }
                res.status(200).json({ success: true, data: {} });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        default:
            res.status(400).json({ success: false });
            break;
    }
}
