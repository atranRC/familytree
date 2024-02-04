import { unstable_getServerSession } from "next-auth";
import dbConnect from "../../../../lib/dbConnect";
import Users from "../../../../models/Users";
import { authOptions } from "../../auth/[...nextauth]";

export default async function handler(req, res) {
    const {
        query: { email },
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
                const users = await Users.find({ email: email });
                res.status(200).json({
                    data: { pagination: { count: 1, pageCount: 1 }, users },
                });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        /*
        case "PUT":
            try {
                const user = await Users.findByIdAndUpdate(id, req.body, {
                    new: true,
                    runValidators: true,
                });
                if (!user) {
                    return res.status(400).json({ success: false });
                }
                res.status(200).json({ success: true, data: user });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

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
