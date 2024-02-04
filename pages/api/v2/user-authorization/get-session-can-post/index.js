import dbConnect from "../../../../../lib/dbConnect";
import { authOptions } from "../../../auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth";
import TreeMembersB from "../../../../../models/TreeMembersB";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
    const {
        query: { profileId },
        method,
    } = req;

    await dbConnect();

    switch (method) {
        case "GET":
            try {
                const session = await unstable_getServerSession(
                    req,
                    res,
                    authOptions
                );
                if (!session) {
                    res.status(401).json({ message: "You must be logged in." });
                    return;
                }

                console.log(session);

                //get trees profileId is in
                const treesProfileUserPromise = TreeMembersB.find({
                    taggedUser: ObjectId(profileId),
                });
                //get trees session user is in where canPost is true
                const treesSessionUserPromise = TreeMembersB.find({
                    taggedUser: ObjectId(session.user.id),
                    canPost: true,
                });
                //run the above two queries concurrently
                const [treesProfileUser, treesSessionUser] = await Promise.all([
                    treesProfileUserPromise,
                    treesSessionUserPromise,
                ]);

                const treesProfileUserArray = treesProfileUser.map(
                    (tree) => tree._id
                );
                const treesSessionUserArray = treesSessionUser.map(
                    (tree) => tree._id
                );
                console.log("trees profile", treesProfileUser);
                console.log("trees session", treesSessionUser);

                //check if any of treesessionuserarray elements are in treeprofileuserarray
                const canPost = treesSessionUserArray.some((tree) =>
                    treesProfileUserArray.includes(tree)
                );

                res.status(200).json(canPost);
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        default:
            res.status(400).json({ success: false });
            break;
    }
}
