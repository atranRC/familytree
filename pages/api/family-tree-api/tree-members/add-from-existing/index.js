import dbConnect from "../../../../../lib/dbConnect";
import TreeMembers from "../../../../../models/TreeMembers";
import Users from "../../../../../models/Users";

//create user
//if father
//add created user to tree members with no parent id
//edit parent id of selected node
//if child
//add created user to tree members with parent id

//json bod
//new user info
//relation type
//treeid
//selectedTreeMemberData
//attributes
export default async function handler(req, res) {
    const { method } = req;

    await dbConnect();

    switch (method) {
        /*case "GET":
            try {
                const treeMembers = await TreeMembers.find(
                    {}
                ); 
                res.status(200).json({ success: true, data: treeMembers });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;*/
        case "POST":
            try {
                //console.log(req.body);
                //const newUser = await Users.create(req.body.newUserInfo);
                /*
                    treeId: selectedTreeMemberData.treeId,
                    id: selectedSearchResultCard._id.toString(),
                    name: selectedSearchResultCard.name,
                    sex: selectedSearchResultCard.sex,
                    parent_id: "",
                    attributes: {
                        spouse: "",
                        status: memberLifeStatus,
                    },
                    fathers_name: "",
                    mothers_name: "",
                    spouse: "",
                    canPost: false,
                */
                if (req.body.relationType === "father") {
                    const bod = {
                        treeId: req.body.selectedTreeMemberData.treeId,
                        id: req.body.id,
                        name: req.body.name,
                        sex: req.body.sex,
                        parent_id: "",
                        attributes: req.body.attributes,
                        mothers_name: req.body.mothers_name,
                        fathers_name: req.body.fathers_name,
                        spouse: req.body.spouse,
                        canPost: false,
                    };
                    const newTreeMember = await TreeMembers.create(bod);
                    const updatedTreeNode = await TreeMembers.findByIdAndUpdate(
                        req.body.selectedTreeMemberData._id,
                        {
                            parent_id: req.body.id,
                        },
                        {
                            new: true,
                            runValidators: true,
                        }
                    );

                    res.status(201).json({
                        success: true,
                        data: updatedTreeNode,
                    });
                } else if (req.body.relationType === "child") {
                    const bod = {
                        treeId: req.body.selectedTreeMemberData.treeId,
                        id: req.body.id,
                        name: req.body.name,
                        sex: req.body.sex,
                        parent_id: req.body.parent_id,
                        attributes: req.body.attributes,
                        mothers_name: req.body.mothers_name,
                        fathers_name: req.body.fathers_name,
                        spouse: req.body.spouse,
                        canPost: false,
                    };
                    const newTreeMember = await TreeMembers.create(bod);
                    res.status(201).json({
                        success: true,
                        data: newTreeMember,
                    });
                } else if (req.body.relationType === "sibling") {
                    const bod = {
                        treeId: req.body.selectedTreeMemberData.treeId,
                        id: req.body.id,
                        name: req.body.name,
                        sex: req.body.sex,
                        parent_id: req.body.selectedTreeMemberData.parent_id,
                        attributes: req.body.attributes,
                        mothers_name: req.body.mothers_name,
                        fathers_name: req.body.fathers_name,
                        spouse: req.body.spouse,
                        canPost: false,
                    };
                    const newTreeMember = await TreeMembers.create(bod);
                    res.status(201).json({
                        success: true,
                        data: newTreeMember,
                    });
                } else {
                    res.status(400).json({ success: false });
                }
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
