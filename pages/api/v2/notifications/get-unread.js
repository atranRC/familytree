import { unstable_getServerSession } from "next-auth";
import dbConnect from "../../../../lib/dbConnect";
import { authOptions } from "../../auth/[...nextauth]";
import Notifications from "../../../../models/Notifications";

export default async function handler(req, res) {
    const {
        query: { profileId },
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
                const unreadNotifications = await Notifications.countDocuments({
                    targetUserId: session.user.id,
                    status: "unread",
                });

                res.status(201).json(unreadNotifications);
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
