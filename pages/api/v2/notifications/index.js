import { unstable_getServerSession } from "next-auth";
import dbConnect from "../../../../lib/dbConnect";
import { authOptions } from "../../auth/[...nextauth]";
import Notifications from "../../../../models/Notifications";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
    let {
        query: { id, page, pageSize },
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
                page = parseInt(page, 10) || 1;
                pageSize = parseInt(pageSize, 10) || 10;

                const notifications = await Notifications.aggregate([
                    {
                        $facet: {
                            //metadata: [{ $count: "totalCount" }],
                            data: [
                                {
                                    $match: {
                                        targetUserId: ObjectId(session.user.id),
                                    },
                                },
                                { $sort: { createdAt: -1 } },
                                { $skip: (page - 1) * pageSize },
                                { $limit: pageSize },
                            ],
                            count: [
                                {
                                    $match: {
                                        targetUserId: ObjectId(session.user.id),
                                    },
                                },
                                { $count: "total" },
                            ],
                        },
                    },
                    { $unwind: "$count" },
                    {
                        $addFields: {
                            count: "$count.total",
                        },
                    },
                ]);
                res.status(200).json(notifications);
            } catch (error) {
                console.log(error);
                res.status(400).json({ success: false });
            }
            break;

        case "POST":
            try {
                //console.log(req.body);
                const notification = await Notifications.create({
                    ...req.body,
                    sourceUserId: session.user.id,
                    sourceUserName: session.user.name,
                });
                res.status(201).json(notification);
            } catch (error) {
                console.log(error);
                res.status(400).json({ success: false });
            }
            break;
        case "PUT":
            try {
                const notification = await Notifications.findOneAndUpdate(
                    {
                        _id: ObjectId(id),
                        targetUserId: ObjectId(session.user.id),
                    },
                    req.body,
                    {
                        new: true,
                        runValidators: true,
                    }
                );

                res.status(200).json(notification);
            } catch (error) {
                console.log(error);
                res.status(400).json({ success: false });
            }
            break;
        case "DELETE":
            try {
                const notification = await Notifications.findOneAndDelete({
                    _id: ObjectId(id),
                    targetUserId: ObjectId(session.user.id),
                });

                res.status(200).json(notification);
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
