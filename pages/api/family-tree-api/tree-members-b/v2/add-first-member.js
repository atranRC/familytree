import { unstable_getServerSession } from "next-auth";
import dbConnect from "../../../../../lib/dbConnect";
import FamilyTrees from "../../../../../models/FamilyTrees";
import { authOptions } from "../../../auth/[...nextauth]";
import { ObjectId } from "mongodb";
import { getSessionTreeRelationUtil } from "../../../../../utils/dbUtils";
import TreeMembersB from "../../../../../models/TreeMembersB";
import Users from "../../../../../models/Users";

/**
 * a post method to add the first member of a newly created FamilyTree
 * @param {*} req accepts a body of FamilyTree
 * @param {*} res
 * @returns {TreeMembersB} sends a new TreeMembersB document
 */
export default async function handler(req, res) {
    let {
        query: { treeId, mode },
        method,
    } = req;

    await dbConnect();

    const session = await unstable_getServerSession(req, res, authOptions);
    if (!session) {
        res.status(401).json({ message: "You must be logged in." });
        return;
    }
    switch (method) {
        /*      case "GET":
            try {
                const relationship = await getSessionTreeRelationUtil(
                    session,
                    treeId,
                    mode
                );
                res.status(200).json(relationship);
            } catch (error) {
                //console.log(error);
                res.status(400).json({ success: false });
            }
            break;
*/
        case "POST":
            try {
                //check if session is owner
                const relationship = await getSessionTreeRelationUtil(
                    session,
                    req.body._id.toString(), //treeId
                    "owner"
                );
                if (relationship === "owner") {
                    //get user
                    const user = await Users.findById(session.user.id).select(
                        "name image sex"
                    );
                    //console.log(user);
                    //create membership
                    const membership = await TreeMembersB.create({
                        treeId: req.body._id,
                        treeName: req.body.tree_name,
                        id: user._id.toString(), //session user id
                        nodeInfo: {
                            id: user._id.toString(), //session user id
                            name: user?.name,
                            gender: user?.sex,
                            img: user?.image,
                        },
                        taggedUser: user._id, //session user id
                        canPost: false,
                    });
                    //console.log(membership);
                    res.status(200).json(membership);
                    return;
                }
                res.status(400).json({ success: false });
            } catch (error) {
                //console.log(error);
                res.status(400).json({ success: false });
            }
            break;
        default:
            res.status(400).json({ success: false });
            break;
    }
}
