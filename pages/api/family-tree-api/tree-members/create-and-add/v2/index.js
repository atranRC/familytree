import dbConnect from "../../../../../../lib/dbConnect";
import TreeMembersB from "../../../../../../models/TreeMembersB";
import Users from "../../../../../../models/Users";
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
                //create user
                //find and update tree member with treeId and id
                const newUser = await Users.create(req.body.newUserInfo);
                const updatedTreeNode = await TreeMembersB.findByIdAndUpdate(
                    req.body.treeMemberDocumentId,
                    { taggedUser: newUser._id }
                );
                /*const updatedTreeNode = await TreeMembersB.findByIdAndUpdate(
                    req.body.selectedTreeMemberData._id,
                    {
                        parent_id: newUser._id.toString(),
                    },
                    {
                        new: true,
                        runValidators: true,
                    }
                );*/

                res.status(201).json({
                    success: true,
                    data: updatedTreeNode,
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
