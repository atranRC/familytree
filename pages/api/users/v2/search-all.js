import dbConnect from "../../../../lib/dbConnect";
import { ObjectId } from "mongodb";
import Users from "../../../../models/Users";

const USERS_PER_PAGE = 10;

export default async function handler(req, res) {
    const {
        query: { p, searchTerm },
        method,
    } = req;

    const page = p || 1;
    const dbQuery = [
        {
            $search: {
                index: "searchUsers",
                text: {
                    query: searchTerm,
                    /*path: {
                        wildcard: "*",
                    },*/
                    path: ["name", "email", "fathers_name", "last_name"],
                    fuzzy: {
                        maxExpansions: 700,
                        maxEdits: 2,
                    },
                },
            },
        },
        { $setWindowFields: { output: { totalCount: { $count: {} } } } },
        { $skip: (page - 1) * USERS_PER_PAGE },
        { $limit: USERS_PER_PAGE },
    ];

    await dbConnect();

    switch (method) {
        case "GET":
            try {
                const users = await Users.aggregate(dbQuery);

                if (!users) {
                    return res.status(400).json({ success: false });
                }
                if (users.length < 1) {
                    return res.status(200).json({
                        success: true,
                        data: { pagination: { count: 0, pageCount: 0 }, users },
                    });
                }
                const count = users[0].totalCount;
                const pageCount = Math.floor(count / USERS_PER_PAGE) + 1;
                res.status(200).json({
                    success: true,
                    data: { pagination: { count, pageCount }, users },
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
