import { unstable_getServerSession } from "next-auth";
import dbConnect from "../../../../lib/dbConnect";
import Users from "../../../../models/Users";
import { authOptions } from "../../auth/[...nextauth]";
import Events from "../../../../models/Events";
import { getSessionProfileRelationUtil } from "../../../../utils/dbUtils";

export default async function handler(req, res) {
    const {
        query: { unclaimedProfileId, isNewUser },
        method,
    } = req;

    const session = await unstable_getServerSession(req, res, authOptions);
    if (!session) {
        res.status(401).json({ message: "You must be logged in." });
        return;
    }

    await dbConnect();

    switch (method) {
        case "GET":
            try {
                const user = await Users.findById(id);
                res.status(200).json(user);
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        case "PUT":
            try {
                //console.log("editing unclaimed", req.body);
                const sessionProfileRelation =
                    await getSessionProfileRelationUtil(
                        session,
                        unclaimedProfileId
                    );
                if (sessionProfileRelation !== "owner") {
                    res.status(401).json({ message: "UNAUTHORIZED" });
                    return;
                }
                const user = await Users.findByIdAndUpdate(
                    unclaimedProfileId,
                    req.body,
                    {
                        new: true,
                        runValidators: true,
                    }
                );

                res.status(200).json(user);
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        /*
        case "DELETE":
            try {
                const deletedUser = await Users.deleteOne({ _id: id });
                if (!deletedUser) {
                    return res.status(400).json({ success: false });
                }
                res.status(200).json({ success: true, data: {} });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
*/
        default:
            res.status(400).json({ success: false });
            break;
    }
}
