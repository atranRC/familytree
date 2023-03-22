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
                console.log(req.body);
                const newUser = await Users.create(req.body.newUserInfo);
                if (req.body.relationType === "father") {
                    const bod = {
                        treeId: req.body.selectedTreeMemberData.treeId,
                        id: newUser._id.toString(),
                        name: newUser.name,
                        parent_id: "",
                        attributes: req.body.attributes,
                        canPost: false,
                    };
                    const newTreeMember = await TreeMembers.create(bod);
                    const updatedTreeNode = await TreeMembers.findByIdAndUpdate(
                        req.body.selectedTreeMemberData._id,
                        {
                            parent_id: newUser._id.toString(),
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
                        id: newUser._id.toString(),
                        name: newUser.name,
                        parent_id: req.body.selectedTreeMemberData.id,
                        attributes: req.body.attributes,
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
