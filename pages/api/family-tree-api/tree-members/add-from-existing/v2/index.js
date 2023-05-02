import dbConnect from "../../../../../../lib/dbConnect";
import TreeMembersB from "../../../../../../models/TreeMembersB";

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
                //find and update tree member with treeId and id
                const updatedTreeNode = await TreeMembersB.findByIdAndUpdate(
                    req.body.treeMemberDocumentId,
                    { taggedUser: req.body.selectedSearchResultCardUserId }
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
