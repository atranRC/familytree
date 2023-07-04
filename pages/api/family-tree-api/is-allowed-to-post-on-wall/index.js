import dbConnect from "../../../../lib/dbConnect";
import { ObjectId } from "mongodb";
import TreeMembersB from "../../../../models/TreeMembersB";
import { getSession } from "next-auth/react";
//import Users from "../../../../models/Users";
//import TreeMembers from "../../../../models/TreeMembers";

export default async function handler(req, res) {
    const {
        query: { profileId, postApplicantId },
        method,
    } = req;

    await dbConnect();

    const session = await getSession({ req });

    switch (method) {
        case "GET":
            try {
                console.log("youve arrived here");
                let sessionProfileRelation = "none";
                //check if session user inside allowed common tree of profile

                //fetch profile trees where post = true
                const profileUserTreesPromise = TreeMembersB.find({
                    //id: context.query.id,
                    taggedUser: ObjectId(profileId),
                    canPost: true,
                });
                //fetch session trees
                const sessionUserTreesPromise = TreeMembersB.find({
                    //id: sessionUser._id.toString(),
                    taggedUser: ObjectId(postApplicantId),
                });
                const [profileUserTrees, sessionUserTrees] = await Promise.all([
                    profileUserTreesPromise,
                    sessionUserTreesPromise,
                ]);

                const profileUserTreesJson = JSON.parse(
                    JSON.stringify(profileUserTrees)
                );

                const sessionUserTreesJson = JSON.parse(
                    JSON.stringify(sessionUserTrees)
                );
                //check if session in one of profile trees
                const profileUserTreesId = profileUserTreesJson.map(
                    (t) => t.treeId
                );
                const sessionUserTreesId = sessionUserTreesJson.map(
                    (t) => t.treeId
                );
                const canPost = sessionUserTreesId.some(
                    (r) => profileUserTreesId.indexOf(r) >= 0
                );
                if (canPost) {
                    sessionProfileRelation = "relative";
                }
                res.status(200).json({
                    success: true,
                    data: sessionProfileRelation,
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
