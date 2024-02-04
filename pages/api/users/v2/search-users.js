import dbConnect from "../../../../lib/dbConnect";
import { ObjectId } from "mongodb";
import Users from "../../../../models/Users";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

//const pageSize = 10;

export default async function handler(req, res) {
    let {
        query: { searchTerm, page, pageSize },
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

                const users = await Users.aggregate([
                    {
                        $search: {
                            index: "searchUsers",
                            text: {
                                query: searchTerm,
                                path: [
                                    "name",
                                    "email",
                                    "fathers_name",
                                    "last_name",
                                ],
                                fuzzy: {
                                    maxExpansions: 700,
                                    maxEdits: 2,
                                },
                            },
                        },
                    },
                    {
                        $setWindowFields: {
                            output: { totalCount: { $count: {} } },
                        },
                    },
                    { $skip: (page - 1) * pageSize },
                    { $limit: pageSize },
                ]);
                const count = users[0]?.totalCount || 0;
                const pageCount = Math.floor(count / pageSize) + 1 || 0;
                res.status(200).json({
                    data: users,
                    pagination: { count, pageCount },
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
