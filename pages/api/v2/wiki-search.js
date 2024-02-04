import dbConnect from "../../../lib/dbConnect";
import Wikis from "../../../models/Wikis";

export default async function handler(req, res) {
    let {
        query: { searchTerm, page, pageSize },
        method,
    } = req;

    await dbConnect();

    switch (method) {
        case "GET":
            try {
                page = parseInt(page, 10) || 1;
                pageSize = parseInt(pageSize, 10) || 10;

                const stories = await Wikis.aggregate([
                    {
                        $facet: {
                            data: [
                                {
                                    $match: {
                                        title: {
                                            $regex: new RegExp(searchTerm, "i"),
                                        },
                                        isPublished: true,
                                    },
                                },
                                { $sort: { updatedAt: -1 } },
                                { $skip: (page - 1) * pageSize },
                                { $limit: pageSize },
                            ],
                            count: [
                                {
                                    $match: {
                                        title: {
                                            $regex: new RegExp(searchTerm, "i"),
                                        },
                                        isPublished: true,
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
                res.status(200).json(stories);
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
