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
                    path: {
                        wildcard: "*",
                    },
                    fuzzy: {
                        maxExpansions: 100,
                        maxEdits: 2,
                    },
                },
            },
        },
        {
            $match: { owner: { $ne: "self" } },
        },
        { $setWindowFields: { output: { totalCount: { $count: {} } } } },
        { $skip: (page - 1) * USERS_PER_PAGE },
        { $limit: USERS_PER_PAGE },
    ];

    await dbConnect();

    switch (method) {
        case "GET":
            try {
                /*const skip = (page - 1) * USERS_PER_PAGE;
                const countPromise =
                    //Users.estimatedDocumentCount(dbQuery);
                    Users.countDocuments(dbQuery);
                const usersPromise = Users.aggregate(dbQuery);
                //.limit(USERS_PER_PAGE)
                //.skip(skip);
                // .sort({ date: "descending" });
                const [count, users] = await Promise.all([
                    countPromise,
                    usersPromise,
                ]);*/

                const users = await Users.aggregate(dbQuery);

                if (!users) {
                    return res.status(400).json({ success: false });
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

        /*case "PUT" :
            try {
                const writtenStory = await Users.findByIdAndUpdate(
                    id,
                    req.body,
                    {
                        new: true,
                        runValidators: true,
                    }
                );
                if (!writtenStory) {
                    return res.status(400).json({ success: false });
                }
                res.status(200).json({ success: true, data: writtenStory });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        case "DELETE":
            try {
                const deletedWrittenStory = await Users.deleteOne({
                    _id: id,
                });
                if (!deletedWrittenStory) {
                    return res.status(400).json({ success: false });
                }
                res.status(200).json({ success: true, data: {} });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;*/

        default:
            res.status(400).json({ success: false });
            break;
    }
}
