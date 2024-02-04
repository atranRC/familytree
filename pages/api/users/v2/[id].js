import { unstable_getServerSession } from "next-auth";
import dbConnect from "../../../../lib/dbConnect";
import Users from "../../../../models/Users";
import { authOptions } from "../../auth/[...nextauth]";
import Events from "../../../../models/Events";

export default async function handler(req, res) {
    const {
        query: { id, isNewUser },
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
                //console.log("editng self", req.body);
                const user = await Users.findByIdAndUpdate(
                    session.user.id,
                    req.body,
                    {
                        new: true,
                        runValidators: true,
                    }
                );
                if (isNewUser === "true") {
                    const e = await Events.create({
                        userId: user._id,
                        userName: user.name,
                        authorId: session.user.id,
                        authorName: session.user.name,
                        type: "birth",
                        description: "Birthday",
                        location: req.body.birth_place,
                        eventDate: user.birthday || null,
                    });
                    console.log(e);
                }
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
